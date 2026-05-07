import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, User, Globe, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

const languages = [
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 px-8 py-4 w-[95%] max-w-7xl rounded-full border border-white/10",
      isScrolled ? "glass shadow-2xl py-3" : "bg-black/40 backdrop-blur-md"
    )}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "text-xl md:text-2xl font-display font-bold tracking-tighter transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            <span className="text-brand-gold">FAXR</span> MEBEL
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={cn(
                "text-[10px] font-bold uppercase tracking-hero transition-all relative group",
                location.pathname === link.path 
                  ? "text-brand-gold" 
                  : (isScrolled ? "text-foreground/60 hover:text-brand-gold" : "text-white/60 hover:text-brand-gold")
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-[1px] bg-brand-gold transition-all duration-300",
                location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className={cn(
            "hidden lg:flex border rounded-full p-1 text-[8px] font-bold uppercase tracking-widest transition-colors",
            isScrolled ? "bg-foreground/5 border-foreground/10" : "bg-white/5 border-white/10"
          )}>
            {['UZ', 'RU', 'EN'].map((code) => (
              <button
                key={code}
                onClick={() => changeLanguage(code.toLowerCase())}
                className={cn(
                  "px-3 py-1 rounded-full transition-all",
                  i18n.language.toUpperCase().startsWith(code) 
                    ? "bg-brand-gold text-black" 
                    : (isScrolled ? "text-foreground/40 hover:text-foreground" : "text-white/40 hover:text-white")
                )}
              >
                {code}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors",
                isScrolled ? "hover:bg-foreground/10 text-foreground" : "hover:bg-white/10 text-white"
              )}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Cart */}
            <Link 
              to="/cart" 
              className={cn(
                "p-2 rounded-full transition-colors relative",
                isScrolled ? "hover:bg-foreground/10 text-foreground" : "hover:bg-white/10 text-white"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full" />}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className={cn(
                "md:hidden p-2 rounded-full transition-colors",
                isScrolled ? "text-foreground hover:bg-foreground/10" : "text-white hover:bg-white/10"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass mt-4 rounded-3xl overflow-hidden border border-white/5"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-hero border-b pb-4 transition-colors",
                    isScrolled ? "border-foreground/5 text-foreground hover:text-brand-gold" : "border-white/5 text-white hover:text-brand-gold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
