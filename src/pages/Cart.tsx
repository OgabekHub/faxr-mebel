import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { sendTelegramMessage } from '../services/telegram';

export const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalAmount, totalItems, clearCart } = useCart();
  
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderDetails = cart.map(item => `- ${item.name} (x${item.quantity}): ${formatPrice(item.price * item.quantity)}`).join('\n');
    const message = `
🌟 <b>YANGI BUYURTMA</b> 🌟

👤 <b>Mijoz:</b> ${formData.name}
📱 <b>Telefon:</b> ${formData.phone}
📍 <b>Manzil:</b> ${formData.address}

🛒 <b>Buyurtma tarkibi:</b>
${orderDetails}

💰 <b>Umumiy summa:</b> ${formatPrice(totalAmount)}
`;

    await sendTelegramMessage(message);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      clearCart();
      navigate('/shop');
    }, 4000);
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Buyurtma Qabul Qılındı</h1>
          <p className="text-foreground/60 mb-10 max-w-md mx-auto">
            Xaridingiz uchun rahmat! Tez orada menejerlarimiz siz bilan bog'lanishadi.
          </p>
          <button 
            onClick={() => { clearCart(); navigate('/shop'); }}
            className="bg-brand-gold text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 mr-2" /> Xaridni Davom Ettirish
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-32 h-32 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-16 h-16 text-foreground/20" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-foreground/60 mb-10 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our luxury collection and find something beautiful.
          </p>
          <Link 
            to="/shop" 
            className="bg-brand-gold text-white px-10 py-4 rounded-full font-bold hover:bg-brand-gold-muted transition-all inline-flex items-center gap-2"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-display font-bold mb-12">Shopping Cart ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 group"
              >
                <div className="w-40 h-40 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">{item.category}</span>
                  <h3 className="text-xl font-bold mb-4">{item.name}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center gap-3 bg-foreground/5 p-2 rounded-full">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm text-foreground/40 font-medium">x {formatPrice(item.price)}</span>
                  </div>
                </div>

                <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-4 min-w-[120px]">
                  <span className="text-xl font-display font-bold">{formatPrice(item.price * item.quantity)}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary or Checkout Form */}
        <aside className="lg:col-span-1">
          <div className="glass p-10 rounded-[3rem] sticky top-32 border border-white/10 shadow-2xl">
            {!isCheckout ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl font-display font-bold mb-8">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-foreground/60 text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/60 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-500 font-bold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="pt-4 border-t border-foreground/5 flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span className="text-brand-gold">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setIsCheckout(true)}
                    className="w-full bg-brand-gold text-black py-4 rounded-2xl font-bold hover:bg-brand-gold/90 transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 group"
                  >
                    Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center justify-center gap-4 text-foreground/20">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Secure Payment</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-10 pt-8 border-t border-foreground/5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-3 block ml-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="LUXURY2026" 
                      className="bg-foreground/5 border border-transparent focus:border-brand-gold rounded-xl px-4 py-2 text-sm outline-none flex-grow transition-all"
                    />
                    <button className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-xl text-xs font-bold transition-all">Apply</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setIsCheckout(false)}
                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-2xl font-display font-bold">Checkout</h3>
                </div>

                <form onSubmit={handleCheckout} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-2">To'liq ismingiz</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Masalan: Alisher Navoiy" 
                      className="bg-foreground/5 border border-transparent focus:border-brand-gold rounded-xl px-4 py-3 text-sm outline-none w-full transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-2">Telefon raqamingiz</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+998 90 123 45 67" 
                      className="bg-foreground/5 border border-transparent focus:border-brand-gold rounded-xl px-4 py-3 text-sm outline-none w-full transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-2">Yetkazib berish manzili</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Toshkent shahar, Yunusobod tumani..." 
                      rows={3}
                      className="bg-foreground/5 border border-transparent focus:border-brand-gold rounded-xl px-4 py-3 text-sm outline-none w-full transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-6 border-t border-foreground/5">
                    <div className="flex justify-between items-center text-xl font-bold mb-6">
                      <span>Total</span>
                      <span className="text-brand-gold">{formatPrice(totalAmount)}</span>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-gold text-black py-4 rounded-2xl font-bold hover:bg-brand-gold/90 transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Yuborilmoqda...' : 'Buyurtmani Tasdiqlash'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
