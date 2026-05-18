import React from 'react';
import { motion } from 'motion/react';
import { Award, Compass, Heart, Users, Sparkles } from 'lucide-react';

const historyTimeline = [
  { year: '1996', title: 'Ilk Qadam', text: 'Usta ota-bobolarimiz tomonidan kichik duradgorlik ustaxonasi tashkil qilindi va qo\'lda sayqallangan yog\'och o\'ymakorligi san\'ati yo\'lga qo\'yildi.' },
  { year: '2008', title: 'Kengayish', text: 'Mebel ishlab chiqarish liniyalari va mato qoplash xizmatlari joriy etildi. Mahsulotlarimiz milliy ko\'rgazmalarda e\'tirofga sazovor bo\'ldi.' },
  { year: '2018', title: 'Minimalizm Fuzioni', text: 'O\'zbekiston bozoriga zamonaviy Yevropa arxitekturasi va Italiya hashamatli dizaynlarini qo\'shgan holda yangi minimalizm uslubi olib kirildi.' },
  { year: '2026', title: 'Global Faxr', 'text': 'Raqamli premium platforma, telegram integratsiyasi va ekologik toza oliy navli yog\'ochlar bilan jahon darajasidagi hashamatli brendga aylandik.' }
];

const artisans = [
  { name: 'Usta Rustamali', role: 'Bosh Mebelsoz / Master Artisan', bio: '30 yillik tajribaga ega o\'ymakor usta. Har bir yong\'oq va eman yog\'ochini tanlash, kesish va qo\'lda sayqallash jarayoniga shaxsan mas\'ul.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
  { name: 'Kamola Sobirova', role: 'Etakchi Interyer Dizayner', bio: 'Italiya dizayn akademiyasi bitiruvchisi. Faxr Mebel kolleksiyalarining ranglar palitrasi, estetika uyg\'unligi va minimalist chiziqlarini yaratuvchisi.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300' },
  { name: 'Usta Doniyor', role: 'Tekstil & Qoplama Mutaxassisi', bio: 'Baxmal, ipak va tabiiy charm bilan ishlash ustasi. Har bir mebel tikilish choklarining mukammalligi va mustahkamligini ta\'minlaydi.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300' }
];

export const About = () => {
  return (
    <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto min-h-screen space-y-24">
      {/* Title Header */}
      <section className="text-center">
        <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Our Heritage</span>
        <h1 className="text-4xl md:text-6xl font-editorial-title mt-2 mb-4">
          Qadriyatlar va <span className="font-bold italic gold-foil-text">Hunarmandchilik.</span>
        </h1>
        <p className="text-xs text-foreground/50 max-w-xl mx-auto leading-relaxed font-light italic">
          Faxr Mebel - shunchaki brend emas, u avloddan-avlodga o'tib kelayotgan yog'och o'ymakorligi san'ati hamda zamonaviy Yevropa minimalizmi uyg'unligidir.
        </p>
      </section>

      {/* Hero Brand Credentials */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-brand-gold uppercase tracking-widest text-[9px] font-black block">Visual Story</span>
          <h2 className="text-3xl font-editorial-title">Mukammallikka intilish — <span className="font-bold italic">bizning falsafamiz.</span></h2>
          <p className="text-xs text-foreground/60 leading-relaxed font-light">
            Biz har bir stul, divan yoki stolni san'at asari deb bilamiz. Yog'ochni tanlashdan boshlab, uning yakuniy jilolanishigacha bo'lgan barcha jarayonlar master-ustalarimizning qo'l mehnati orqali amalga oshiriladi.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex gap-3">
              <Award className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground">30 yillik An'ana</h4>
                <p className="text-[10px] text-foreground/45 mt-1">Usta ota-bobolardan meros san'at</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Compass className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground">Premium Dizayn</h4>
                <p className="text-[10px] text-foreground/45 mt-1">Zamonaviy Yevropa minimalizmi</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] group shadow-2xl">
          <img src="/images/dining_table.png" alt="Showroom" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 text-center">
            <span className="text-[9px] uppercase tracking-hero text-white/90 border border-white/20 px-5 py-2.5 rounded-full font-black">Faxr Mebel Zamonaviy Ustaxonasi</span>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-12 border-t border-b border-foreground/5">
        <div className="text-center mb-16">
          <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">History timeline</span>
          <h2 className="text-2xl md:text-4xl font-editorial-title mt-2">Bizning Rivojlanish <span className="font-bold italic">Yo'limiz.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {historyTimeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="bento-card glow-tracer p-8 flex flex-col justify-between h-[250px] relative border border-foreground/5"
            >
              <div>
                <span className="text-3xl font-editorial-title font-bold text-brand-gold">{item.year}</span>
                <h3 className="text-sm font-bold text-foreground mt-3 mb-2">{item.title}</h3>
                <p className="text-[10px] text-foreground/50 leading-relaxed italic">{item.text}</p>
              </div>
              <div className="absolute bottom-6 right-6 text-foreground/5 font-black text-6xl select-none pointer-events-none">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Meet the Artisans */}
      <section className="py-12">
        <div className="text-center mb-16">
          <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Meet the team</span>
          <h2 className="text-3xl md:text-5xl font-editorial-title mt-2">Mohir Ustalarimiz.</h2>
          <p className="text-xs text-foreground/50 mt-3 max-w-sm mx-auto leading-relaxed italic">
            Bizning mebellarning chidamliligi va go'zalligi ortida turgan insonlar bilan tanishing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((artisan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="bento-card glow-tracer p-6 text-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border border-brand-gold/20 bg-foreground/5">
                <img src={artisan.avatar} alt={artisan.name} className="w-full h-full object-cover" />
              </div>
              
              <h3 className="text-base font-bold text-foreground mb-1">{artisan.name}</h3>
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold block mb-4">{artisan.role}</span>
              <p className="text-[11px] text-foreground/50 leading-relaxed font-light italic">{artisan.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand values card */}
      <section className="bento-card p-10 md:p-16 bg-brand-gold text-black text-center relative overflow-hidden group shadow-xl shadow-brand-gold/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200')] bg-cover bg-center opacity-10 group-hover:scale-102 transition-transform duration-1000" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <Sparkles className="w-8 h-8 mx-auto text-black animate-pulse-slow" />
          <h3 className="text-3xl md:text-5xl font-editorial-title font-bold leading-tight">Biz uylarga shunchaki mebel emas, <br/>faxr olib kiramiz.</h3>
          <p className="text-[11px] leading-relaxed max-w-md mx-auto font-semibold opacity-75">
            Har bir mebel asarimiz asrlar davomida mustahkam saqlanishi va uyingizga kelgan har bir mehmonda hayrat uyg'otishi bizning oliy mukofotimizdir.
          </p>
        </div>
      </section>
    </div>
  );
};
