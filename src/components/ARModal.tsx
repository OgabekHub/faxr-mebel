import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Sparkles, QrCode, Smartphone, Check } from 'lucide-react';
import { createPortal } from 'react-dom';


interface ARModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
}

export const ARModal: React.FC<ARModalProps> = ({ isOpen, onClose, productName, productImage }) => {
  const { t } = useTranslation();
  const [scanning, setScanning] = useState(true);
  const [dots, setDots] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      // Generate some random positions for AR tracking dots
      const newDots = Array.from({ length: 18 }, () => Math.floor(Math.random() * 100));
      setDots(newDots);

      const timer = setTimeout(() => {
        setScanning(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
              
              {/* Left Side: AR Viewport Simulation */}
              <div className="md:col-span-7 bg-black relative flex flex-col justify-between p-8 overflow-hidden min-h-[350px]">
                {/* Background Camera Feed Simulation */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40 brightness-75 scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000')` }}></div>
                
                {/* Mebel placed in room */}
                {!scanning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.7, y: 80 }}
                    animate={{ opacity: 1, scale: 1, y: 40 }}
                    className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                  >
                    <img 
                      src={productImage} 
                      alt={productName} 
                      className="w-80 object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)] filter brightness-95 contrast-105"
                    />
                  </motion.div>
                )}

                {/* Top overlay */}
                <div className="relative z-10 flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-ping"></span>
                    <span className="text-[9px] uppercase tracking-widest font-black">Live AR Room Scanner</span>
                  </div>
                </div>

                {/* Scanning indicator */}
                {scanning ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/35 backdrop-blur-[2px]">
                    {/* Scanning radar line */}
                    <motion.div 
                      animate={{ y: [-150, 150] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                      className="w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent shadow-[0_0_15px_#BFA37A] absolute left-0"
                    />
                    {/* Mock feature points */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 p-12 gap-8 pointer-events-none">
                      {dots.map((dot, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.8, 0] }}
                          transition={{ delay: idx * 0.1, repeat: Infinity, duration: 1.5 }}
                          className="w-1.5 h-1.5 bg-brand-gold rounded-full self-center justify-self-center shadow-[0_0_8px_#BFA37A]"
                        />
                      ))}
                    </div>
                    <Camera className="w-10 h-10 text-brand-gold animate-pulse mb-3" />
                    <span className="text-[10px] uppercase tracking-hero text-white font-black">{t('contact.form.submitting')}</span>
                  </div>
                ) : (
                  /* Success tracking feedback */
                  <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase font-black text-white tracking-wider">Surface Anchored</h4>
                        <p className="text-[9px] text-white/50 font-light italic">Placed: {productName}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: QR Code scan information */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">Kengaytirilgan Borliq</span>
                  <h3 className="text-2xl font-editorial-title font-bold mt-2 pr-6">AR texnologiyasi orqali ko'rish</h3>
                  <p className="text-[11px] text-foreground/50 leading-relaxed font-light mt-3">
                    Ushbu premium mebelni uyingizga qanchalik mos kelishini aniqlash uchun kameradan foydalaning. Mobil kamerangizni QR kod ustiga olib boring.
                  </p>
                </div>

                {/* QR Code Graphic and Instructions */}
                <div className="bg-foreground/5 border border-foreground/5 rounded-[2rem] p-6 my-6 flex flex-col items-center gap-4 text-center">
                  <div className="w-36 h-36 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center relative group overflow-hidden">
                    {/* Golden luxury QR visual */}
                    <QrCode className="w-full h-full text-black" />
                    <div className="absolute inset-0 bg-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <Sparkles className="w-8 h-8 text-brand-gold" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-2 text-brand-gold">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="text-[9px] uppercase font-black tracking-widest">Kamerani Yaqinlashtiring</span>
                    </div>
                    <p className="text-[9px] text-foreground/45 mt-1 font-semibold italic">iOS & Android tizimlarini to'liq qo'llab-quvvatlaydi</p>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-brand-gold text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold-muted transition-all duration-300 shadow-xl shadow-brand-gold/15"
                >
                  Tushunarli / Yopish
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

