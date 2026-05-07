import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sendTelegramMessage } from '../services/telegram';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `
📩 <b>YANGI MUROJAAT</b> 📩

👤 <b>Ism:</b> ${formData.name}
📱 <b>Telefon:</b> ${formData.phone}
💬 <b>Xabar:</b> ${formData.message}
`;

    await sendTelegramMessage(message);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', phone: '', message: '' });

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-light italic tracking-tight mb-4">
          Biz bilan <span className="not-italic font-bold">bog'lanish.</span>
        </h1>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Savollaringiz bormi? Yoki o'z mebelingizni buyurtma qilmoqchimisiz? Bizga xabar qoldiring, tez orada aloqaga chiqamiz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Telefon</h3>
              <p className="text-foreground/60 mb-1">Buyurtma va savollar uchun:</p>
              <a href="tel:+998901234567" className="text-brand-gold hover:underline font-medium">+998 90 123 45 67</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Elektron pochta</h3>
              <p className="text-foreground/60 mb-1">Hamkorlik va takliflar uchun:</p>
              <a href="mailto:info@faxrmebel.uz" className="text-brand-gold hover:underline font-medium">info@faxrmebel.uz</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Manzil</h3>
              <p className="text-foreground/60">Toshkent shahar, Yunusobod tumani, 19-mavze, 12-uy.</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-8 border-t border-foreground/5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-4">Ijtimoiy tarmoqlar</h3>
            <div className="flex gap-4">
              {['Instagram', 'Telegram', 'Facebook'].map((social) => (
                <a key={social} href="#" className="px-5 py-2 rounded-full bg-foreground/5 hover:bg-brand-gold hover:text-black transition-colors font-medium text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 md:p-10 border border-foreground/5 shadow-sm">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Xabar yetkazildi!</h3>
              <p className="text-foreground/60">Tez orada menejerlarimiz siz bilan bog'lanishadi.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold mb-8">Xabar yuborish</h3>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-2">Sizning ismingiz</label>
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2 block ml-2">Xabaringiz</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Xabaringizni bu yerga yozing..." 
                  rows={4}
                  className="bg-foreground/5 border border-transparent focus:border-brand-gold rounded-xl px-4 py-3 text-sm outline-none w-full transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-gold text-black py-4 rounded-2xl font-bold hover:bg-brand-gold/90 transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
