import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Heart, ClipboardList, Send, Award, Clock, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDayLabel } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { CustomSelect } from '../components/CustomSelect';
import { useWishlist } from '../context/WishlistContext';
import { findPortfolioItem, portfolioTitle } from '../hooks/usePortfolio';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { REQUEST_STATUS_FLOW, type FurnitureRequest } from '../types/domain';

type StepState = 'completed' | 'active' | 'pending';

export const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  // Favourites are references; pieces that have since left the portfolio are skipped.
  const savedItems = wishlist.flatMap(({ id }) => {
    const item = findPortfolioItem(id);
    return item ? [item] : [];
  });
  // ProtectedRoute only renders this page once auth has resolved with a signed-in user
  // (an anonymous account counts: it is how a request sent without signing up is tracked).
  const { user, isAnonymous } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'wishlist'>('requests');

  const [requests, setRequests] = useState<FurnitureRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsFailed, setRequestsFailed] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const uid = user?.uid ?? null;

  // One listener per signed-in user; the cleanup runs on uid change and unmount (no leak).
  useEffect(() => {
    if (!uid) {
      // Defensive only: ProtectedRoute never renders this page without a user.
      setRequests([]);
      setSelectedRequestId(null);
      setRequestsLoading(false);
      return;
    }

    setRequestsLoading(true);
    setRequestsFailed(false);
    // Single `where`, sorted client-side: an `orderBy` would need a composite index.
    const q = query(collection(db, 'requests'), where('userId', '==', uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: FurnitureRequest[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Omit<FurnitureRequest, 'id'>),
        id: docSnap.id,
      }));
      fetched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setRequests(fetched);
      if (fetched.length > 0) {
        setSelectedRequestId(prev => prev || fetched[0].id);
      }
      setRequestsLoading(false);
    }, (error) => {
      // Shown, not swallowed: an unpublished rule would otherwise look like "no requests yet".
      console.error('Firestore requests query failed:', error);
      setRequestsFailed(true);
      setRequestsLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const currentRequest = useMemo(() => {
    const request = requests.find(r => r.id === selectedRequestId);
    if (!request) return null;

    const stageIndex = REQUEST_STATUS_FLOW.indexOf(request.status);
    const done = request.status === 'installed';
    const steps = REQUEST_STATUS_FLOW.map((stage, index) => ({
      label: t(`profile.stage.${stage}`),
      desc: t(`profile.stage.${stage}Desc`),
      status: (done || index < stageIndex ? 'completed' : index === stageIndex ? 'active' : 'pending') as StepState,
    }));

    const source = request.sourceItemId ? findPortfolioItem(request.sourceItemId) : undefined;
    const title = source ? portfolioTitle(source.id, t) : t(`portfolio.category.${request.category}`);
    const visit = request.preferredDate
      ? `${formatDayLabel(request.preferredDate, i18n.language)} · ${t(`request.time.${request.preferredTime}`)}`
      : t('request.summary.notSet');

    return { ...request, steps, title, visit };
  }, [requests, selectedRequestId, t, i18n.language]);

  const paramRow = (label: string, value: string) => (
    <div className="flex flex-wrap sm:flex-nowrap justify-between gap-x-2">
      <span className="text-foreground/45">{label}:</span>
      <span className="font-bold text-right pl-2 ml-auto break-words min-w-0">{value}</span>
    </div>
  );

  return (
    <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-dvh">

      {/* Upper User Profile Bar */}
      <div className="bento-card p-6 sm:p-8 md:p-10 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border border-foreground/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-brand-gold/5 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold bg-foreground/5 shadow-lg">
            <img src={user?.photoURL || 'https://i.pravatar.cc/150?u=9'} alt="User Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-editorial-title font-bold text-foreground">{user?.displayName || t('profile.guestName')}</h1>
            {user?.email && <p className="text-xs text-foreground/50 leading-relaxed font-light italic break-words">{user.email}</p>}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
              <span className="px-3.5 py-1 bg-brand-gold/10 border border-brand-gold/10 rounded-full text-[10px] sm:text-[9px] font-black uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                <Award className="w-3 h-3" /> {t('profile.goldMember')}
              </span>
            </div>
          </div>
        </div>

        {/* Signing out an anonymous account would orphan its requests; the upgrade card below is the way forward instead. */}
        {!isAnonymous && (
          <button
            onClick={handleLogout}
            className="px-6 py-3.5 bg-foreground/5 hover:bg-red-500 hover:text-white rounded-xl text-[11px] md:text-[9px] font-black uppercase tracking-widest md:tracking-[0.3em] transition-all flex items-center gap-2 border border-foreground/5 hover:border-red-500 relative z-10"
          >
            <LogOut className="w-4 h-4" /> {t('profile.logout')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

        {/* Navigation Sidebar Panel */}
        <aside className="contents lg:block lg:col-span-3 lg:space-y-6">
          <div className="bento-card p-6 border border-foreground/5">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  activeTab === 'requests'
                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/15'
                    : 'hover:bg-foreground/5 text-foreground/60'
                }`}
              >
                <ClipboardList className="w-4 h-4" /> {t('profile.requests')}
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  activeTab === 'wishlist'
                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/15'
                    : 'hover:bg-foreground/5 text-foreground/60'
                }`}
              >
                <Heart className="w-4 h-4" /> {t('profile.wishlist')}
              </button>
            </nav>
          </div>

          <div className="bento-card p-6 bg-brand-gold text-black order-last lg:order-none">
            <h3 className="text-xs font-black uppercase tracking-wider mb-2">{t('profile.prestigeService')}</h3>
            <p className="text-xs sm:text-[10px] leading-relaxed mb-4 font-semibold opacity-75">
              {t('profile.prestigeDesc')}
            </p>
            <a
              href="https://t.me/faxrmebel"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 sm:py-3 bg-black text-white text-center rounded-xl text-[11px] sm:text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> {t('profile.telegramSupport')}
            </a>
          </div>
        </aside>

        {/* Content Viewer Grid */}
        <main className="lg:col-span-9 space-y-6">
          {isAnonymous && (
            <div className="bento-card p-5 sm:p-6 border border-brand-gold/30 bg-brand-gold/5 flex flex-col sm:flex-row sm:items-center gap-4">
              <UserPlus className="w-6 h-6 text-brand-gold shrink-0" aria-hidden="true" />
              <div className="flex-grow">
                <h3 className="text-sm font-bold text-foreground">{t('profile.guestUpgrade.title')}</h3>
                <p className="text-xs text-foreground/55 leading-relaxed mt-1">{t('profile.guestUpgrade.desc')}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="shrink-0 bg-brand-gold text-black px-5 py-3.5 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-[10px] uppercase tracking-widest active:scale-[0.98]"
              >
                {t('profile.guestUpgrade.cta')}
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'requests' ? (
              <motion.div
                key="requests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {requestsLoading ? (
                  <div className="bento-card p-8 sm:p-12 text-center border border-foreground/5">
                    <Clock className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-4" />
                    <span className="text-xs uppercase tracking-hero text-foreground/40 font-bold">{t('profile.requestsLoading')}</span>
                  </div>
                ) : requestsFailed ? (
                  <div role="alert" className="bento-card p-6 border border-red-500/25 bg-red-500/5 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-foreground/70 leading-relaxed">{t('profile.requestsError')}</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="bento-card p-8 sm:p-12 text-center border border-foreground/5 flex flex-col items-center justify-center space-y-4">
                    <ClipboardList className="w-12 h-12 text-foreground/20" />
                    <h3 className="text-lg font-bold text-foreground">{t('profile.noRequests')}</h3>
                    <p className="text-xs text-foreground/45 italic max-w-sm">{t('profile.noRequestsDesc')}</p>
                    <button
                      onClick={() => navigate('/portfolio')}
                      className="bg-brand-gold text-black px-6 py-4 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-[10px] uppercase tracking-widest hover:scale-102 active:scale-[0.98]"
                    >
                      {t('cta.portfolio')}
                    </button>
                  </div>
                ) : (
                  <>
                    {requests.length > 1 && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-foreground/5 p-3 rounded-2xl border border-foreground/5 w-full sm:w-fit">
                        <span className="text-[10px] sm:text-[9px] uppercase font-black tracking-widest text-foreground/45 ml-1 sm:ml-2">{t('profile.selectRequest')}:</span>
                        <CustomSelect
                          value={selectedRequestId || ''}
                          onChange={setSelectedRequestId}
                          options={requests.map(r => ({
                            value: r.id,
                            label: `${r.id} (${new Date(r.date).toLocaleDateString()})`
                          }))}
                          className="w-full sm:w-56"
                        />
                      </div>
                    )}

                    {currentRequest && (
                      <div className="bento-card p-5 sm:p-8 border border-foreground/5 relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-foreground/5 mb-8 gap-4">
                          <div>
                            <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-brand-gold">{t('profile.activeRequest')}</span>
                            <h3 className="text-lg font-bold text-foreground mt-1">{currentRequest.title}</h3>
                            <p className="text-xs sm:text-[10px] text-foreground/45 mt-1 font-bold">
                              {t('profile.code')}: <span className="select-all">{currentRequest.id}</span> | {t('profile.date')}: {new Date(currentRequest.date).toLocaleDateString()}
                            </p>
                          </div>

                          <span className="shrink-0 self-start sm:self-center px-3.5 py-1.5 bg-brand-gold/10 border border-brand-gold/25 rounded-full text-[11px] sm:text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                            {t(`profile.stage.${currentRequest.status}`)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                          {/* Request details */}
                          <div className="md:col-span-4 bg-foreground/5 p-4 sm:p-6 rounded-2xl border border-foreground/5 space-y-3.5 h-fit">
                            <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-brand-gold block">{t('profile.selectedParams')}</span>
                            <div className="space-y-2.5 text-xs">
                              {paramRow(t('profile.requestType'), t(`portfolio.category.${currentRequest.category}`))}
                              {paramRow(t('profile.visitDate'), currentRequest.visit)}
                              {currentRequest.area && paramRow(t('profile.area'), currentRequest.area)}
                              {paramRow(t('profile.phone'), currentRequest.phone)}
                              {currentRequest.note && (
                                <div className="border-t border-foreground/5 pt-2">
                                  <span className="text-foreground/45 block mb-1">{t('profile.note')}:</span>
                                  <p className="italic text-foreground/70 leading-relaxed break-words">{currentRequest.note}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="md:col-span-8 space-y-6">
                            <span className="text-[10px] sm:text-[9px] font-black uppercase tracking-widest text-brand-gold block mb-2">{t('profile.timeline')}</span>

                            <div className="relative pl-6 border-l border-foreground/10 space-y-8">
                              {currentRequest.steps.map((step, idx) => (
                                <div key={idx} className="relative">
                                  <span className={`absolute -left-9.5 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-extrabold ${
                                    step.status === 'completed'
                                      ? 'bg-green-500 text-white border-green-500'
                                      : step.status === 'active'
                                      ? 'bg-brand-gold text-black border-brand-gold animate-pulse'
                                      : 'bg-background text-foreground/30 border-foreground/10'
                                  }`}>
                                    {step.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                                  </span>

                                  <div className="space-y-1">
                                    <h4 className={`text-xs font-bold uppercase tracking-wider ${
                                      step.status === 'completed' ? 'text-green-500' : step.status === 'active' ? 'text-brand-gold' : 'text-foreground/40'
                                    }`}>{step.label}</h4>
                                    <p className="text-xs sm:text-[10px] text-foreground/50 leading-relaxed font-normal sm:font-light italic">{step.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              /* Wishlist panel content */
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {savedItems.length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center py-20 opacity-50">
                    <Heart className="w-12 h-12 mb-4 text-foreground/20" />
                    <p className="text-xs uppercase tracking-widest font-bold">{t('profile.emptyWishlist')}</p>
                  </div>
                ) : (
                  savedItems.map((item) => (
                    <div key={item.id} className="bento-card glow-tracer p-5 group flex flex-col justify-between">
                      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-5">
                        <img src={item.images[0].src} alt={portfolioTitle(item.id, t)} width={item.images[0].width} height={item.images[0].height} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 glass px-3.5 py-1 rounded-full text-[10px] sm:text-[8px] font-black uppercase tracking-widest">
                          {t(`portfolio.category.${item.category}`)}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-foreground mb-4">{portfolioTitle(item.id, t)}</h3>

                      <button
                        onClick={() => navigate('/portfolio')}
                        className="w-full py-4 sm:py-3 bg-foreground/5 hover:bg-brand-gold hover:text-black active:bg-brand-gold active:text-black rounded-xl text-[11px] sm:text-[9px] font-black uppercase tracking-widest border border-foreground/5"
                      >
                        {t('cta.portfolio')}
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};
