import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowRight, Star, Truck, Award, Shield, Headset, MapPin, Clock, Phone, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';

const featuredProducts = [
  {
    id: '1',
    name: 'Royal Velvet Sofa',
    price: 12000000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    category: 'Sofa'
  },
  {
    id: '2',
    name: 'Modern Oak Dining Table',
    price: 8500000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1577145000247-a737ad7360c6?q=80&w=2070&auto=format&fit=crop',
    category: 'Dining'
  },
  {
    id: '3',
    name: 'Minimalist Bed Frame',
    price: 15000000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1505693419163-42117af13c88?q=80&w=2070&auto=format&fit=crop',
    category: 'Bedroom'
  }
];

const categories = [
  { name: 'Sofa', icon: '🛋️', count: '45+', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Bedroom', icon: '🛏️', count: '120+', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop' },
  { name: 'Dining Table', icon: '🍽️', count: '30+', image: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Office', icon: '💼', count: '15+', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop' },
];

const testimonials = [
  { name: 'Aziz R.', role: 'Architect', text: 'Faxr Mebel transformed our office into a luxury space. The craftsmanship is unmatched.', rating: 5 },
  { name: 'Madina K.', role: 'Interior Designer', text: 'The velvet sofa is just stunning. High quality and super comfortable.', rating: 5 },
  { name: 'Jasur M.', role: 'Business Owner', text: 'Fast delivery and excellent customer service. Highly recommended!', rating: 4 },
];

export const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col pt-24 px-6 gap-6 max-w-7xl mx-auto mb-20 overflow-hidden">
      {/* Bento Grid Header / Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-6 gap-4 min-h-[800px] md:h-[90vh]">
        
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-8 row-span-4 bg-brand-card rounded-[2.5rem] overflow-hidden relative group border border-white/5"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 max-w-xl text-white">
            <span className="text-brand-gold uppercase tracking-hero text-[10px] font-bold mb-4 block">Collection 2026</span>
            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6 italic">
              Modern Living For <br/>
              <span className="font-bold not-italic">Elegant Spaces.</span>
            </h1>
            <div className="flex space-x-4">
              <Link to="/shop" className="bg-brand-gold text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-gold-muted transition-all">
                {t('cta.shop')}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Featured Mini Card */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="col-span-1 md:col-span-4 row-span-2 bento-card p-8 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="z-10">
            <span className="text-foreground/40 text-[10px] uppercase tracking-widest font-bold">Featured Item</span>
            <h3 className="text-xl font-bold mt-2">Aurelius Velvet Sofa</h3>
            <p className="text-foreground/60 text-xs mt-2">Premium Italian textile fabric.</p>
            <span className="text-brand-gold font-bold text-lg mt-4 block italic">{formatPrice(12500000)}</span>
          </div>
          <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-brand-gold/50 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
          </div>
          <button 
            onClick={() => addToCart(featuredProducts[0])}
            className="mt-6 w-full py-3 bg-foreground/5 border border-foreground/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-colors z-10"
          >
            Add to Cart
          </button>
        </motion.div>

        {/* Warranty Card */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
           className="col-span-1 md:col-span-2 row-span-2 bg-brand-gold p-8 text-black flex flex-col justify-between rounded-[2rem]"
        >
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <h4 className="font-bold text-sm uppercase tracking-tight">Lifetime<br/>Warranty</h4>
            <p className="text-[10px] opacity-80 mt-1 font-medium italic">Global Protection Policy</p>
          </div>
        </motion.div>

        {/* Rating Card */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="col-span-1 md:col-span-2 row-span-2 bento-card flex flex-col items-center justify-center text-center p-6"
        >
          <div className="text-4xl font-light italic text-brand-gold mb-1">4.9/5</div>
          <div className="flex space-x-1 mb-2 text-brand-gold">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
          </div>
          <div className="text-[10px] uppercase font-bold text-foreground/40 tracking-tighter">Customer Rating</div>
        </motion.div>

        {/* Small Teasers */}
        <div className="col-span-1 md:col-span-4 row-span-2 bento-card overflow-hidden flex flex-col">
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest">Luxury Decor</h3>
            <p className="text-[10px] text-foreground/40 mt-1 italic">Curated accessories for your home</p>
          </div>
          <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center min-h-[120px]"></div>
        </div>

        <div className="col-span-1 md:col-span-4 row-span-2 bento-card overflow-hidden flex flex-col">
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest">Bedroom Series</h3>
            <p className="text-[10px] text-foreground/40 mt-1 italic">Artisan crafted comfort</p>
          </div>
          <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1505693419163-42117af13c88?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center min-h-[120px]"></div>
        </div>

        <div className="col-span-1 md:col-span-4 row-span-2 bento-card p-8 flex flex-col justify-center border-l-4 border-l-brand-gold">
          <p className="text-xs leading-relaxed italic text-foreground/80">
            "Faxr Mebel redefined my apartment. The craftsmanship is visible in every joint and seam. Simply world-class."
          </p>
          <div className="flex items-center mt-6 space-x-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 overflow-hidden">
               <img src="https://i.pravatar.cc/150?u=9" alt="" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase">Elena V.</div>
              <div className="text-[8px] text-foreground/40 uppercase tracking-widest font-black">Interior Designer</div>
            </div>
          </div>
        </div>

      </div>

      {/* Featured Products Section (Existing) - Restyled */}
      <section className="py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-display font-bold tracking-tight mb-2 underline decoration-brand-gold/30 decoration-8 underline-offset-8">{t('section.featured')}</h2>
            <p className="text-foreground/60 text-sm italic">Pieces selected for modern spaces</p>
          </div>
          <Link to="/shop" className="text-brand-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -8 }}
              className="bento-card p-6"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                  {product.category}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-1 tracking-tight">{product.name}</h3>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-display font-bold italic">{formatPrice(product.price)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-brand-gold text-black p-3 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 border-t border-foreground/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
           <div className="bento-card p-12 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-display font-bold mb-4 tracking-tighter">Showroom</h2>
                <div className="flex items-center gap-3 text-brand-gold mb-8">
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Tashkent, Uzbekistan</span>
                </div>
                <p className="text-foreground/60 leading-relaxed mb-12 italic">
                  Experience the tactility of our premium textiles and the precision of our craftsmanship in person.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-xs font-bold">
                      <Clock className="w-4 h-4 text-brand-gold" /> 
                      <span className="tracking-widest uppercase">09:00 — 20:00 Daily</span>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold">
                      <Phone className="w-4 h-4 text-brand-gold" /> 
                      <span className="tracking-widest uppercase">+998 71 200 00 00</span>
                   </div>
                </div>
              </div>
              <button className="w-full py-4 border border-brand-gold text-brand-gold rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all">
                Book a consultation
              </button>
           </div>
           <div className="bento-card overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1891.13!2d69.24!3d41.31!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE4JzM2LjAiTiA2OcKwMTQnMjQuMCJF!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                className="grayscale dark:invert opacity-70 hover:opacity-100 transition-opacity"
                loading="lazy" 
              ></iframe>
           </div>
        </div>
      </section>

      {/* Floating CTA for Mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden flex flex-col gap-4">
        <a href="https://t.me/faxrmebel" className="bg-[#229ED9] text-white p-4 rounded-full shadow-lg">
          <Send className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};
