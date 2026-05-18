import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Shield, Award, MapPin, Clock, Phone, Send, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';

// Premium locally hosted generated mebel assets
const featuredProducts = [
  {
    id: '1',
    name: 'Royal Velvet Sofa',
    price: 12000000,
    rating: 4.9,
    image: '/images/sofa.png',
    category: 'Sofa'
  },
  {
    id: '2',
    name: 'Modern Oak Dining Table',
    price: 8500000,
    rating: 4.8,
    image: '/images/dining_table.png',
    category: 'Dining'
  },
  {
    id: '3',
    name: 'Minimalist Bed Frame',
    price: 15000000,
    rating: 5.0,
    image: '/images/bed.png',
    category: 'Bedroom'
  }
];

const woodMaterials = [
  { id: 'walnut', color: 'bg-[#402C1B]', texture: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=400' },
  { id: 'oak', color: 'bg-[#BFA37A]', texture: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=400' },
  { id: 'birch', color: 'bg-[#EBDCB9]', texture: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=400' }
];

const fabricMaterials = [
  { id: 'velvet', color: 'bg-emerald-800' },
  { id: 'leather', color: 'bg-amber-950' }
];

export const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [selectedWood, setSelectedWood] = useState(woodMaterials[0]);
  const [selectedFabric, setSelectedFabric] = useState(fabricMaterials[0]);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedToast(t(`product.${product.id}.name`));
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="flex flex-col pt-32 px-6 gap-16 max-w-7xl mx-auto mb-20 overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3.5 rounded-full border border-brand-gold/30 shadow-2xl flex items-center gap-3"
          >
            <div className="w-5 h-5 bg-brand-gold text-black rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              {addedToast} {t('home.toast.added')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bento Grid Header / Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-6 gap-5 min-h-[850px] md:h-[90vh]">
        
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="col-span-1 md:col-span-8 row-span-4 rounded-[3rem] overflow-hidden relative group border border-foreground/5 bento-card"
        >
          <div className="absolute inset-0 bg-[url('/images/sofa.png')] bg-cover bg-center opacity-65 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
          <div className="absolute bottom-12 left-8 md:left-12 right-12 text-white z-10">
            <span className="text-brand-gold uppercase tracking-hero text-[10px] font-extrabold mb-4 block">{t('home.hero.collection')}</span>
            <h1 className="text-4xl md:text-6xl font-editorial-title mb-6">
              {t('home.hero.title')} <br/>
              <span className="font-bold italic gold-foil-text">{t('home.hero.titleGold')}</span>
            </h1>
            <div className="flex space-x-4">
              <Link to="/shop" className="bg-brand-gold text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-gold-muted transition-all duration-300 shadow-xl shadow-brand-gold/20">
                {t('cta.shop')}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Featured Mini Card */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="col-span-1 md:col-span-4 row-span-2 bento-card glow-tracer p-8 flex flex-col justify-between"
        >
          <div>
            <span className="text-foreground/45 text-[10px] uppercase tracking-widest font-black block">{t('home.featured.teaser')}</span>
            <h3 className="text-xl font-bold mt-2">{t(`product.${featuredProducts[0].id}.name`)}</h3>
            <p className="text-foreground/50 text-[11px] mt-1.5 font-light italic">{t('home.featured.desc')}</p>
            <span className="price-tag text-2xl mt-4 block italic">{formatPrice(12000000)}</span>
          </div>
          <button 
            onClick={() => handleAddToCart(featuredProducts[0])}
            className="mt-6 w-full py-3.5 bg-foreground/5 border border-foreground/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all duration-300"
          >
            {t('common.addToCart')}
          </button>
        </motion.div>

        {/* Warranty Card */}
        <motion.div
           initial={{ opacity: 0, x: 25 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3, duration: 0.6 }}
           className="col-span-1 md:col-span-2 row-span-2 bg-brand-gold text-black p-8 flex flex-col justify-between rounded-[2.2rem] shadow-lg shadow-brand-gold/10 relative overflow-hidden group"
        >
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
            <Shield className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider leading-tight whitespace-pre-line">{t('home.warranty.title')}</h4>
            <p className="text-[9px] opacity-75 mt-1 font-semibold italic">{t('home.warranty.desc')}</p>
          </div>
        </motion.div>

        {/* Rating Card */}
        <motion.div
           initial={{ opacity: 0, x: 25 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4, duration: 0.6 }}
           className="col-span-1 md:col-span-2 row-span-2 bento-card glow-tracer flex flex-col items-center justify-center text-center p-6"
        >
          <div className="text-4xl font-editorial-title text-brand-gold mb-1 font-bold">4.9 / 5</div>
          <div className="flex space-x-1 mb-2 text-brand-gold">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
          </div>
          <div className="text-[9px] uppercase font-black text-foreground/45 tracking-widest">{t('home.rating.desc')}</div>
        </motion.div>

        {/* Small Teasers */}
        <div className="col-span-1 md:col-span-4 row-span-2 bento-card glow-tracer overflow-hidden flex flex-col group">
          <div className="p-6">
            <h3 className="text-xs font-black uppercase tracking-widest">{t('home.teaser1.title')}</h3>
            <p className="text-[10px] text-foreground/45 mt-1 italic">{t('home.teaser1.desc')}</p>
          </div>
          <div className="flex-1 bg-[url('/images/bed.png')] bg-cover bg-center min-h-[140px] group-hover:scale-105 transition-transform duration-700"></div>
        </div>

        <div className="col-span-1 md:col-span-4 row-span-2 bento-card glow-tracer overflow-hidden flex flex-col group">
          <div className="p-6">
            <h3 className="text-xs font-black uppercase tracking-widest">{t('home.teaser2.title')}</h3>
            <p className="text-[10px] text-foreground/45 mt-1 italic">{t('home.teaser2.desc')}</p>
          </div>
          <div className="flex-1 bg-[url('/images/dining_table.png')] bg-cover bg-center min-h-[140px] group-hover:scale-105 transition-transform duration-700"></div>
        </div>

        <div className="col-span-1 md:col-span-4 row-span-2 bento-card p-8 flex flex-col justify-center border-l-4 border-l-brand-gold">
          <p className="text-xs leading-relaxed italic text-foreground/75 font-light">
            {t('home.testimonial.text')}
          </p>
          <div className="flex items-center mt-6 space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-foreground/5 overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=9" alt="Elena" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider">{t('home.testimonial.name')}</div>
              <div className="text-[8px] text-foreground/45 uppercase tracking-widest font-black">{t('home.testimonial.role')}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Craftsmanship & Materials Showcase */}
      <section className="py-12 border-t border-foreground/5">
        <div className="text-center mb-12">
          <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">{t('materials.teaser')}</span>
          <h2 className="text-3xl md:text-5xl font-editorial-title mt-2">{t('materials.title')} <span className="font-bold italic gold-foil-text">{t('materials.titleGold')}</span></h2>
          <p className="text-xs text-foreground/55 max-w-xl mx-auto mt-4 font-light leading-relaxed">
            {t('materials.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Wood Selector */}
          <div className="bento-card glow-tracer p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-foreground/5 pb-4 mb-6">
                <h3 className="text-lg font-bold tracking-tight uppercase text-brand-gold">{t('materials.wood.title')}</h3>
                <Award className="w-5 h-5 text-brand-gold" />
              </div>
              
              <div className="flex gap-3 mb-6">
                {woodMaterials.map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => setSelectedWood(wood)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      selectedWood.id === wood.id 
                        ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/15' 
                        : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${wood.color} border border-white/20`} />
                    {t(`wood.${wood.id}.name`).split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-editorial-title font-bold text-foreground">{t(`wood.${selectedWood.id}.name`)}</h4>
                <div className="flex items-center gap-8 text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                  <span>Kelib chiqishi: <strong className="text-foreground">{t(`wood.${selectedWood.id}.origin`)}</strong></span>
                  <span>Klassifikatsiya: <strong className="text-brand-gold">{t(`wood.${selectedWood.id}.type`)}</strong></span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed font-light italic mt-3">{t(`wood.${selectedWood.id}.description`)}</p>
              </div>
            </div>
            
            <div className="mt-8 relative h-32 rounded-2xl overflow-hidden group">
              <img src={selectedWood.texture} alt={t(`wood.${selectedWood.id}.name`)} className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-4">
                <span className="text-[9px] uppercase tracking-hero text-white/80 font-black border border-white/20 px-4 py-2 rounded-full">{t('materials.wood.texture')}</span>
              </div>
            </div>
          </div>

          {/* Fabric Selector */}
          <div className="bento-card glow-tracer p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-foreground/5 pb-4 mb-6">
                <h3 className="text-lg font-bold tracking-tight uppercase text-brand-gold">{t('materials.fabric.title')}</h3>
                <Info className="w-5 h-5 text-brand-gold" />
              </div>
              
              <div className="flex gap-3 mb-6">
                {fabricMaterials.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      selectedFabric.id === fabric.id 
                        ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/15' 
                        : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${fabric.color}`} />
                    {t(`fabric.${fabric.id}.name`).split(' ')[1] || t(`fabric.${fabric.id}.name`).split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-editorial-title font-bold text-foreground">{t(`fabric.${selectedFabric.id}.name`)}</h4>
                <div className="flex items-center gap-8 text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                  <span>Mato Xususiyati: <strong className="text-green-500">{t(`fabric.${selectedFabric.id}.feature`)}</strong></span>
                  <span>Kolleksiya: <strong className="text-brand-gold">{t(`fabric.${selectedFabric.id}.type`)}</strong></span>
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed font-light italic mt-3">{t(`fabric.${selectedFabric.id}.description`)}</p>
              </div>
            </div>

            <div className="mt-8 bg-foreground/5 p-6 rounded-2xl border border-foreground/5">
              <span className="text-[9px] uppercase font-black tracking-widest text-brand-gold block mb-3">{t('materials.fabric.custom')}</span>
              <p className="text-[11px] text-foreground/50 leading-relaxed">
                {t('materials.fabric.customDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">{t('featured.teaser')}</span>
            <h2 className="text-3xl md:text-5xl font-editorial-title mt-2">{t('featured.title')}</h2>
            <p className="text-xs text-foreground/50 italic mt-1">{t('featured.desc')}</p>
          </div>
          <Link to="/shop" className="text-brand-gold font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
            {t('common.seeAll')} <ArrowRight className="w-4 h-4 text-brand-gold" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -8 }}
              className="bento-card glow-tracer p-6 group"
            >
              <div className="relative aspect-square rounded-[1.8rem] overflow-hidden mb-6">
                <img src={product.image} alt={t(`product.${product.id}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-4 right-4 glass px-4 py-1.5 rounded-full text-[9px] font-black text-brand-gold uppercase tracking-widest">
                  {t(`shop.category.${product.category}`)}
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{t(`product.${product.id}.name`)}</h3>
                  <div className="flex items-center gap-1 mt-1 text-brand-gold text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-current" /> {product.rating}
                  </div>
                </div>
                <span className="price-tag text-lg font-bold">{formatPrice(product.price)}</span>
              </div>
              
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full mt-2 py-3 bg-foreground/5 hover:bg-brand-gold hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border border-foreground/5"
              >
                {t('common.addToCart')}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showroom & consultation Section */}
      <section className="py-12 border-t border-foreground/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[550px]">
           <div className="bento-card p-10 md:p-12 flex flex-col justify-between">
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
                   <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-foreground/75">
                      <Clock className="w-4 h-4 text-brand-gold" /> 
                      <span>{t('showroom.hours')}</span>
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-foreground/75">
                      <Phone className="w-4 h-4 text-brand-gold" /> 
                      <span>{t('showroom.phone')}</span>
                   </div>
                </div>
              </div>
              
              <Link to="/contact" className="w-full mt-10 py-4 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black rounded-full font-bold text-xs uppercase tracking-widest text-center transition-all duration-300">
                {t('showroom.cta')}
              </Link>
           </div>
           
           <div className="bento-card overflow-hidden h-[350px] lg:h-auto">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1891.13!2d69.24!3d41.31!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzM2LjAiTiA2OcKwMTQnMjQuMCJF!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                className="grayscale dark:invert opacity-75 hover:opacity-100 transition-opacity duration-500"
                loading="lazy" 
                title="Faxr Mebel Showroom Map"
              ></iframe>
           </div>
        </div>
      </section>

      {/* Floating CTA for Mobile Telegram Group */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden flex flex-col gap-4">
        <a href="https://t.me/faxrmebel" target="_blank" rel="noopener noreferrer" className="bg-[#229ED9] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <Send className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};
