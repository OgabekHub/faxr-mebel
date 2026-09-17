import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Search, Heart, Eye, Check, Sparkles, X, ChevronLeft, ChevronRight, Images, Ruler, QrCode } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWishlist } from '../context/WishlistContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { usePortfolio, portfolioTitle } from '../hooks/usePortfolio';
import { BentoSpotlight } from '../components/BentoSpotlight';
import { RequestModal } from '../components/RequestModal';
import { ARModal } from '../components/ARModal';
import { SEO } from '../components/SEO';
import { PORTFOLIO_CATEGORY_IDS, type PortfolioItem, type PortfolioCategoryId } from '../types/domain';

type CategoryFilter = 'all' | PortfolioCategoryId;
const FILTERS: CategoryFilter[] = ['all', ...PORTFOLIO_CATEGORY_IDS];

/**
 * Completed work, split by furniture type. Every card opens a photo gallery; the
 * gallery and the sidebar both lead to the measurement request. Nothing here has
 * a price — the crew measures on site and quotes after.
 */
export const Portfolio = () => {
  const { t } = useTranslation();
  const { items } = usePortfolio();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [galleryItem, setGalleryItem] = useState<PortfolioItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [requestItem, setRequestItem] = useState<PortfolioItem | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [arItem, setArItem] = useState<PortfolioItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useBodyScrollLock(galleryItem !== null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = (item: PortfolioItem) => {
    const wasSaved = isInWishlist(item.id);
    toggleWishlist({ id: item.id });
    triggerToast(t(wasSaved ? 'portfolio.toast.wishlistRemoved' : 'portfolio.toast.wishlistAdded'));
  };

  const filtered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return items
      .filter(
        (item) =>
          (selectedCategory === 'all' || item.category === selectedCategory) &&
          (needle === '' || portfolioTitle(item.id, t).toLowerCase().includes(needle)) &&
          (!showOnlyFavorites || isInWishlist(item.id)),
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items, selectedCategory, searchQuery, showOnlyFavorites, isInWishlist, t]);

  /* ---------------- Gallery ---------------- */

  const openGallery = (item: PortfolioItem) => {
    setPhotoIndex(0);
    setGalleryItem(item);
  };

  // Closing goes through history when the open pushed an entry, so Android Back and
  // the X button leave the history in the same state. Handing off to another modal
  // (request / AR) closes directly and leaves that one entry behind — one extra Back
  // press later is cheaper than the race of popping while the next modal pushes.
  const closeGallery = useCallback(() => {
    if (window.history.state?.modal === 'gallery') window.history.back();
    else setGalleryItem(null);
  }, []);

  useEffect(() => {
    if (!galleryItem) return;
    const photos = galleryItem.images.length;
    window.history.pushState({ modal: 'gallery' }, '');
    const onPop = () => setGalleryItem(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeGallery();
      else if (e.key === 'ArrowRight' && photos > 1) setPhotoIndex((i) => (i + 1) % photos);
      else if (e.key === 'ArrowLeft' && photos > 1) setPhotoIndex((i) => (i - 1 + photos) % photos);
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
    };
  }, [galleryItem, closeGallery]);

  // Warm the next photo so a swipe never lands on a blank frame.
  useEffect(() => {
    if (!galleryItem || galleryItem.images.length < 2) return;
    const next = galleryItem.images[(photoIndex + 1) % galleryItem.images.length];
    const img = new Image();
    img.decoding = 'async';
    img.src = next.src;
  }, [galleryItem, photoIndex]);

  const galleryPhotos = galleryItem?.images.length ?? 0;
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % galleryPhotos);
  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + galleryPhotos) % galleryPhotos);

  const openRequest = (item: PortfolioItem | null) => {
    setGalleryItem(null);
    setRequestItem(item);
    setIsRequestOpen(true);
  };

  const requestSource = requestItem
    ? { itemId: requestItem.id, category: requestItem.category, image: requestItem.images[0].src, title: portfolioTitle(requestItem.id, t) }
    : undefined;

  const chipClass = 'glass px-3 py-1.5 rounded-full text-[10px] lg:text-[8px] font-black uppercase tracking-widest text-foreground';

  return (
    <div className="pt-32 md:pt-36 pb-20 px-4 sm:px-6 max-w-7xl mx-auto min-h-[100dvh]">
      <SEO title={t('nav.portfolio')} />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 w-max max-w-[calc(100vw-2rem)] glass px-6 py-3.5 rounded-full border border-brand-gold/30 shadow-2xl flex items-center gap-3"
          >
            <div className="w-5 h-5 shrink-0 bg-brand-gold text-black rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground text-center">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-10 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 pb-6 md:pb-8 border-b border-foreground/5">
        <div>
          <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">{t('portfolio.hero.teaser')}</span>
          <h1 className="text-4xl md:text-6xl font-editorial-title mt-2 mb-3">
            {t('portfolio.hero.title')} <span className="font-bold italic gold-foil-text">{t('portfolio.hero.titleGold')}</span>
          </h1>
          <p className="text-foreground/45 text-[11px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.3em] font-extrabold">{t('portfolio.hero.desc')}</p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-0 bg-foreground/5 border border-foreground/5 p-1 rounded-2xl md:overflow-x-auto w-full md:w-auto" role="group" aria-label={t('request.summary.type')}>
          {FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={cn(
                'px-4 md:px-5 py-3.5 md:py-3 rounded-xl text-[11px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap',
                selectedCategory === cat ? 'bg-brand-gold text-black shadow-md font-bold' : 'text-foreground/60 md:text-foreground/45 hover:text-foreground',
              )}
            >
              {t(`portfolio.category.${cat}`)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10">
        {/* Sidebar: search + favourites, and the request card (last on phones) */}
        <aside className="contents lg:block lg:space-y-8 lg:col-span-1">
          <div className="bento-card glow-tracer p-6 lg:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-hero mb-5 text-brand-gold">{t('portfolio.filter.search')}</h3>
            <div className="relative group mb-4">
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                placeholder={t('portfolio.filter.searchPlaceholder')}
                className="w-full bg-foreground/5 border border-foreground/10 focus:border-brand-gold rounded-xl px-4 pr-11 lg:pr-4 py-3 text-base lg:text-xs focus:outline-none transition-colors placeholder:text-foreground/35 lg:placeholder:text-foreground/20 italic text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-[17px] lg:top-3.5 w-4 h-4 text-foreground/20 group-hover:text-brand-gold transition-colors pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setShowOnlyFavorites((prev) => !prev)}
              aria-pressed={showOnlyFavorites}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3.5 lg:py-3 rounded-xl border',
                showOnlyFavorites
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 font-bold'
                  : 'bg-foreground/5 border-foreground/10 text-foreground/50 hover:border-brand-gold hover:text-brand-gold',
              )}
            >
              <span className="text-[11px] lg:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Heart className={cn('w-3.5 h-3.5', showOnlyFavorites && 'fill-current')} />
                {t('portfolio.filter.favorites')} ({wishlist.length})
              </span>
              <span className="text-[10px] lg:text-[8px] uppercase tracking-widest bg-foreground/10 px-2 py-0.5 rounded font-black">
                {showOnlyFavorites ? t('common.on') : t('common.off')}
              </span>
            </button>
          </div>

          <div className="bento-card p-6 lg:p-8 order-last lg:order-none bg-brand-gold text-black relative overflow-hidden group shadow-lg shadow-brand-gold/15">
            <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-black/10 rounded-full blur-2xl group-hover:scale-110" />
            <Sparkles className="w-6 h-6 mb-4 text-black animate-pulse-slow" />
            <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2">{t('portfolio.cta.title')}</h4>
            <p className="text-xs lg:text-[10px] leading-relaxed mb-6 font-semibold opacity-75">{t('portfolio.cta.desc')}</p>
            <button
              type="button"
              onClick={() => openRequest(null)}
              className="w-full py-4 lg:py-3.5 bg-black text-white rounded-xl text-[10px] lg:text-[9px] font-black uppercase tracking-hero text-center block hover:scale-[1.02] active:scale-95"
            >
              {t('portfolio.cta.button')}
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => {
              const title = portfolioTitle(item.id, t);
              const cover = item.images[0];
              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  key={item.id}
                  className="flex flex-col"
                >
                  <BentoSpotlight className="group flex-grow flex flex-col justify-between">
                    <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden rounded-t-[1.8rem]">
                      <img
                        src={cover.src}
                        alt={title}
                        width={cover.width}
                        height={cover.height}
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 pointer-events-none z-10" />

                      {/* Phone-only hit area: tapping the photo opens the gallery */}
                      <button type="button" onClick={() => openGallery(item)} aria-label={t('portfolio.open')} className="absolute inset-0 z-20 lg:hidden" />

                      <div className="absolute top-4 right-4 flex flex-col gap-3 lg:gap-2 z-30">
                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(item)}
                          aria-label={t('portfolio.filter.favorites')}
                          aria-pressed={isInWishlist(item.id)}
                          className={cn('p-3 lg:p-2.5 rounded-full shadow-lg glass', isInWishlist(item.id) ? 'bg-red-500 text-white' : 'text-foreground hover:scale-110')}
                        >
                          <Heart className="w-4 h-4 lg:w-3.5 lg:h-3.5 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openGallery(item)}
                          aria-label={t('portfolio.open')}
                          className="p-3 lg:p-2.5 glass text-foreground rounded-full shadow-lg hover:scale-110"
                        >
                          <Eye className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                        </button>
                      </div>

                      <div className={cn(chipClass, 'absolute top-4 left-4 z-30')}>{t(`portfolio.category.${item.category}`)}</div>
                      {item.images.length > 1 && (
                        <div className={cn(chipClass, 'absolute bottom-4 left-4 z-30 flex items-center gap-1.5')}>
                          <Images className="w-3 h-3" aria-hidden="true" />
                          {t('portfolio.gallery.photos', { count: item.images.length })}
                        </div>
                      )}
                    </div>

                    <button type="button" onClick={() => openGallery(item)} className="p-6 text-left flex items-center justify-between gap-3 group/title">
                      <h3 className="text-base font-bold tracking-tight text-foreground">{title}</h3>
                      <ChevronRight className="w-4 h-4 shrink-0 text-foreground/30 group-hover/title:text-brand-gold transition-colors" aria-hidden="true" />
                    </button>
                  </BentoSpotlight>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 md:px-0 py-24 md:py-40 bento-card border-dashed">
              <Search className="w-12 h-12 text-foreground/10 mb-4 animate-bounce" />
              <p className="text-foreground/45 text-xs md:text-[10px] text-center italic tracking-widest uppercase font-black">{t('portfolio.noResults')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      {createPortal(
        <AnimatePresence>
          {galleryItem && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center md:px-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeGallery} className="fixed inset-0 bg-black/60 md:backdrop-blur-md" />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={portfolioTitle(galleryItem.id, t)}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-background border-0 md:border border-foreground/5 rounded-none md:rounded-[2.5rem] w-full max-w-4xl p-5 pb-safe md:p-8 relative z-10 shadow-2xl flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 min-h-[100dvh] md:min-h-0 max-h-[100dvh] md:max-h-[90vh] overflow-y-auto overflow-x-hidden overscroll-contain md:overscroll-auto"
              >
                <button
                  type="button"
                  onClick={closeGallery}
                  aria-label={t('portfolio.modal.close')}
                  className="fixed md:absolute right-4 top-[max(1rem,env(safe-area-inset-top))] md:right-6 md:top-6 p-3 md:p-2 rounded-full bg-background/50 backdrop-blur-md md:bg-transparent hover:bg-foreground/5 transition-colors z-20 text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Photos */}
                <div className="w-full shrink-0">
                  <div className="relative h-[260px] sm:h-[320px] md:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden bg-foreground/5 select-none">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.img
                        key={galleryItem.images[photoIndex].src}
                        src={galleryItem.images[photoIndex].src}
                        alt={portfolioTitle(galleryItem.id, t)}
                        width={galleryItem.images[photoIndex].width}
                        height={galleryItem.images[photoIndex].height}
                        decoding="async"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        drag={galleryPhotos > 1 ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x < -60 || info.velocity.x < -400) nextPhoto();
                          else if (info.offset.x > 60 || info.velocity.x > 400) prevPhoto();
                        }}
                        className="absolute inset-0 w-full h-full object-cover touch-pan-y"
                        draggable={false}
                      />
                    </AnimatePresence>

                    <div className={cn(chipClass, 'absolute top-4 left-4 z-10')}>{t(`portfolio.category.${galleryItem.category}`)}</div>

                    {galleryPhotos > 1 && (
                      <>
                        <button type="button" onClick={prevPhoto} aria-label={t('portfolio.gallery.prev')} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 lg:p-2 rounded-full glass text-foreground shadow-lg active:scale-95">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button type="button" onClick={nextPhoto} aria-label={t('portfolio.gallery.next')} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 lg:p-2 rounded-full glass text-foreground shadow-lg active:scale-95">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className={cn(chipClass, 'absolute bottom-4 right-4 z-10 tabular-nums')}>
                          {photoIndex + 1} / {galleryPhotos}
                        </div>
                      </>
                    )}
                  </div>

                  {galleryPhotos > 1 && (
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-3 pb-1" role="tablist" aria-label={t('portfolio.gallery.photos', { count: galleryPhotos })}>
                      {galleryItem.images.map((image, i) => (
                        <button
                          key={image.src}
                          type="button"
                          role="tab"
                          aria-selected={i === photoIndex}
                          onClick={() => setPhotoIndex(i)}
                          className={cn('shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all', i === photoIndex ? 'border-brand-gold' : 'border-transparent opacity-60 hover:opacity-100')}
                        >
                          <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details and actions */}
                <div className="flex-grow flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block mb-1">{t('portfolio.modal.eyebrow')}</span>
                    <h3 className="text-xl md:text-2xl font-editorial-title font-bold text-foreground mb-3">{portfolioTitle(galleryItem.id, t)}</h3>
                    <p className="text-xs md:text-[11px] text-foreground/50 leading-relaxed">{t('portfolio.cta.desc')}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => openRequest(galleryItem)}
                      className="py-4 md:py-3.5 px-4 bg-brand-gold text-black rounded-xl flex items-center justify-center gap-2 text-[11px] md:text-[10px] font-black uppercase tracking-wider hover:bg-brand-gold-muted active:bg-brand-gold-muted shadow-lg shadow-brand-gold/15"
                    >
                      <Ruler className="w-4 h-4" aria-hidden="true" />
                      {t('portfolio.modal.request')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setArItem(galleryItem); setGalleryItem(null); }}
                      className="py-4 md:py-3.5 px-4 bg-foreground/5 border border-foreground/10 hover:border-brand-gold hover:text-brand-gold active:border-brand-gold rounded-xl flex items-center justify-center gap-2 text-[11px] md:text-[10px] font-black uppercase tracking-wider text-foreground"
                    >
                      <QrCode className="w-4 h-4 text-brand-gold" aria-hidden="true" />
                      {t('portfolio.modal.ar')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} source={requestSource} />

      {arItem && (
        <ARModal isOpen={!!arItem} onClose={() => setArItem(null)} productName={portfolioTitle(arItem.id, t)} productId={arItem.id} />
      )}
    </div>
  );
};
