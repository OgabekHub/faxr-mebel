import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Shield, MapPin, Clock, Phone, Send, Check, QrCode, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ARModal } from '../components/ARModal';
import { RequestModal } from '../components/RequestModal';
import { findPortfolioItem, portfolioTitle } from '../hooks/usePortfolio';
import type { PortfolioItem } from '../types/domain';
import { BentoSpotlight } from '../components/BentoSpotlight';
import { SEO } from '../components/SEO';

interface HeroSlide {
  image: string;
  collectionKey: string;
  ctaLink: string;
  /** Either translation keys... */
  titleKey?: string;
  titleGoldKey?: string;
  /** ...or inline per-language titles (moved to i18n keys in Faza 5). */
  titleUz?: string;
  titleRu?: string;
  titleEn?: string;
  titleGoldUz?: string;
  titleGoldRu?: string;
  titleGoldEn?: string;
}

// Immersive Hero slides data
const heroSlides: HeroSlide[] = [
  {
    image: '/images/sofa.webp',
    collectionKey: 'home.hero.collection',
    titleKey: 'home.hero.title',
    titleGoldKey: 'home.hero.titleGold',
    ctaLink: '/portfolio',
  },
  {
    image: '/images/bedroom_gold_black.webp',
    collectionKey: 'about.heritage.teaser',
    titleUz: 'Dabdabali Yotoqxona',
    titleRu: 'Роскошная Спальня',
    titleEn: 'Luxury Bedchamber',
    titleGoldUz: 'Mukammal Orom.',
    titleGoldRu: 'Королевский Сон.',
    titleGoldEn: 'Royal Comfort.',
    ctaLink: '/portfolio',
  },
  {
    image: '/images/kitchen_neoclassic.webp',
    collectionKey: 'materials.teaser',
    titleUz: 'Premium Oshxonalar',
    titleRu: 'Премиум Кухни',
    titleEn: 'Artisan Kitchens',
    titleGoldUz: 'Masterklass Sifat.',
    titleGoldRu: 'Идеальный Дизайн.',
    titleGoldEn: 'Exquisite Style.',
    ctaLink: '/portfolio',
  }
];

// Three portfolio pieces for the landing page: one per room, none of them a hero slide.
const FEATURED_IDS = ['sofa-chesterfield-blue', 'kitchen-white-oak', 'tv-unit-royal-classic'];
const featured: PortfolioItem[] = FEATURED_IDS.flatMap((id) => {
  const item = findPortfolioItem(id);
  return item ? [item] : [];
});

export const Home = () => {
  const { t, i18n } = useTranslation();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [isAROpen, setIsAROpen] = useState(false);
  const [requestItem, setRequestItem] = useState<PortfolioItem | null>(null);
  const [mapActive, setMapActive] = useState(false);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // `slideTick` restarts the timer whenever the visitor picks a slide themselves,
  // otherwise a slide chosen at t=6.4s is replaced 0.1s later and the dots look broken.
  const [slideTick, setSlideTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slideTick]);

  // Warm the remaining slides so the 6.5s auto-advance never lands on a blank card.
  useEffect(() => {
    heroSlides.slice(1).forEach((slide) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = slide.image;
    });
  }, []);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setSlideTick((n) => n + 1);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setSlideTick((n) => n + 1);
  };

  const getSlideTexts = (slide: HeroSlide) => {
    const lang = i18n.language || 'uz';
    let collection = '';
    let title = '';
    let titleGold = '';

    if (slide.collectionKey) {
      collection = t(slide.collectionKey);
    }
    if (slide.titleKey && slide.titleGoldKey) {
      title = t(slide.titleKey);
      titleGold = t(slide.titleGoldKey);
    } else {
      if (lang.startsWith('uz')) {
        title = slide.titleUz || '';
        titleGold = slide.titleGoldUz || '';
      } else if (lang.startsWith('ru')) {
        title = slide.titleRu || '';
        titleGold = slide.titleGoldRu || '';
      } else {
        title = slide.titleEn || '';
        titleGold = slide.titleGoldEn || '';
      }
    }
    return { collection, title, titleGold };
  };

  const currentSlideData = heroSlides[currentSlide];
  const { collection: sCollection, title: sTitle, titleGold: sTitleGold } = getSlideTexts(currentSlideData);

  const handleToggleWishlist = (item: PortfolioItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Read the membership before toggling, otherwise the message says the opposite of what happened.
    const wasInWishlist = isInWishlist(item.id);
    toggleWishlist({ id: item.id });
    setAddedToast(wasInWishlist ? t('portfolio.toast.wishlistRemoved') : t('portfolio.toast.wishlistAdded'));
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="flex flex-col pt-32 px-6 gap-10 md:gap-16 max-w-7xl mx-auto mb-20 overflow-hidden">
      <SEO title={t('nav.home')} />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 w-max max-w-[calc(100vw-2rem)] glass px-6 py-3.5 rounded-full border border-brand-gold/30 shadow-2xl flex items-center gap-3"
          >
            <div className="w-5 h-5 shrink-0 bg-brand-gold text-black rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground text-center leading-snug">
              {addedToast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento Grid Header / Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-6 gap-5 min-h-[850px] md:h-[90vh]">
        
        {/* Main Hero Card - Animated Slider */}
        {/* min-h below md: every child here is absolute, so without it the card collapses to a strip. */}
        <div className="col-span-1 md:col-span-8 row-span-4 min-h-[520px] md:min-h-0 rounded-[3rem] overflow-hidden relative group border border-foreground/5 bento-card">
          
          {/* Background Image Carousel with Ken Burns effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 0.65, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 bg-cover bg-center animate-ken-burns"
              style={{ backgroundImage: `url(${currentSlideData.image})` }}
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent"></div>
          
          {/* Slide Content */}
          <div className="absolute bottom-16 left-6 right-6 sm:bottom-12 sm:left-8 sm:right-12 md:left-12 text-white z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              >
                <span className="text-brand-gold uppercase tracking-hero text-[10px] font-extrabold mb-4 block">
                  {sCollection}
                </span>
                
                {/* Cinematic animated heading */}
                <h1 className="text-4xl md:text-6xl font-editorial-title mb-6 leading-tight">
                  {sTitle.split(' ').map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br className="hidden sm:inline" />
                  <motion.span
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="font-bold italic gold-foil-text block sm:inline-block"
                  >
                    {sTitleGold}
                  </motion.span>
                </h1>
                
                <div className="flex items-center gap-4">
                  <Link to="/portfolio" className="bg-brand-gold text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-gold-muted shadow-xl shadow-brand-gold/20">
                    {t('cta.portfolio')}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left/Right controls (Fade in on hover) */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass border border-white/10 hover:border-brand-gold text-white hover:text-brand-gold hidden md:flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass border border-white/10 hover:border-brand-gold text-white hover:text-brand-gold hidden md:flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators / Progress bars */}
          <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:right-12 z-20 flex gap-4 sm:gap-2.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentSlide(idx);
                  setSlideTick((n) => n + 1);
                }}
                className="group/btn relative py-4 px-1.5 sm:py-2 sm:px-0"
              >
                <div className={`h-[3px] rounded-full transition-all duration-500 ${
                  currentSlide === idx ? 'w-10 sm:w-8 bg-brand-gold' : 'w-6 sm:w-3.5 bg-white/35 hover:bg-white/60'
                }`} />
              </button>
            ))}
          </div>

        </div>

        {/* Featured Mini Card */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="col-span-1 md:col-span-4 row-span-2 flex"
        >
          <BentoSpotlight className="p-8 justify-between flex-grow flex flex-col">
            <div>
              <span className="text-foreground/45 text-[10px] uppercase tracking-widest font-black block">{t('home.featured.teaser')}</span>
              <h3 className="text-xl font-bold mt-2">{portfolioTitle(featured[0].id, t)}</h3>
              <p className="text-foreground/50 text-xs md:text-[11px] mt-1.5 font-light italic">{t('home.featured.desc')}</p>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setRequestItem(featured[0])}
                className="flex-1 py-3.5 bg-brand-gold text-black rounded-2xl text-[10px] tracking-wider md:text-[9px] md:tracking-widest font-black uppercase hover:bg-brand-gold-muted active:bg-brand-gold-muted shadow-lg shadow-brand-gold/10"
              >
                {t('portfolio.modal.request')}
              </button>
              <button 
                onClick={() => setIsAROpen(true)}
                className="p-3.5 bg-foreground/5 border border-foreground/10 hover:border-brand-gold hover:text-brand-gold rounded-2xl flex items-center justify-center"
                title="AR View"
                aria-label="AR View"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </BentoSpotlight>
        </motion.div>

        {/* Warranty Card */}
        <motion.div
           initial={{ opacity: 0, x: 25 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3, duration: 0.6 }}
           className="col-span-1 md:col-span-2 row-span-2 flex"
        >
          <BentoSpotlight className="bg-brand-gold text-black p-8 md:p-4 lg:p-8 justify-between flex-grow flex flex-col relative overflow-hidden group shadow-lg shadow-brand-gold/10">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125" />
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shrink-0">
              <Shield className="w-5 h-5 text-brand-gold" />
            </div>
            <div className="mt-4">
              <h4 className="font-extrabold text-sm md:text-[11px] lg:text-sm uppercase tracking-wider leading-tight whitespace-pre-line">{t('home.warranty.title')}</h4>
              <p className="text-[11px] md:text-[9px] opacity-75 mt-1 font-semibold italic">{t('home.warranty.desc')}</p>
            </div>
          </BentoSpotlight>
        </motion.div>

        {/* Rating Card */}
        <motion.div
           initial={{ opacity: 0, x: 25 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4, duration: 0.6 }}
           className="col-span-1 md:col-span-2 row-span-2 flex"
        >
          <BentoSpotlight className="flex-col items-center justify-center text-center p-6 md:p-3 lg:p-6 flex-grow flex">
            <div className="text-4xl font-editorial-title text-brand-gold mb-1 font-bold">4.9 / 5</div>
            <div className="flex space-x-1 mb-2 text-brand-gold">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <div className="text-[11px] md:text-[9px] uppercase font-black text-foreground/45 tracking-widest">{t('home.rating.desc')}</div>
          </BentoSpotlight>
        </motion.div>

        {/* Small Teasers */}
        <BentoSpotlight className="col-span-1 md:col-span-4 row-span-2 overflow-hidden flex flex-col group">
          <div className="p-6">
            <h3 className="text-xs font-black uppercase tracking-widest">{t('home.teaser1.title')}</h3>
            <p className="text-[11px] md:text-[10px] text-foreground/45 mt-1 italic">{t('home.teaser1.desc')}</p>
          </div>
          {/* A CSS background can never lazy-load; the absolute <img> keeps the card height. */}
          <div className="flex-grow relative overflow-hidden min-h-[140px] group-hover:scale-105">
            <img src="/images/bed.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </BentoSpotlight>

        <BentoSpotlight className="col-span-1 md:col-span-4 row-span-2 overflow-hidden flex flex-col group">
          <div className="p-6">
            <h3 className="text-xs font-black uppercase tracking-widest">{t('home.teaser2.title')}</h3>
            <p className="text-[11px] md:text-[10px] text-foreground/45 mt-1 italic">{t('home.teaser2.desc')}</p>
          </div>
          <div className="flex-grow relative overflow-hidden min-h-[140px] group-hover:scale-105">
            <img src="/images/dining_table.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </BentoSpotlight>

        <BentoSpotlight className="col-span-1 md:col-span-4 row-span-2 p-8 justify-center border-l-4 border-l-brand-gold flex flex-col">
          <p className="text-xs leading-relaxed italic text-foreground/75 font-light">
            {t('home.testimonial.text')}
          </p>
          <div className="flex items-center mt-6 space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-foreground/5 overflow-hidden shrink-0">
               <img src="https://i.pravatar.cc/150?u=9" alt="Elena" loading="lazy" decoding="async" width={150} height={150} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[11px] md:text-[10px] font-black uppercase tracking-wider">{t('home.testimonial.name')}</div>
              <div className="text-[10px] md:text-[8px] text-foreground/45 uppercase tracking-widest font-black">{t('home.testimonial.role')}</div>
            </div>
          </div>
        </BentoSpotlight>

      </div>

      {/* Featured Products Section */}
      <section className="py-6 md:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">{t('featured.teaser')}</span>
            <h2 className="text-3xl md:text-5xl font-editorial-title mt-2">{t('featured.title')}</h2>
            <p className="text-xs text-foreground/50 italic mt-1">{t('featured.desc')}</p>
          </div>
          <Link to="/portfolio" className="text-brand-gold font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 py-3 -my-3 md:py-0 md:my-0">
            {t('common.seeAll')} <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className="bento-card glow-tracer p-6 group flex flex-col h-full"
            >
              <div className="relative aspect-square rounded-[1.8rem] overflow-hidden mb-6">
                <img src={item.images[0].src} alt={portfolioTitle(item.id, t)} loading="lazy" decoding="async" width={item.images[0].width} height={item.images[0].height} className="w-full h-full object-cover group-hover:scale-105" />
                
                {/* Floating actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  <button 
                    onClick={(e) => handleToggleWishlist(item, e)}
                    aria-label={t('portfolio.filter.favorites')}
                    aria-pressed={isInWishlist(item.id)}
                    className={`p-4 md:p-2.5 rounded-full shadow-md ${
                      isInWishlist(item.id) ? "bg-red-500 text-white" : "glass text-foreground hover:scale-110"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                <div className="absolute top-4 left-4 glass px-4 py-1.5 rounded-full text-[11px] md:text-[9px] font-black text-brand-gold uppercase tracking-wider md:tracking-widest">
                  {t(`portfolio.category.${item.category}`)}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold tracking-tight text-foreground">{portfolioTitle(item.id, t)}</h3>
              </div>
              
              <button
                onClick={() => setRequestItem(item)}
                className="w-full mt-auto py-3.5 md:py-3 bg-foreground/5 hover:bg-brand-gold hover:text-black active:bg-brand-gold active:text-black rounded-xl text-[11px] md:text-[9px] font-black uppercase tracking-widest border border-foreground/5"
              >
                {t('portfolio.modal.request')}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showroom & consultation Section */}
      <section className="py-6 md:py-12 border-t border-foreground/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[550px]">
           <div className="bento-card p-6 sm:p-10 md:p-12 flex flex-col justify-between">
              <div>
                <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">{t('showroom.teaser')}</span>
                <h2 className="text-3xl md:text-5xl font-editorial-title mt-2 mb-4">{t('showroom.title')}</h2>
                <div className="flex items-center gap-3 text-brand-gold mb-6">
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Tashkent, Uzbekistan</span>
                </div>
                <p className="text-xs text-foreground/55 leading-relaxed mb-8 font-light italic">
                  {t('showroom.desc')}
                </p>
                <div className="space-y-3.5">
                   <div className="flex items-center gap-4 text-xs md:text-[10px] font-bold uppercase tracking-wider text-foreground/75">
                      <Clock className="w-4 h-4 text-brand-gold" />
                      <span>{t('showroom.hours')}</span>
                   </div>
                   <div className="flex items-center gap-4 text-xs md:text-[10px] font-bold uppercase tracking-wider text-foreground/75">
                      <Phone className="w-4 h-4 text-brand-gold" />
                      <a href={`tel:${t('showroom.phone').replace(/\s/g, '')}`} className="py-2 -my-2">{t('showroom.phone')}</a>
                   </div>
                </div>
              </div>
              
              <Link to="/contact" className="w-full mt-10 py-4 px-5 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black rounded-full font-bold text-xs uppercase tracking-widest text-center">
                {t('showroom.cta')}
              </Link>
           </div>
           
           <div className="bento-card overflow-hidden h-[350px] lg:h-auto relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1891.13!2d69.24!3d41.31!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzM2LjAiTiA2OcKwMTQnMjQuMCJF!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                className="grayscale dark:invert opacity-100 md:opacity-75 md:hover:opacity-100 transition-opacity duration-500"
                loading="lazy"
                title="Faxr Mebel Showroom Map"
              ></iframe>
              {/* One tap to hand the map the gesture, so a scroll past it does not get captured. */}
              {!mapActive && (
                <button
                  type="button"
                  onClick={() => setMapActive(true)}
                  aria-label={t('showroom.title')}
                  className="absolute inset-0 md:hidden"
                />
              )}
           </div>
        </div>
      </section>

      {/* Floating CTA for Mobile Telegram Group */}
      <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-40 md:hidden flex flex-col gap-4">
        <a href="https://t.me/faxrmebel" target="_blank" rel="noopener noreferrer" aria-label="Telegram" title="Telegram" className="bg-[#229ED9] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95">
          <Send className="w-6 h-6" />
        </a>
      </div>

      {/* Luxury Modals */}
      <ARModal 
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        productName={portfolioTitle(featured[0].id, t)}
        productId={featured[0].id}
      />

      <RequestModal
        isOpen={requestItem !== null}
        onClose={() => setRequestItem(null)}
        source={
          requestItem
            ? { itemId: requestItem.id, category: requestItem.category, image: requestItem.images[0].src, title: portfolioTitle(requestItem.id, t) }
            : undefined
        }
      />
    </div>
  );
};
