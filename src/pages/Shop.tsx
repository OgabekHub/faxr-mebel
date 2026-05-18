import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, ShoppingCart, Eye, Grid, List, Sparkles, X, Heart, ShieldCheck, Check } from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// Locally hosted premium generated images and stock Unsplash items
const allProducts = [
  { id: '1', name: 'Royal Velvet Sofa', price: 12000000, rating: 4.9, category: 'Sofa', image: '/images/sofa.png', wood: 'Walnut (Yong\'oq)', fabric: 'Italian Velvet', size: '240cm x 95cm x 85cm' },
  { id: '2', name: 'Modern Oak Dining Table', price: 8500000, rating: 4.8, category: 'Dining', image: '/images/dining_table.png', wood: 'Oak (Eman)', fabric: 'N/A', size: '180cm x 90cm x 75cm' },
  { id: '3', name: 'Minimalist Bed Frame', price: 15000000, rating: 5.0, category: 'Bedroom', image: '/images/bed.png', wood: 'Walnut (Yong\'oq)', fabric: 'Premium Textile', size: '200cm x 220cm x 110cm' },
  { id: '4', name: 'Leather Armchair', price: 4500000, rating: 4.7, category: 'Sofa', image: 'https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?q=80&w=600', wood: 'Oak (Eman)', fabric: 'Full-grain Leather', size: '85cm x 90cm x 95cm' },
  { id: '5', name: 'Marble Coffee Table', price: 3200000, rating: 4.6, category: 'Luxury Decor', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600', wood: 'Brass details', fabric: 'White Marble', size: '100cm x 60cm x 40cm' },
  { id: '6', name: 'Office Ergonomic Chair', price: 2800000, rating: 4.9, category: 'Office', image: 'https://images.unsplash.com/photo-1505797149-4510fe941323?q=80&w=600', wood: 'Aluminium frame', fabric: 'Breathable Mesh', size: '65cm x 65cm x 120cm' },
];

const categories = ['All', 'Sofa', 'Bedroom', 'Dining', 'Office', 'Luxury Decor'];

export const Shop = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(20000000); // 20M UZS max
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  
  // Custom bespoke wood and fabric selection inside the modal
  const [bespokeWood, setBespokeWood] = useState('Walnut (Yong\'oq)');
  const [bespokeFabric, setBespokeFabric] = useState('Italian Velvet');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      triggerToast('Katalogdan olib tashlandi');
    } else {
      setWishlist([...wishlist, productId]);
      triggerToast('Sevimlilarga qo\'shildi!');
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: any, customized = false) => {
    const finalProduct = customized 
      ? { ...product, name: `${product.name} (Custom)`, bespokeDetails: { wood: bespokeWood, fabric: bespokeFabric } }
      : product;
    addToCart(finalProduct);
    triggerToast(`${finalProduct.name} savatga qo'shildi!`);
    setQuickViewProduct(null);
  };

  const filteredProducts = allProducts.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.price <= priceRange
  );

  return (
    <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Mini notification toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-50 glass px-6 py-3.5 rounded-full border border-brand-gold/30 shadow-2xl flex items-center gap-3"
          >
            <div className="w-5 h-5 bg-brand-gold text-black rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-foreground/5">
        <div>
          <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Luxury Showcase</span>
          <h1 className="text-4xl md:text-6xl font-editorial-title mt-2 mb-3">
            Eksklyuziv <span className="font-bold italic gold-foil-text">Katalog.</span>
          </h1>
          <p className="text-foreground/45 text-[9px] uppercase tracking-hero font-extrabold">Professional Mebelsozlik San'ati</p>
        </div>
        
        {/* Toggle Grid/List and Category Chips */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {/* Category Scroller */}
          <div className="flex bg-foreground/5 border border-foreground/5 p-1 rounded-2xl overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedCategory === cat 
                    ? "bg-brand-gold text-black shadow-md font-bold" 
                    : "text-foreground/45 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toggle View button */}
          <div className="hidden md:flex bg-foreground/5 p-1 rounded-xl gap-1">
            <button 
              onClick={() => setViewType('grid')} 
              className={cn("p-2 rounded-lg transition-colors", viewType === 'grid' ? "bg-brand-gold text-black shadow" : "text-foreground/40")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewType('list')} 
              className={cn("p-2 rounded-lg transition-colors", viewType === 'list' ? "bg-brand-gold text-black shadow" : "text-foreground/40")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar Filters */}
        <aside className="space-y-8 lg:col-span-1">
          {/* Search Box */}
          <div className="bento-card glow-tracer p-8">
            <h3 className="text-[10px] font-black uppercase tracking-hero mb-5 text-brand-gold">Qidiruv</h3>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Premium asar nomi..." 
                className="w-full bg-foreground/5 border border-foreground/10 focus:border-brand-gold rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors placeholder:text-foreground/20 italic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-4 top-3.5 w-4 h-4 text-foreground/20 group-hover:text-brand-gold transition-colors" />
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bento-card glow-tracer p-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[10px] font-black uppercase tracking-hero text-brand-gold">Narxi</h3>
              <span className="text-xs font-bold text-foreground/70">{formatPrice(priceRange)} gacha</span>
            </div>
            <input 
              type="range" 
              min={2000000}
              max={20000000}
              step={500000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-foreground/30 mt-3">
              <span>{formatPrice(2000000)}</span>
              <span>{formatPrice(20000000)}</span>
            </div>
          </div>

          {/* Bespoke Inquiry Card */}
          <div className="bento-card p-8 bg-brand-gold text-black relative overflow-hidden group shadow-lg shadow-brand-gold/15">
             <div className="absolute -right-16 -bottom-16 w-36 h-36 bg-black/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
             <Sparkles className="w-6 h-6 mb-4 text-black animate-pulse-slow" />
             <h4 className="text-sm font-extrabold uppercase tracking-wider mb-2">Maxsus Buyurtma Kerakmi?</h4>
             <p className="text-[10px] leading-relaxed mb-6 font-semibold opacity-75">
               Bizning mohir ustalarimiz sizning xonangiz o'lchamlari va shaxsiy loyihangiz bo'yicha eksklyuziv mebellarni tayyorlab bera olishadi.
             </p>
             <Link 
               to="/contact" 
               className="w-full py-3.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-hero text-center block hover:scale-[1.02] active:scale-95 transition-transform"
             >
               So'rov yuborish
             </Link>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3">
          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={product.id}
                    className="bento-card glow-tracer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.8rem]">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      
                      {/* Floating actions */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button 
                          onClick={() => toggleWishlist(product.id)}
                          className={cn(
                            "p-2.5 rounded-full transition-all duration-300 shadow-md",
                            wishlist.includes(product.id) ? "bg-red-500 text-white" : "glass text-foreground hover:scale-110"
                          )}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button 
                          onClick={() => setQuickViewProduct(product)}
                          className="p-2.5 glass text-foreground rounded-full shadow-md hover:scale-110 transition-transform"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-foreground">
                        {product.category}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div className="mb-4">
                        <div className="flex items-center justify-between gap-2">
                           <h3 className="text-base font-bold tracking-tight text-foreground">{product.name}</h3>
                           <div className="flex items-center gap-1 text-brand-gold text-[10px] font-bold shrink-0">
                             <Star className="w-3 h-3 fill-current" /> {product.rating}
                           </div>
                        </div>
                        <p className="text-[10px] text-foreground/45 leading-relaxed italic line-clamp-2 mt-2">
                          Materiali: {product.wood} | {product.fabric}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                        <span className="price-tag text-xl font-bold">{formatPrice(product.price)}</span>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-brand-gold text-black p-3.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md shadow-brand-gold/15"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* List / Editorial View */
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    key={product.id}
                    className="bento-card glow-tracer p-6 flex flex-col md:flex-row items-center gap-8 group"
                  >
                    <div className="w-48 h-48 rounded-2xl overflow-hidden shrink-0 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-2 left-2 glass px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-foreground">
                        {product.category}
                      </div>
                    </div>

                    <div className="flex-grow space-y-3 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-1 text-brand-gold text-[10px] font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {product.rating} (Mijozlar bahosi)
                        </div>
                      </div>
                      <p className="text-xs text-foreground/50 leading-relaxed font-light italic">
                        Ushbu premium mahsulot eng saralangan tabiiy {product.wood} yog'ochi hamda yuqori sifatli {product.fabric} matolaridan mohir ustalarimiz tomonidan qo'lda yasalgan.
                      </p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-bold uppercase tracking-wider text-foreground/45">
                        <span>O'lchamlari: <strong className="text-foreground">{product.size}</strong></span>
                        <span>Yog'ochi: <strong className="text-brand-gold">{product.wood}</strong></span>
                      </div>
                    </div>

                    <div className="shrink-0 text-center md:text-right flex flex-col gap-3 min-w-[150px]">
                      <span className="price-tag text-2xl font-bold">{formatPrice(product.price)}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-3 bg-brand-gold text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-102 transition-transform shadow shadow-brand-gold/15"
                      >
                        Savatga Qo'shish
                      </button>
                      <button 
                        onClick={() => setQuickViewProduct(product)}
                        className="w-full py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        Tezkor Ko'rish
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 bento-card border-dashed">
              <Search className="w-12 h-12 text-foreground/10 mb-4 animate-bounce" />
              <p className="text-foreground/45 text-[10px] italic tracking-widest uppercase font-black">Ushbu kolleksiyadan premium mahsulotlar topilmadi</p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Quick View Modal Dialog */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Modal Dialog Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background border border-foreground/5 rounded-[2.5rem] w-full max-w-4xl p-8 relative z-10 shadow-2xl flex flex-col md:flex-row gap-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close trigger button */}
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-foreground/5 transition-colors z-20 text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side Visual Preview */}
              <div className="w-full md:w-1/2 aspect-square rounded-3xl overflow-hidden shrink-0 relative">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 glass px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-foreground">
                  {quickViewProduct.category}
                </div>
              </div>

              {/* Right Side Options & Customization */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block mb-1">PREMIUM ARTISAN BLOCK</span>
                  <h3 className="text-3xl font-editorial-title font-bold text-foreground mb-4">{quickViewProduct.name}</h3>
                  
                  <div className="flex items-center gap-6 text-[10px] uppercase font-bold text-foreground/45 tracking-wider mb-6 pb-4 border-b border-foreground/5">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current text-brand-gold" /> {quickViewProduct.rating} Rating</span>
                    <span>O'lchami: <strong className="text-foreground">{quickViewProduct.size}</strong></span>
                  </div>

                  <p className="text-xs text-foreground/50 leading-relaxed font-light italic mb-6">
                    Mebelimiz sizning xohishingizga ko'ra butunlay moslashtirilishi mumkin. Quyida ustaxonadan chiqadigan mebelingiz uchun yog'och turi va matoni tanlang:
                  </p>

                  {/* Wood and Upholstery Selection Controls inside Modal */}
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block mb-2">Daraxt Turi (Wood Selection)</label>
                      <select 
                        value={bespokeWood}
                        onChange={(e) => setBespokeWood(e.target.value)}
                        className="bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-xs outline-none w-full font-bold focus:border-brand-gold transition-all"
                      >
                        <option value="Walnut (Yong'oq)">Walnut (Oliy Yong'oq Yog'ochi)</option>
                        <option value="Oak (Eman)">Oak (Klassik Eman Yog'ochi)</option>
                        <option value="Birch (Qayrag'och)">Birch (Eco Zarafshon Qayrag'ochi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-foreground/40 block mb-2">Qoplama Matosi (Fabric Selection)</label>
                      <select 
                        value={bespokeFabric}
                        onChange={(e) => setBespokeFabric(e.target.value)}
                        className="bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-2.5 text-xs outline-none w-full font-bold focus:border-brand-gold transition-all"
                      >
                        <option value="Italian Velvet">Italian Velvet (Hashamatli Baxmal)</option>
                        <option value="Full-grain Leather">Full-grain Leather (Toza Italiya Charmi)</option>
                        <option value="Premium Textile">Premium Textile (Chidamli Premium Mato)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-foreground/5 flex items-center justify-between gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black tracking-widest text-foreground/40">Umumiy Qiymati</span>
                    <span className="price-tag text-2xl font-bold">{formatPrice(quickViewProduct.price)}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(quickViewProduct, true)}
                    className="flex-grow bg-brand-gold text-black py-4 rounded-2xl font-extrabold text-xs uppercase tracking-hero hover:scale-102 transition-transform shadow-lg shadow-brand-gold/15 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Maxsus Savatga Qo'shish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
