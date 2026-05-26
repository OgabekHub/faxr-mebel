import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Ruler, Sparkles, Send, ShieldCheck, CheckCircle2, MessageSquareCode } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { createPortal } from 'react-dom';


interface BespokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export const BespokeModal: React.FC<BespokeModalProps> = ({ isOpen, onClose, product }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  
  // Custom states
  const [length, setLength] = useState(250);
  const [width, setWidth] = useState(100);
  const [wood, setWood] = useState('walnut');
  const [fabric, setFabric] = useState('velvet');
  const [delivery, setDelivery] = useState('luxe');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculate customized premium markup price based on volume
  const volumeMultiplier = (length * width) / 25000;
  const rawPrice = product.price * (volumeMultiplier < 1 ? 1 : volumeMultiplier);
  const woodPremium = wood === 'walnut' ? 1.15 : wood === 'oak' ? 1.1 : 1.0;
  const fabricPremium = fabric === 'leather' ? 1.25 : 1.0;
  const deliveryPremium = delivery === 'luxe' ? 0 : 0; // standard or free VIP
  const finalPrice = Math.round(rawPrice * woodPremium * fabricPremium);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2500);
  };

  const getBespokeJSON = () => {
    return JSON.stringify({
      orderId: `BESPOKE-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: t('product.' + product.id + '.name'),
      dimensions: `${length}cm x ${width}cm`,
      materialSelection: {
        woodType: wood.toUpperCase(),
        fabricType: fabric.toUpperCase()
      },
      deliveryTier: delivery === 'luxe' ? 'LUXE CONCIERGE' : 'STANDARD',
      customerContact: {
        name: userName,
        phone: userPhone
      },
      totalBespokePrice: formatPrice(finalPrice)
    }, null, 2);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          {/* Main Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-4xl bg-background border border-foreground/10 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center border border-foreground/10 text-foreground transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
              
              {/* Left Column: Live Bespoke Product Overview */}
              <div className="md:col-span-5 bg-foreground/5 border-r border-foreground/10 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Concierge Desk</span>
                  <h3 className="text-2xl font-editorial-title font-bold mt-2">{t('product.' + product.id + '.name')}</h3>
                  <p className="text-[9px] text-foreground/45 uppercase tracking-hero font-extrabold mt-1">Bespoke Manufacturing</p>
                  
                  <div className="relative mt-8 group">
                    <div className="absolute inset-0 bg-brand-gold/5 rounded-3xl blur-2xl group-hover:scale-105 transition-transform" />
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-contain rounded-2xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] filter brightness-95" 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-foreground/5">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                    <span>O'lcham:</span>
                    <span className="text-foreground">{length}cm x {width}cm</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-foreground/45 tracking-wider">
                    <span>Daraxt / Matosi:</span>
                    <span className="text-brand-gold">{wood.toUpperCase()} / {fabric.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-foreground/10 pt-4">
                    <span className="text-[10px] uppercase font-black tracking-widest text-foreground">{t('shop.modal.totalPrice')}:</span>
                    <span className="text-2xl italic font-editorial-title gold-foil-text font-bold">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Multi-Step Interactive Form */}
              <div className="md:col-span-7 p-8 flex flex-col justify-between">
                
                {/* Steps Header indicator */}
                {!submitted && (
                  <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                      <div 
                        key={s} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          s === step ? 'w-8 bg-brand-gold' : s < step ? 'w-3 bg-foreground/30' : 'w-3 bg-foreground/10'
                        }`} 
                      />
                    ))}
                    <span className="text-[9px] uppercase font-black text-foreground/45 tracking-widest ml-auto">
                      Step {step} of 3
                    </span>
                  </div>
                )}

                {/* Submitting Screen */}
                {isSubmitting && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-12 h-12 border-2 border-brand-gold/30 border-t-brand-gold rounded-full mb-6"
                    />
                    <MessageSquareCode className="w-8 h-8 text-brand-gold animate-bounce absolute" />
                    <h3 className="text-xl font-editorial-title font-bold">Xavfsiz hisob-faktura shakllanmoqda...</h3>
                    <p className="text-[10px] text-foreground/45 uppercase tracking-hero mt-2">Menejerlar bilan bog'lanish va Telegram xabarnomasi yuborilmoqda</p>
                  </div>
                )}

                {/* Completed Screen */}
                {submitted && !isSubmitting && (
                  <div className="flex-1 flex flex-col justify-between py-4">
                    <div className="text-center space-y-4 py-8">
                      <div className="w-16 h-16 bg-brand-gold text-black rounded-full flex items-center justify-center mx-auto shadow-xl shadow-brand-gold/15">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-editorial-title font-bold text-foreground">VIP Buyurtma Qabul Qilindi!</h3>
                      <p className="text-xs text-foreground/50 max-w-sm mx-auto leading-relaxed">
                        Tashakkur! Sizning maxsus buyurtmangiz va mebelingiz o'lchamlari menejerlarimiz hamda ustaxona guruhiga **Telegram bot** orqali muvaffaqiyatli yuborildi. Biz 2 soat ichida siz bilan bog'lanamiz.
                      </p>
                    </div>

                    {/* Simulated Telegram Packet */}
                    <div className="bg-black/95 text-emerald-400 p-6 rounded-2xl font-mono text-[10px] overflow-x-auto shadow-inner border border-white/5 relative group">
                      <span className="absolute top-4 right-4 text-[8px] bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full uppercase font-bold tracking-widest flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        Telegram Sent
                      </span>
                      <h4 className="text-white/60 mb-2 border-b border-white/10 pb-1.5 uppercase font-bold">Encrypted JSON Dispatch</h4>
                      <pre className="leading-relaxed whitespace-pre-wrap">{getBespokeJSON()}</pre>
                    </div>

                    <button 
                      onClick={onClose}
                      className="w-full py-4 bg-brand-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted transition-all duration-300 mt-6 shadow-xl shadow-brand-gold/15"
                    >
                      Bosh sahifaga qaytish
                    </button>
                  </div>
                )}

                {/* Multi-step Form Views */}
                {!submitted && !isSubmitting && (
                  <div className="flex-1 flex flex-col justify-between">
                    
                    {/* Step 1: Dimensions */}
                    {step === 1 && (
                      <div className="space-y-8 py-4">
                        <div>
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            <Ruler className="w-5 h-5 text-brand-gold" />
                            Mebel O'lchamlarini Kiriting
                          </h4>
                          <p className="text-[10px] text-foreground/50 mt-1.5 font-light">Xonangizga mos keladigan uzunlik va kengliklarni belgilang. Biz mebelni uyingiz sharoitidan kelib chiqib aniq tayyorlaymiz.</p>
                        </div>

                        {/* Length Slider */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
                            <span>Mebel Uzunligi (cm)</span>
                            <span className="text-brand-gold text-xs">{length} cm</span>
                          </div>
                          <input 
                            type="range" 
                            min="150" 
                            max="450" 
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full accent-brand-gold bg-foreground/5 h-1 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Width Slider */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-foreground/50 tracking-wider">
                            <span>Mebel Kengligi / Chuqurligi (cm)</span>
                            <span className="text-brand-gold text-xs">{width} cm</span>
                          </div>
                          <input 
                            type="range" 
                            min="60" 
                            max="200" 
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value))}
                            className="w-full accent-brand-gold bg-foreground/5 h-1 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Materials Selection */}
                    {step === 2 && (
                      <div className="space-y-8 py-4">
                        <div>
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-gold" />
                            Premium Materiallar Tanlovi
                          </h4>
                          <p className="text-[10px] text-foreground/50 mt-1.5 font-light">Mebelingizning yog'och ramkasi va qoplama matosi turini tanlang. Oliy navli materiallarimiz narxda kichik farq qilishi mumkin.</p>
                        </div>

                        {/* Wood selection */}
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black tracking-widest text-foreground/55 block">Premium Daraxt Turi</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'walnut', name: "Walnut (Yong'oq)", markup: "+15%" },
                              { id: 'oak', name: "Oak (Eman)", markup: "+10%" },
                              { id: 'birch', name: "Birch (Qayrag'och)", markup: "Standard" }
                            ].map((w) => (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() => setWood(w.id)}
                                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                                  wood === w.id 
                                    ? 'border-brand-gold bg-brand-gold/5 shadow-md' 
                                    : 'border-foreground/10 hover:border-foreground/20 bg-foreground/5'
                                }`}
                              >
                                <span className="text-[10px] font-bold text-foreground leading-tight">{w.name}</span>
                                <span className="text-[8px] uppercase tracking-widest font-black text-brand-gold mt-2">{w.markup}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Fabric selection */}
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase font-black tracking-widest text-foreground/55 block">Hashamatli Qoplama Matosi</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'velvet', name: "Italiya Baxmali (Velvet)", desc: "Suvga chidamli yumshoq mato" },
                              { id: 'leather', name: "Toza Charm (Leather) (+25%)", desc: "Premium darajadagi tabiiy charm" }
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => setFabric(f.id)}
                                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                                  fabric === f.id 
                                    ? 'border-brand-gold bg-brand-gold/5 shadow-md' 
                                    : 'border-foreground/10 hover:border-foreground/20 bg-foreground/5'
                                }`}
                              >
                                <span className="text-[10px] font-bold text-foreground leading-tight">{f.name}</span>
                                <span className="text-[8px] text-foreground/45 font-medium italic mt-2 leading-snug">{f.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Contact & Delivery */}
                    {step === 3 && (
                      <form onSubmit={handleSubmit} className="space-y-6 py-4">
                        <div>
                          <h4 className="text-lg font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-brand-gold" />
                            Bog'lanish va Yetkazish Shartlari
                          </h4>
                          <p className="text-[10px] text-foreground/50 mt-1.5 font-light">Biz Toshkent shahrida bepul va o'ta ehtiyotkorona Luxe transport xizmati (o'rnatish bilan birga) hamda standart formatlarni taklif etamiz.</p>
                        </div>

                        {/* Service tier selector */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'luxe', title: "Luxe Concierge Delivery", desc: "Bepul yuklash, yetkazish va xonangizga o'rnatib berish." },
                            { id: 'standard', title: "Standard Delivery", desc: "Klassik tashuv va eshikkacha yetkazib berish xizmati." }
                          ].map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setDelivery(d.id)}
                              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                                delivery === d.id 
                                  ? 'border-brand-gold bg-brand-gold/5 shadow-md' 
                                  : 'border-foreground/10 hover:border-foreground/20 bg-foreground/5'
                                }`}
                            >
                              <span className="text-[10px] font-bold text-foreground leading-tight">{d.title}</span>
                              <span className="text-[8px] text-foreground/45 mt-2 font-medium leading-relaxed">{d.desc}</span>
                            </button>
                          ))}
                        </div>

                        {/* Name and Phone Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black tracking-widest text-foreground/55">{t('contact.form.label.name')}</label>
                            <input 
                              type="text" 
                              required
                              placeholder={t('contact.form.placeholder.name')} 
                              className="w-full bg-foreground/5 border border-foreground/10 focus:border-brand-gold rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors text-foreground"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] uppercase font-black tracking-widest text-foreground/55">{t('contact.form.label.phone')}</label>
                            <input 
                              type="tel" 
                              required
                              placeholder={t('contact.form.placeholder.phone')} 
                              className="w-full bg-foreground/5 border border-foreground/10 focus:border-brand-gold rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors text-foreground"
                              value={userPhone}
                              onChange={(e) => setUserPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 border-t border-foreground/10 pt-6 mt-6">
                      {step > 1 && (
                        <button 
                          onClick={handlePrev}
                          className="px-6 py-4 bg-foreground/5 border border-foreground/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-foreground/10 flex items-center gap-2 text-foreground transition-all duration-300"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Orqaga
                        </button>
                      )}
                      
                      {step < 3 ? (
                        <button 
                          onClick={handleNext}
                          className="flex-1 py-4 bg-brand-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-brand-gold/15"
                        >
                          Davom etish
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={handleSubmit}
                          disabled={!userName || !userPhone}
                          className="flex-1 py-4 bg-brand-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-gold/15"
                        >
                          Tugatish va Buyurtmani Yuborish
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                  </div>
                )}

              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
