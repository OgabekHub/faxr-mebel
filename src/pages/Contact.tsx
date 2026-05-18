import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sendTelegramMessage } from '../services/telegram';
import { Mail, Phone, MapPin, Send, CheckCircle2, Calendar, Clock, ChevronDown, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const availableTimes = ['09:00', '11:00', '14:00', '16:00', '18:00'];

const faqs = [
  { q: "Mebellarni o'lchamlariga qarab buyurtma qilsa bo'ladimi?", a: "Ha, albatta! Biz mijozlarimizning xonadonlari o'lchamlari hamda maxsus dizayn talablariga qarab mebellarni noldan loyihalashtirib beramiz." },
  { q: "Yetkazib berish va o'rnatish bepulmi?", a: "Toshkent shahar ichida barcha turdagi yirik mebellarni yetkazib berish va yig'ib-o'rnatib berish xizmati mutlaqo bepul (Luxe Service) hisoblanadi." },
  { q: "Mebellarga qancha muddat kafolat berasiz?", a: "Biz barcha premium yog'och va baxmal/charm qoplamali mebellarimiz uchun 3 yillik to'liq kafolat va umrbod servis xizmatini kafolatlaymiz." },
  { q: "Buyurtmalar qancha muddatda tayyor bo'ladi?", a: "Standart mebellarimiz 7 ish kunidan 15 ish kunigacha bo'lgan muddatda, murakkab va maxsus buyurtmalar esa 20-25 ish kunida tayyorlanadi." }
];

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Tab selector between Message / Showroom Appointment booking
  const [activeFormTab, setActiveFormTab] = useState<'message' | 'appointment'>('message');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
    date: '',
    time: ''
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let message = '';
    if (activeFormTab === 'message') {
      message = `
📩 <b>YANGI MUROJAAT</b> 📩

👤 <b>Ism:</b> ${formData.name}
📱 <b>Telefon:</b> ${formData.phone}
💬 <b>Xabar:</b> ${formData.message}
📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}
`;
    } else {
      message = `
🗓️ <b>YANGI SHOWROOM TASHRIFI</b> 🗓️

👤 <b>Mijoz:</b> ${formData.name}
📱 <b>Telefon:</b> ${formData.phone}
📅 <b>Tashrif kuni:</b> ${formData.date}
⏰ <b>Tashrif vaqti:</b> ${formData.time}
📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}
`;
    }

    const result = await sendTelegramMessage(message);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      setFormData({ name: '', phone: '', message: '', date: '', time: '' });
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } else {
      alert("Xabar yuborishda xatolik. Iltimos qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Get in Touch</span>
        <h1 className="text-4xl md:text-6xl font-editorial-title mt-2 mb-4">
          Biz bilan <span className="font-bold italic gold-foil-text">Bog'lanish.</span>
        </h1>
        <p className="text-xs text-foreground/50 max-w-xl mx-auto leading-relaxed font-light italic">
          Master-dizaynerlarimiz bilan maslahatlashmoqchimisiz yoki showroomimizga kelmoqchimisiz? Biz sizga hashamatli yordam ko'rsatishga tayyormiz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Phone */}
          <div className="bento-card glow-tracer p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/15">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold mb-1.5 text-foreground">Sotuv & Maslahat Bo'limi</h3>
              <p className="text-[11px] text-foreground/45 mb-2 leading-relaxed">Har qanday savollar bo'yicha biz bilan bog'laning:</p>
              <a href="tel:+998901234567" className="text-brand-gold hover:underline text-sm font-bold tracking-wider">+998 90 123 45 67</a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bento-card glow-tracer p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/15">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold mb-1.5 text-foreground">Elektron Pochta</h3>
              <p className="text-[11px] text-foreground/45 mb-2 leading-relaxed">Hamkorlik va rasmiy takliflar uchun:</p>
              <a href="mailto:info@faxrmebel.uz" className="text-brand-gold hover:underline text-sm font-bold">info@faxrmebel.uz</a>
            </div>
          </div>

          {/* Card 3: Address */}
          <div className="bento-card glow-tracer p-8 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 border border-brand-gold/15">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold mb-1.5 text-foreground">Markaziy Showroom</h3>
              <p className="text-[11px] text-foreground/45 mb-1.5 leading-relaxed">Bizning ustaxona va ko'rgazmalar zalimiz:</p>
              <p className="text-xs text-foreground/75 font-semibold">Toshkent shahar, Yunusobod tumani, 19-mavze, 12-uy.</p>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="bento-card p-6 border-l-4 border-l-brand-gold">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-foreground/40 mb-3 block">Ijtimoiy Tarmoqlar</h3>
            <div className="flex flex-wrap gap-2.5">
              {['Instagram', 'Telegram', 'Facebook'].map((social) => (
                <a key={social} href="#" className="px-5 py-2.5 rounded-xl bg-foreground/5 hover:bg-brand-gold hover:text-black transition-colors font-bold text-xs uppercase tracking-wider">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form selector message/appointment */}
        <div className="lg:col-span-7 bg-white dark:bg-white/5 bento-card p-8 md:p-10 border border-foreground/5 shadow-xl">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-editorial-title font-bold mb-2">Murojaatingiz Yuborildi!</h3>
              <p className="text-xs text-foreground/60 italic max-w-sm mx-auto">
                Rahmat! So'rovingiz menejerlarimizga yetkazildi. Tez orada siz bilan bog'lanamiz.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form Tab selection */}
              <div className="flex border-b border-foreground/5 pb-4 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('message')}
                  className={cn(
                    "text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all",
                    activeFormTab === 'message' ? "border-brand-gold text-brand-gold font-bold" : "border-transparent text-foreground/40"
                  )}
                >
                  Xabar Qoldirish
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('appointment')}
                  className={cn(
                    "text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all",
                    activeFormTab === 'appointment' ? "border-brand-gold text-brand-gold font-bold" : "border-transparent text-foreground/40"
                  )}
                >
                  Tashrif Band Qilish
                </button>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/45 mb-2 block ml-2">Sizning ismingiz</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masalan: Alisher Navoiy" 
                  className="bg-foreground/5 border border-foreground/15 focus:border-brand-gold rounded-xl px-4 py-3.5 text-xs outline-none w-full transition-all text-foreground"
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-foreground/45 mb-2 block ml-2">Telefon raqamingiz</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+998 90 123 45 67" 
                  className="bg-foreground/5 border border-foreground/15 focus:border-brand-gold rounded-xl px-4 py-3.5 text-xs outline-none w-full transition-all text-foreground"
                />
              </div>

              {activeFormTab === 'message' ? (
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-foreground/45 mb-2 block ml-2">Xabaringiz</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Xabaringizni bu yerga batafsil yozing..." 
                    rows={4}
                    className="bg-foreground/5 border border-foreground/15 focus:border-brand-gold rounded-xl px-4 py-3.5 text-xs outline-none w-full transition-all text-foreground resize-none"
                  ></textarea>
                </div>
              ) : (
                /* Appointment scheduling elements */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/45 mb-2 block ml-2">Kuni tanlang</label>
                    <div className="relative">
                      <input 
                        required
                        type="date" 
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="bg-foreground/5 border border-foreground/15 focus:border-brand-gold rounded-xl px-4 py-3.5 text-xs outline-none w-full transition-all text-foreground font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-foreground/45 mb-2 block ml-2">Vaqtni tanlang</label>
                    <select 
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="bg-foreground/5 border border-foreground/15 focus:border-brand-gold rounded-xl px-4 py-3.5 text-xs outline-none w-full transition-all text-foreground font-bold"
                    >
                      <option value="">Vaqtni tanlang</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-gold text-black py-4 rounded-xl font-extrabold text-xs uppercase tracking-hero hover:scale-102 transition-transform shadow-xl shadow-brand-gold/15 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Luxury FAQs Accordion Section */}
      <section className="py-12 border-t border-foreground/5">
         <div className="text-center mb-12">
            <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Savol & Javoblar</span>
            <h2 className="text-3xl md:text-5xl font-editorial-title mt-2">Ko'p Beriladigan <span className="font-bold italic gold-foil-text">Savollar.</span></h2>
         </div>

         <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bento-card border border-foreground/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm font-bold text-foreground">{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-brand-gold transition-transform duration-300", openFaqIndex === idx ? "rotate-180" : "")} />
                </button>

                <AnimatePresence initial={false}>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-xs text-foreground/50 leading-relaxed font-light italic border-t border-foreground/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
         </div>
      </section>

      {/* Decorative Brand Badge */}
      <div className="mt-16 flex justify-center text-foreground/10 gap-3">
         <Award className="w-6 h-6" />
      </div>
    </div>
  );
};
