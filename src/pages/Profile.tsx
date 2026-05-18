import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogOut, Heart, Shield, ShoppingBag, Send, Award, Clock, CheckCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/utils';

// Premium mock wishlist and order history
const mockWishlist = [
  { id: '1', name: 'Royal Velvet Sofa', price: 12000000, image: '/images/sofa.png', category: 'Sofa' },
  { id: '3', name: 'Minimalist Bed Frame', price: 15000000, image: '/images/bed.png', category: 'Bedroom' }
];

const mockActiveOrder = {
  id: 'ORD-2026-904',
  date: '2026-05-15',
  total: 12650000,
  item: 'Royal Velvet Sofa',
  wood: 'Walnut (Yong\'oq)',
  fabric: 'Italiya Baxmali',
  packaging: 'Yog\'och quti',
  steps: [
    { label: 'Buyurtma qabul qilindi', desc: 'Sizning to\'lovingiz tasdiqlandi va buyurtma ro\'yxatga olindi.', status: 'completed' },
    { label: 'Yog\'och saralanmoqda', desc: 'Ustaxonamizdan oliy navli Yong\'oq yog\'ochi ajratib olindi.', status: 'completed' },
    { label: 'Usta qo\'lida sayqallanmoqda', desc: 'Bosh duradgor Rustamali mebelni qo\'lda tayyorlamoqda.', status: 'active' },
    { label: 'Sifat nazorati', desc: 'Mebel choklari va yuklama chidamliligi tekshiriladi.', status: 'pending' },
    { label: 'Yetkazib berish va o\'rnatish', desc: 'Bepul yetkazib berilib, xonadoningizga yig\'ib beriladi.', status: 'pending' }
  ]
};

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        // Fallback for demo mode so the portal is viewable even without a Firebase connection
        setUser({
          displayName: 'Alisher Navoiy',
          email: 'alisher@prestige.com',
          photoURL: 'https://i.pravatar.cc/150?u=9',
          phoneNumber: '+998 90 123 45 67'
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="pt-44 pb-20 text-center h-screen flex flex-col items-center justify-center">
        <Clock className="w-12 h-12 text-brand-gold animate-spin mb-4" />
        <span className="text-xs uppercase tracking-hero text-foreground/40 font-bold">Cabinet yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Upper User Profile Bar */}
      <div className="bento-card p-8 md:p-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-foreground/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold bg-foreground/5 shadow-lg">
            <img src={user?.photoURL || 'https://i.pravatar.cc/150?u=9'} alt="User Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left space-y-1.5">
            <h1 className="text-2xl md:text-3xl font-editorial-title font-bold text-foreground">{user?.displayName || 'Prestige Client'}</h1>
            <p className="text-xs text-foreground/50 leading-relaxed font-light italic">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
              <span className="px-3.5 py-1 bg-brand-gold/10 border border-brand-gold/10 rounded-full text-[9px] font-black uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                <Award className="w-3 h-3" /> Gold Club Member
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="px-6 py-3.5 bg-foreground/5 hover:bg-red-500 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-hero transition-all flex items-center gap-2 border border-foreground/5 hover:border-red-500 relative z-10"
        >
          <LogOut className="w-4 h-4" /> Tizimdan Chiqish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Sidebar Panel */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bento-card p-6 border border-foreground/5">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  activeTab === 'orders' 
                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/15' 
                    : 'hover:bg-foreground/5 text-foreground/60'
                }`}
              >
                <ShoppingBag className="w-4 h-4" /> Active Buyurtmalar
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  activeTab === 'wishlist' 
                    ? 'bg-brand-gold text-black shadow-lg shadow-brand-gold/15' 
                    : 'hover:bg-foreground/5 text-foreground/60'
                }`}
              >
                <Heart className="w-4 h-4" /> Sevimlilar (Wishlist)
              </button>
            </nav>
          </div>

          <div className="bento-card p-6 bg-brand-gold text-black">
            <h3 className="text-xs font-black uppercase tracking-wider mb-2">Prestige Xizmat</h3>
            <p className="text-[10px] leading-relaxed mb-4 font-semibold opacity-75">
              Sizga shaxsiy dizayner biriktirilgan. Savollaringiz bormi? Buyurtmalarni o'zgartirmoqchimisiz?
            </p>
            <a 
              href="https://t.me/faxrmebel" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3 bg-black text-white text-center rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" /> Telegram orqali yordam
            </a>
          </div>
        </aside>

        {/* Content Viewer Grid */}
        <main className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'orders' ? (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Active Order Card */}
                <div className="bento-card p-8 border border-foreground/5 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-foreground/5 mb-8 gap-4">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">Aktiv Buyurtma</span>
                      <h3 className="text-lg font-bold text-foreground mt-1">{mockActiveOrder.item}</h3>
                      <p className="text-[10px] text-foreground/45 mt-1 font-bold">KOD: {mockActiveOrder.id} | Sana: {mockActiveOrder.date}</p>
                    </div>
                    
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[9px] uppercase font-black tracking-widest text-foreground/40 block">To'langan Qiymat</span>
                      <span className="price-tag text-2xl font-bold block">{formatPrice(mockActiveOrder.total)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Visual details column */}
                    <div className="md:col-span-4 bg-foreground/5 p-6 rounded-2xl border border-foreground/5 space-y-3.5 h-fit">
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold block">Tanlangan parametrlar</span>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-foreground/45">Yog'och turi:</span>
                          <span className="font-bold">{mockActiveOrder.wood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/45">Qoplama mato:</span>
                          <span className="font-bold">{mockActiveOrder.fabric}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/45">Qadoqlash:</span>
                          <span className="font-bold">{mockActiveOrder.packaging}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/45">Yetkazish:</span>
                          <span className="font-bold text-green-500">Kuryer (Luxe)</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline tracking tracker */}
                    <div className="md:col-span-8 space-y-6">
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold block mb-2">Buyurtma Holati Timeline</span>
                      
                      <div className="relative pl-6 border-l border-foreground/10 space-y-8">
                        {mockActiveOrder.steps.map((step, idx) => (
                          <div key={idx} className="relative">
                            
                            {/* Visual state markers */}
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
                              <p className="text-[10px] text-foreground/50 leading-relaxed font-light italic">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
                {mockWishlist.map((item) => (
                  <div key={item.id} className="bento-card glow-tracer p-5 group flex flex-col justify-between">
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-5">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4 glass px-3.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                        {item.category}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{item.name}</h3>
                        <span className="price-tag text-lg font-bold block mt-1">{formatPrice(item.price)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/shop')}
                      className="w-full py-3 bg-foreground/5 hover:bg-brand-gold hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest border border-foreground/5 transition-all"
                    >
                      Katalogda ko'rish
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};
