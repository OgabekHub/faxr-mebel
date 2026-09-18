import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ClipboardList, Inbox, Hammer, CheckCircle, Phone, MapPin, CalendarDays, Trash2 } from 'lucide-react';
import { cn, getErrorMessage, formatDayLabel, formatDateTimeLabel } from '../lib/utils';
import { db } from '../lib/firebaseDb';
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { findPortfolioItem, portfolioTitle } from '../hooks/usePortfolio';
import { REQUEST_STATUS_FLOW, PORTFOLIO_CATEGORY_IDS, type FurnitureRequest, type RequestStatus } from '../types/domain';

/** Requests as stored in Firestore; older documents may lack optional fields. */
type AdminRequest = Partial<FurnitureRequest> & {
  id: string;
  client: string;
  status: RequestStatus;
  date: string;
  category: FurnitureRequest['category'];
};

// Staff-facing and Uzbek-only by design (one operator); the customer-facing labels live in the locale files.
const STATUS_LABELS: Record<RequestStatus, string> = {
  new: '🆕 Yangi',
  measured: "📐 O'lchov olindi",
  production: '🪚 Ustaxonada',
  quality: '🔬 Sifat nazorati',
  installed: "✅ O'rnatildi",
};

const SLOT_LABELS: Record<string, string> = {
  morning: 'ertalab',
  afternoon: 'kunduzi',
  evening: 'kechqurun',
};

/** Next build stage, or null once installed (no wrap-around back to new). */
function nextRequestStatus(status: RequestStatus): RequestStatus | null {
  const index = REQUEST_STATUS_FLOW.indexOf(status);
  if (index === -1) return REQUEST_STATUS_FLOW[0];
  return REQUEST_STATUS_FLOW[index + 1] ?? null;
}

const IN_PROGRESS: RequestStatus[] = ['measured', 'production', 'quality'];

export const Admin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'requests' | 'overview'>('requests');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    // Real-time Firestore sync. A permission error is shown as an error, not hidden behind an empty list.
    const unsubscribe = onSnapshot(
      collection(db, 'requests'),
      (snapshot) => {
        const fetched: AdminRequest[] = snapshot.docs.map(docSnap => ({
          ...(docSnap.data() as Omit<AdminRequest, 'id'>),
          id: docSnap.id,
        }));
        fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRequests(fetched);
        setLoadError(null);
      },
      (error) => {
        console.error("Firestore 'requests' subscription failed:", error);
        setLoadError(error.code === 'permission-denied'
          ? "Arizalarni o'qishga ruxsat yo'q. Hisobingiz admin sifatida ro'yxatdan o'tmagan (OPERATIONS.md §4)."
          : `Arizalarni yuklab bo'lmadi: ${error.message}`);
      }
    );

    return () => unsubscribe();
  }, []);

  // Move a request to the next stage in Firestore; the snapshot listener updates the list.
  const advanceStatus = async (request: AdminRequest) => {
    const next = nextRequestStatus(request.status);
    if (!next || busyId) return;

    setBusyId(request.id);
    setActionError(null);
    try {
      await updateDoc(doc(db, 'requests', request.id), { status: next });
    } catch (error) {
      console.error('Firestore status update failed:', error);
      setActionError(`Bosqichni o'zgartirib bo'lmadi (${request.id}): ${getErrorMessage(error) || "ruxsat yo'q"}`);
    } finally {
      setBusyId(null);
    }
  };

  // Open create means junk is possible; this is how the owner clears it without the Console.
  const removeRequest = async (request: AdminRequest) => {
    if (busyId) return;
    if (!confirm(`${request.id} arizasini butunlay o'chirmoqchimisiz?`)) return;

    setBusyId(request.id);
    setActionError(null);
    try {
      await deleteDoc(doc(db, 'requests', request.id));
    } catch (error) {
      console.error('Firestore delete failed:', error);
      setActionError(`Arizani o'chirib bo'lmadi (${request.id}): ${getErrorMessage(error) || "ruxsat yo'q"}`);
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => ({
    total: requests.length,
    fresh: requests.filter(r => r.status === 'new').length,
    inProgress: requests.filter(r => IN_PROGRESS.includes(r.status)).length,
    installed: requests.filter(r => r.status === 'installed').length,
  }), [requests]);

  const byCategory = useMemo(() => PORTFOLIO_CATEGORY_IDS.map(id => {
    const n = requests.filter(r => r.category === id).length;
    return { id, n, share: requests.length ? Math.round((n / requests.length) * 100) : 0 };
  }), [requests]);

  const visible = useMemo(
    () => (statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter)),
    [requests, statusFilter],
  );

  const visitLabel = (request: AdminRequest) => {
    const slot = SLOT_LABELS[request.preferredTime ?? ''] ?? '';
    if (!request.preferredDate) return slot ? `kelishiladi (${slot} qulay)` : 'kelishiladi';
    return `${formatDayLabel(request.preferredDate, 'uz')}${slot ? `, ${slot}` : ''}`;
  };

  const tabClass = (active: boolean) =>
    `shrink-0 whitespace-nowrap px-4 md:px-5 py-3 min-h-11 md:min-h-0 rounded-xl text-[10px] md:text-[9px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-brand-gold text-black font-bold shadow-md' : 'text-foreground/45 hover:text-foreground'
    }`;

  return (
    <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-dvh">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-foreground/5">
        <div>
          <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Prestige Console</span>
          <h1 className="text-4xl md:text-5xl font-editorial-title mt-2">Boshqaruv <span className="font-bold italic gold-foil-text">Paneli.</span></h1>
        </div>

        <div className="flex w-full md:w-auto overflow-x-auto scrollbar-hide bg-foreground/5 p-1 rounded-2xl border border-foreground/5">
          <button type="button" onClick={() => setActiveTab('requests')} className={tabClass(activeTab === 'requests')}>
            Arizalar ({counts.total})
          </button>
          <button type="button" onClick={() => setActiveTab('overview')} className={tabClass(activeTab === 'overview')}>
            Umumiy ko'rinish
          </button>
        </div>
      </header>

      {(loadError || actionError) && (
        <div role="alert" className="mb-8 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-start gap-3 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-left">
            <span className="text-xs font-bold text-foreground block">Firestore xatosi</span>
            <p className="text-xs md:text-[10px] text-foreground/60 leading-relaxed">{loadError ?? actionError}</p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Every number here comes from the live snapshot; nothing is invented. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Jami arizalar', value: counts.total, hint: 'Barcha vaqt', Icon: ClipboardList },
                { label: 'Yangi', value: counts.fresh, hint: "Qo'ng'iroq kutmoqda", Icon: Inbox },
                { label: 'Jarayonda', value: counts.inProgress, hint: "O'lchovdan sifat nazoratigacha", Icon: Hammer },
                { label: "O'rnatilgan", value: counts.installed, hint: 'Yakunlangan ishlar', Icon: CheckCircle },
              ].map(({ label, value, hint, Icon }) => (
                <div key={label} className="bento-card glow-tracer p-6 sm:p-8 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] md:text-[9px] font-black uppercase tracking-widest text-foreground/45">{label}</span>
                    <div className="text-xl sm:text-2xl font-editorial-title font-bold mt-2 text-foreground">{value} ta</div>
                    <span className="text-[10px] md:text-[9px] text-brand-gold font-extrabold flex items-center mt-1">{hint}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/15">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bento-card p-6 sm:p-8">
              <h3 className="text-base font-bold text-foreground mb-1">Yo'nalishlar ulushi</h3>
              <p className="text-[10px] text-foreground/45 italic mb-6">Mijozlar qaysi mebel turini ko'proq so'rayapti</p>
              <div className="space-y-4">
                {byCategory.map(({ id, n, share }) => (
                  <div key={id}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span>{t(`portfolio.category.${id}`)}</span>
                      <span className="text-brand-gold tabular-nums">{n} ta · {share}%</span>
                    </div>
                    <div className="w-full bg-foreground/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-gold h-full rounded-full transition-[width] duration-500" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-foreground/5">
              <h2 className="text-xl font-editorial-title font-bold text-foreground">O'lchov arizalari</h2>
              <div className="flex flex-wrap gap-1 bg-foreground/5 p-1 rounded-2xl border border-foreground/5 w-full md:w-auto" role="group" aria-label="Bosqich bo'yicha filtr">
                {(['all', ...REQUEST_STATUS_FLOW] as const).map(stage => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setStatusFilter(stage)}
                    aria-pressed={statusFilter === stage}
                    className={cn(
                      'px-3 py-2.5 min-h-11 md:min-h-0 rounded-xl text-[10px] md:text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all',
                      statusFilter === stage ? 'bg-brand-gold text-black shadow-md' : 'text-foreground/50 hover:text-foreground',
                    )}
                  >
                    {stage === 'all' ? `Barchasi (${requests.length})` : `${STATUS_LABELS[stage]} (${requests.filter(r => r.status === stage).length})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {visible.length === 0 && !loadError && (
                <p className="text-xs text-foreground/45 italic py-10 text-center">
                  {statusFilter === 'all' ? "Hozircha arizalar yo'q." : "Bu bosqichda ariza yo'q."}
                </p>
              )}
              {visible.map(r => {
                const source = r.sourceItemId ? findPortfolioItem(r.sourceItemId) : undefined;
                const title = `${t(`portfolio.category.${r.category}`)}${source ? ` · ${portfolioTitle(source.id, t)}` : ''}`;
                const isDone = r.status === 'installed';
                const busy = busyId === r.id;

                return (
                  <div key={r.id} className={cn('bento-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4', r.status === 'new' ? 'border-l-brand-gold' : 'border-l-foreground/15')}>
                    <div className="space-y-2.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] md:text-[9px] font-black uppercase tracking-widest text-brand-gold select-all">{r.id}</span>
                        <span className="px-3 py-1 bg-brand-gold/10 border border-brand-gold/25 rounded-full text-[11px] md:text-[9px] font-bold text-brand-gold uppercase tracking-wider">
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                        {r.lang && r.lang !== 'uz' && (
                          <span className="px-2.5 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-[10px] md:text-[8px] font-black uppercase tracking-widest text-foreground/60" title="Mijoz saytni shu tilda ko'rgan">
                            {r.lang}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{title}</h3>
                      <p className="text-xs md:text-[10px] text-foreground/60 md:text-foreground/45 font-normal md:font-light">
                        Mijoz: <strong className="text-foreground">{r.client}</strong>
                        {' | '}
                        <Phone className="w-3 h-3 inline -mt-0.5" aria-hidden="true" />{' '}
                        {r.phone ? <a href={`tel:${r.phone}`} className="text-foreground underline underline-offset-2 py-2 -my-2 inline-block">{r.phone}</a> : 'N/A'}
                      </p>
                      <p className="text-xs md:text-[10px] text-foreground/60 md:text-foreground/45 font-normal md:font-light flex flex-wrap gap-x-4 gap-y-1">
                        <span><CalendarDays className="w-3 h-3 inline -mt-0.5" aria-hidden="true" /> Tashrif: <strong className="text-foreground">{visitLabel(r)}</strong></span>
                        <span><MapPin className="w-3 h-3 inline -mt-0.5" aria-hidden="true" /> Hudud: <span className="italic text-foreground/70">{r.area || "ko'rsatilmagan"}</span></span>
                      </p>
                      {r.note && (
                        <p className="text-xs md:text-[10px] text-foreground/60 italic leading-relaxed break-words">✍️ {r.note}</p>
                      )}
                      <p className="text-[10px] md:text-[9px] text-foreground/40 uppercase tracking-wider">
                        Qabul qilindi: {formatDateTimeLabel(r.date, 'uz')}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => advanceStatus(r)}
                        disabled={isDone || busy}
                        className="px-5 py-4 md:py-3.5 bg-foreground/5 hover:bg-brand-gold hover:text-black active:bg-brand-gold active:text-black rounded-xl text-[11px] md:text-[9px] font-black uppercase tracking-widest md:tracking-[0.3em] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-foreground/5 disabled:hover:text-foreground"
                      >
                        {isDone ? '✅ Yakunlangan' : busy ? 'Saqlanmoqda...' : `➡️ ${STATUS_LABELS[nextRequestStatus(r.status) ?? 'installed']}`}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRequest(r)}
                        disabled={busy}
                        aria-label={`${r.id} arizasini o'chirish`}
                        className="p-4 md:p-3.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white rounded-xl transition-colors flex items-center justify-center disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
