import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  X, ArrowRight, ArrowLeft, Send, CheckCircle2, MessageSquareCode,
  Ruler, CalendarDays, UserRound, Sofa, ChefHat, BedDouble, Tv, Phone,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn, generateRequestId, withTimeout } from '../lib/utils';
import { postNotify } from '../services/notify';
import { normalizeUzPhone } from '../lib/validation';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useAuth } from '../context/AuthContext';
import { CustomSelect } from './CustomSelect';
import { site } from '../config/site';
import {
  PORTFOLIO_CATEGORY_IDS,
  REQUEST_TIME_WINDOWS,
  type PortfolioCategoryId,
  type RequestTimeWindow,
} from '../types/domain';

const REQUEST_FORM_ID = 'measurement-request-form';
const FIRESTORE_TIMEOUT_MS = 8000;
const FALLBACK_IMAGE = '/images/sofa.webp';

const CATEGORY_ICONS: Record<PortfolioCategoryId, React.ElementType> = {
  soft: Sofa,
  kitchen: ChefHat,
  bedroom: BedDouble,
  living: Tv,
};

/** `YYYY-MM-DD` in the visitor's local time zone (a UTC date rolls back a day after 05:00 in Tashkent). */
const todayLocalISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Browsers ship no Uzbek month names (Intl renders "M10"), so those are spelled out here.
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

const formatDay = (isoDay: string, lang: string) => {
  const [year, month, day] = isoDay.split('-').map(Number);
  if (!year || !month || !day) return isoDay;
  if (lang.startsWith('ru') || lang.startsWith('en')) {
    return new Date(year, month - 1, day).toLocaleDateString(lang.startsWith('ru') ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long' });
  }
  return `${day}-${UZ_MONTHS[month - 1]}`;
};

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** What the visitor was looking at when they asked, if anything. */
  source?: {
    itemId: string;
    category: PortfolioCategoryId;
    image: string;
    title: string;
  };
}

/**
 * Three-step request for a home-measurement visit: what → when → who.
 *
 * Delivery goes to two sinks. Firestore first (so the visitor can track the build in
 * /profile and staff see it in /admin), Telegram second (the channel the office
 * watches). Either one succeeding is a success; the visitor only sees an error when
 * both fail. The Firestore leg is best-effort with a hard timeout, because a write
 * neither resolves nor rejects while a phone is offline.
 */
export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, source }) => {
  const { t, i18n } = useTranslation();
  const { user, isAnonymous } = useAuth();
  const [step, setStep] = useState(1);

  const [category, setCategory] = useState<PortfolioCategoryId>(source?.category ?? 'soft');
  const [area, setArea] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState<RequestTimeWindow>('afternoon');
  const [note, setNote] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [savedToDb, setSavedToDb] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // One id per open session, generated at first submit, so a retry after a failure
  // does not produce a second request with a different number.
  const requestIdRef = useRef<string | null>(null);
  // Top of the current step: scrolled back into view when the step changes on phones.
  const stepTopRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCategory(source?.category ?? 'soft');
      setArea('');
      setPreferredDate('');
      setPreferredTime('afternoon');
      setNote('');
      setUserName('');
      setUserPhone('');
      setIsSubmitting(false);
      setSubmitted(false);
      setSubmittedId('');
      setSavedToDb(false);
      setFormError(null);
      requestIdRef.current = null;
    }
  }, [isOpen, source?.category]);

  useBodyScrollLock(isOpen);

  // Android Back closes the sheet instead of discarding the whole form.
  // Trade-off: closing with X leaves the pushed entry, so the next Back is a no-op here.
  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ modal: 'request' }, '');
    const onPop = () => onClose();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  // On phones the sheet keeps the old scroll position when the step changes.
  const scrollToStep = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      requestAnimationFrame(() => stepTopRef.current?.scrollIntoView({ block: 'start' }));
    }
  };

  const handleNext = () => {
    setStep(step + 1);
    scrollToStep();
  };
  const handlePrev = () => {
    setStep(step - 1);
    scrollToStep();
  };

  const visitLabel = preferredDate
    ? `${formatDay(preferredDate, i18n.language)} · ${t(`request.time.${preferredTime}`)}`
    : t('request.summary.notSet');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!userName.trim() || !userPhone.trim()) return; // HTML `required` handles the message
    const phone = normalizeUzPhone(userPhone);
    if (!phone) {
      setFormError(t('validation.phone'));
      return;
    }
    setFormError(null);

    const requestId = (requestIdRef.current ??= generateRequestId());
    setSubmittedId(requestId);
    setIsSubmitting(true);

    // 1. Firestore, best-effort. Firebase is imported here rather than at the top so the
    //    Firestore SDK stays out of the Home route chunk (this modal is rendered there).
    let saved = false;
    try {
      const [{ auth, db }, { signInAnonymously }, fs] = await Promise.all([
        import('../lib/firebase'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);
      const uid =
        auth.currentUser?.uid ??
        (await withTimeout(signInAnonymously(auth), FIRESTORE_TIMEOUT_MS, 'auth_timeout')).user.uid;

      await withTimeout(
        fs.setDoc(fs.doc(db, 'requests', requestId), {
          id: requestId,
          userId: uid,
          client: userName.trim(),
          phone,
          category,
          sourceItemId: source?.itemId ?? null,
          preferredDate,
          preferredTime,
          area: area.trim(),
          note: note.trim(),
          status: 'new',
          lang: i18n.language,
          date: new Date().toISOString(),
          createdAt: fs.serverTimestamp(),
        }),
        FIRESTORE_TIMEOUT_MS,
        'firestore_timeout',
      );
      saved = true;
    } catch (error) {
      // Rules not published, Anonymous provider off, offline: the request still goes to Telegram.
      console.warn('Request not persisted:', error);
    }

    // 2. Telegram. The message text is built server-side (api/_lib/notify.ts) with HTML escaping.
    const result = await postNotify({
      kind: 'request',
      payload: {
        requestId,
        category,
        itemTitle: source?.title ?? '',
        preferredDate,
        preferredTime,
        area: area.trim(),
        note: note.trim(),
        name: userName.trim(),
        phone,
        saved,
      },
    });

    setIsSubmitting(false);
    setSavedToDb(saved);
    if (saved || result.ok) {
      setSubmitted(true);
    } else {
      setFormError(t('request.error'));
    }
  };

  const inputClass =
    'w-full bg-foreground/5 border border-foreground/10 focus:border-brand-gold rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors text-foreground';
  const labelClass = 'text-[11px] md:text-[9px] uppercase font-black tracking-widest text-foreground/55 block';
  const timeOptions = REQUEST_TIME_WINDOWS.map((id) => ({ value: id, label: t(`request.time.${id}`) }));

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/85 md:backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('request.eyebrow')}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] overflow-y-auto overflow-x-hidden overscroll-contain bg-background border-0 md:border border-foreground/10 rounded-none md:rounded-[3rem] shadow-2xl relative"
          >
            {/* Phone-only close control: stays above the fold in every state. */}
            <div className="md:hidden sticky top-0 z-30 flex justify-end px-4 pt-safe pb-2 bg-background/90 backdrop-blur-sm">
              <button
                type="button"
                onClick={onClose}
                aria-label={t('request.close')}
                className="w-11 h-11 rounded-full bg-foreground/8 border border-foreground/10 flex items-center justify-center text-foreground"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-full md:min-h-[500px]">

              {/* Left column: what this is, and a live summary */}
              <div className="md:col-span-5 bg-foreground/5 border-b md:border-b-0 md:border-r border-foreground/10 p-5 md:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">{t('request.eyebrow')}</span>
                  <h3 className="text-2xl font-editorial-title font-bold mt-2">{t('request.title')}</h3>
                  <p className="text-xs md:text-[11px] text-foreground/50 mt-1.5 leading-relaxed">{t('request.subtitle')}</p>

                  <div className="relative mt-5 md:mt-8 rounded-2xl overflow-hidden aspect-[4/3] bg-foreground/5">
                    <img
                      src={source?.image ?? FALLBACK_IMAGE}
                      alt={source?.title ?? ''}
                      width={1024}
                      height={1024}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {source?.title && (
                      <div className="absolute bottom-3 left-3 right-3 glass px-3 py-1.5 rounded-full text-[10px] font-bold text-foreground truncate">
                        {source.title}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-foreground/5">
                  <div className="flex justify-between items-center gap-3 text-[11px] md:text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                    <span>{t('request.summary.type')}</span>
                    <span className="text-foreground text-right">{t(`portfolio.category.${category}`)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-3 text-[11px] md:text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                    <span>{t('request.summary.visit')}</span>
                    <span className="text-brand-gold text-right">{visitLabel}</span>
                  </div>
                </div>
              </div>

              {/* Right column: the steps */}
              <div className="md:col-span-7 p-5 pb-safe md:p-8 md:pb-8 flex flex-col justify-between">

                {!submitted && (
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2 flex-1 mt-2">
                      {[1, 2, 3].map((s) => (
                        <div
                          key={s}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            s === step ? 'w-8 bg-brand-gold' : s < step ? 'w-3 bg-foreground/30' : 'w-3 bg-foreground/10'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] md:text-[9px] uppercase font-black text-foreground/45 tracking-widest ml-auto">
                        {t('request.stepOf', { current: step, total: 3 })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label={t('request.close')}
                      className="shrink-0 w-9 h-9 rounded-full bg-foreground/8 hover:bg-foreground/15 hidden md:flex items-center justify-center border border-foreground/10 text-foreground"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {/* Submitting */}
                {isSubmitting && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="absolute inset-0 border-2 border-brand-gold/30 border-t-brand-gold rounded-full"
                      />
                      <MessageSquareCode className="w-6 h-6 text-brand-gold animate-bounce" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-editorial-title font-bold">{t('request.submitting.title')}</h3>
                    <p className="text-[11px] tracking-widest md:text-[10px] md:tracking-[0.3em] text-foreground/45 uppercase mt-2">{t('request.submitting.desc')}</p>
                  </div>
                )}

                {/* Success */}
                {submitted && !isSubmitting && (
                  <div className="flex-1 flex flex-col justify-between py-4">
                    <div className="text-center space-y-4 py-8">
                      <div className="w-16 h-16 bg-brand-gold text-black rounded-full flex items-center justify-center mx-auto shadow-xl shadow-brand-gold/15">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-editorial-title font-bold text-foreground">{t('request.success.title')}</h3>
                      <p className="text-xs text-foreground/50 max-w-sm mx-auto leading-relaxed">{t('request.success.desc')}</p>
                    </div>

                    <div className="bg-foreground/[0.03] border border-foreground/5 rounded-[2rem] p-6 relative">
                      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pb-3 border-b border-foreground/5">
                        <span className="text-[10px] uppercase font-black tracking-widest text-brand-gold">{t('request.receipt.title')}</span>
                        <span className="text-[10px] md:text-[8px] uppercase tracking-widest font-black bg-brand-gold/10 text-brand-gold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1 h-1 bg-brand-gold rounded-full animate-pulse"></span>
                          {t('request.receipt.sent')}
                        </span>
                      </div>

                      <div className="space-y-3 text-[11px] leading-relaxed">
                        {[
                          [t('request.receipt.id'), submittedId, 'font-mono'],
                          [t('request.receipt.type'), t(`portfolio.category.${category}`), ''],
                          [t('request.receipt.visit'), visitLabel, ''],
                          [t('request.receipt.client'), userName, ''],
                          [t('request.receipt.phone'), userPhone, ''],
                        ].map(([label, value, extra]) => (
                          <div key={label} className="flex justify-between gap-4">
                            <span className="text-foreground/45 uppercase tracking-wider font-semibold">{label}</span>
                            <span className={cn('text-foreground font-bold text-right min-w-0 break-words', extra)}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Where the request can be followed, depending on how it was delivered */}
                    {!savedToDb && (
                      <p className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-[11px] leading-relaxed">
                        {t('request.notSaved')}
                      </p>
                    )}
                    {savedToDb && user && !isAnonymous && (
                      <p className="mt-4 text-[11px] text-foreground/60 text-center leading-relaxed">
                        {t('request.trackHint')}{' '}
                        <Link to="/profile" onClick={onClose} className="text-brand-gold font-bold underline underline-offset-4">
                          {t('request.trackLink')}
                        </Link>
                      </p>
                    )}
                    {savedToDb && (!user || isAnonymous) && (
                      <p className="mt-4 text-[11px] text-foreground/60 text-center leading-relaxed">
                        {t('request.signInHint')}{' '}
                        <Link to="/auth" onClick={onClose} className="text-brand-gold font-bold underline underline-offset-4">
                          {t('request.signInLink')}
                        </Link>
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-4 bg-brand-gold text-black rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted active:bg-brand-gold-muted mt-6 shadow-xl shadow-brand-gold/15"
                    >
                      {t('request.close')}
                    </button>
                  </div>
                )}

                {/* Steps */}
                {!submitted && !isSubmitting && (
                  <div ref={stepTopRef} className="flex-1 flex flex-col justify-between">

                    {step === 1 && (
                      <div className="space-y-6 py-4">
                        <div>
                          <h4 className="text-lg font-bold flex items-start md:items-center gap-2">
                            <Ruler className="w-5 h-5 shrink-0 mt-0.5 md:mt-0 text-brand-gold" />
                            {t('request.step1.title')}
                          </h4>
                          <p className="text-xs md:text-[10px] text-foreground/50 mt-1.5 font-normal md:font-light">{t('request.step1.desc')}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={t('request.summary.type')}>
                          {PORTFOLIO_CATEGORY_IDS.map((id) => {
                            const Icon = CATEGORY_ICONS[id];
                            const active = category === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => setCategory(id)}
                                className={cn(
                                  'p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 min-h-[90px]',
                                  active
                                    ? 'border-brand-gold bg-brand-gold/5 shadow-md'
                                    : 'border-foreground/10 hover:border-foreground/20 active:border-brand-gold/50 bg-foreground/5',
                                )}
                              >
                                <Icon className={cn('w-5 h-5', active ? 'text-brand-gold' : 'text-foreground/40')} aria-hidden="true" />
                                <span className="text-[12px] md:text-[11px] font-bold text-foreground leading-tight">{t(`portfolio.category.${id}`)}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="request-area" className={labelClass}>{t('request.field.area')}</label>
                          <input
                            id="request-area"
                            type="text"
                            autoComplete="address-level2"
                            maxLength={300}
                            placeholder={t('request.field.areaPlaceholder')}
                            className={inputClass}
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6 py-4">
                        <div>
                          <h4 className="text-lg font-bold flex items-start md:items-center gap-2">
                            <CalendarDays className="w-5 h-5 shrink-0 mt-0.5 md:mt-0 text-brand-gold" />
                            {t('request.step2.title')}
                          </h4>
                          <p className="text-xs md:text-[10px] text-foreground/50 mt-1.5 font-normal md:font-light">{t('request.step2.desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="request-date" className={labelClass}>{t('request.field.date')}</label>
                            <input
                              id="request-date"
                              type="date"
                              min={todayLocalISO()}
                              className={cn(inputClass, 'font-bold')}
                              value={preferredDate}
                              onChange={(e) => setPreferredDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className={labelClass}>{t('request.field.time')}</label>
                            <CustomSelect
                              value={preferredTime}
                              onChange={(v) => setPreferredTime(v as RequestTimeWindow)}
                              options={timeOptions}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="request-note" className={labelClass}>{t('request.field.note')}</label>
                          <textarea
                            id="request-note"
                            rows={3}
                            maxLength={1000}
                            placeholder={t('request.field.notePlaceholder')}
                            className={cn(inputClass, 'resize-none')}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <form id={REQUEST_FORM_ID} onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div>
                          <h4 className="text-lg font-bold flex items-start md:items-center gap-2">
                            <UserRound className="w-5 h-5 shrink-0 mt-0.5 md:mt-0 text-brand-gold" />
                            {t('request.step3.title')}
                          </h4>
                          <p className="text-xs md:text-[10px] text-foreground/50 mt-1.5 font-normal md:font-light">{t('request.step3.desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="request-name" className={labelClass}>{t('contact.form.label.name')}</label>
                            <input
                              id="request-name"
                              type="text"
                              autoComplete="name"
                              required
                              maxLength={100}
                              placeholder={t('contact.form.placeholder.name')}
                              className={inputClass}
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="request-phone" className={labelClass}>{t('contact.form.label.phone')}</label>
                            <input
                              id="request-phone"
                              type="tel"
                              autoComplete="tel"
                              inputMode="tel"
                              enterKeyHint="send"
                              required
                              maxLength={30}
                              placeholder={t('contact.form.placeholder.phone')}
                              aria-invalid={formError ? true : undefined}
                              className={inputClass}
                              value={userPhone}
                              onChange={(e) => { setUserPhone(e.target.value); setFormError(null); }}
                            />
                          </div>
                        </div>

                        {formError && (
                          <div role="alert" className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[11px] font-bold space-y-2">
                            <p>{formError}</p>
                            {formError === t('request.error') && (
                              <a href={site.phone.href} className="inline-flex items-center gap-2 py-2 -my-1 text-foreground">
                                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                                {site.phone.display}
                              </a>
                            )}
                          </div>
                        )}
                      </form>
                    )}

                    {/* Navigation */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 border-t border-foreground/10 pt-6 mt-6">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-6 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 active:bg-foreground/10 flex items-center justify-center sm:justify-start gap-2 text-foreground"
                        >
                          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                          {t('request.back')}
                        </button>
                      )}

                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex-1 py-4 bg-brand-gold text-black rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted active:bg-brand-gold-muted flex items-center justify-center gap-2 shadow-xl shadow-brand-gold/15"
                        >
                          {t('request.next')}
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      ) : (
                        /* Submits the step-3 form (lives outside it), so `required` validation actually runs. */
                        <button
                          type="submit"
                          form={REQUEST_FORM_ID}
                          disabled={!userName.trim() || !userPhone.trim()}
                          className="flex-1 py-4 bg-brand-gold text-black rounded-2xl text-[11px] md:text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted active:bg-brand-gold-muted flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-gold/15"
                        >
                          {t('request.submit')}
                          <Send className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
