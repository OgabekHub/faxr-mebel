import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Star, Send, ShoppingCart } from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';

const allProducts = [
  { id: '1', name: 'Royal Velvet Sofa', price: 12000000, rating: 4.9, category: 'Sofa', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc' },
  { id: '2', name: 'Modern Oak Dining', price: 8500000, rating: 4.8, category: 'Dining', image: 'https://images.unsplash.com/photo-1577145000247-a737ad7360c6' },
  { id: '3', name: 'Minimalist Bed', price: 15000000, rating: 5.0, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693419163-42117af13c88' },
  { id: '4', name: 'Leather Armchair', price: 4500000, rating: 4.7, category: 'Sofa', image: 'https://images.unsplash.com/photo-1583083527882-4bee9aba2eea' },
  { id: '5', name: 'Marble Coffee Table', price: 3200000, rating: 4.6, category: 'Luxury Decor', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88' },
  { id: '6', name: 'Office Ergonomic Chair', price: 2800000, rating: 4.9, category: 'Office', image: 'https://images.unsplash.com/photo-1505797149-4510fe941323' },
];

const categories = ['All', 'Sofa', 'Bedroom', 'Dining', 'Office', 'Luxury Decor'];

export const Shop = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = allProducts.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-10 max-w-[1600px] mx-auto min-h-screen">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-6xl font-display font-light italic mb-2">Curated <span className="not-italic font-bold">Catalog.</span></h1>
          <p className="text-foreground/40 text-[10px] uppercase tracking-hero font-bold">High-end architecture & furniture</p>
        </div>
        
        <div className="flex bg-brand-card border border-white/5 p-1 rounded-2xl w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                selectedCategory === cat ? "bg-brand-gold text-black shadow-lg" : "text-foreground/40 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="space-y-12">
          <div className="bento-card p-8">
            <h3 className="text-[10px] font-bold uppercase tracking-hero mb-6 text-brand-gold">Search</h3>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Find a masterpiece..." 
                className="w-full bg-foreground/5 border-b border-foreground/10 py-3 text-xs focus:outline-none focus:border-brand-gold transition-colors placeholder:text-foreground/20 italic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-0 top-3 w-4 h-4 text-foreground/20 group-hover:text-brand-gold transition-colors" />
            </div>
          </div>

          <div className="bento-card p-8 bg-brand-gold text-black">
             <h4 className="text-xs font-black uppercase tracking-tight mb-2">Need Bespoke Work?</h4>
             <p className="text-[10px] leading-relaxed mb-6 font-medium">Our master artisans can custom-build any design to fit your unique floor plan.</p>
             <button className="w-full py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform">
               Inquire Now
             </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  className="bento-card group flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-[2rem]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    <button 
                      onClick={() => addToCart(product)}
                      className="absolute bottom-6 right-6 p-4 bg-brand-gold text-black rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl hover:scale-110"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                         <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>
                         <div className="flex items-center gap-1 text-brand-gold text-[10px] font-bold">
                           <Star className="w-3 h-3 fill-current" /> 4.9
                         </div>
                      </div>
                      <p className="text-[11px] text-foreground/40 leading-relaxed italic line-clamp-2">Premium artisanal piece crafted for the most discerning interior spaces.</p>
                    </div>
                    <div className="mt-8 flex items-baseline gap-2">
                       <span className="text-2xl font-display font-light italic">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 bento-card border-dashed">
              <Search className="w-12 h-12 text-foreground/10 mb-4" />
              <p className="text-foreground/40 text-[10px] italic tracking-widest uppercase">No artifacts found in this collection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
