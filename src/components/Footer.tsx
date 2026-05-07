import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Twitter, MessageCircle, Send, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="h-40 px-8 flex flex-col md:flex-row items-center justify-between border-t border-white/5 text-[9px] uppercase tracking-[0.2em] font-medium text-foreground/40 bg-background overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="font-bold text-foreground">© 2026 Faxr Mebel. All rights reserved.</div>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-brand-gold transition-colors">Instagram</a>
          <a href="#" className="hover:text-brand-gold transition-colors">Pinterest</a>
          <a href="#" className="hover:text-brand-gold transition-colors">Behance</a>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mt-6 md:mt-0">
        <span className="italic">Tashkent, Uzbekistan</span>
        <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
        <span className="font-bold">+998 71 200 00 00</span>
      </div>
    </footer>
  );
};
