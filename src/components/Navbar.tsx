import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const languages = [
  { code: 'uz', name: 'UZ' },
  { code: 'ru', name: 'RU' },
  { code: 'en', name: 'EN' },
];

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Monitor user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
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
      "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 px-6 md:px-8 py-3.5 w-[92%] max-w-7xl rounded-full border shadow-xl backdrop-blur-md",
      isScrolled 
        ? "bg-white/98 dark:bg-[#0A0A0A]/98 border-neutral-200/60 dark:border-neutral-800/80 py-3 shadow-2xl" 
        : "bg-white/90 dark:bg-[#0F0F0F]/90 border-neutral-200/40 dark:border-neutral-800/40"
    )}>
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-lg md:text-2xl font-display font-black tracking-tighter text-foreground transition-colors">
            <span className="text-[#8C6A3C] dark:text-brand-gold group-hover:text-brand-gold transition-colors duration-300">FAXR</span> MEBEL
          </span>
        </Link>

        {/* Desktop Nav Center */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[10px] lg:text-[11px] font-bold uppercase tracking-hero transition-all relative py-1",
                  isActive 
                    ? "text-foreground font-black" 
                    : "text-foreground/60 hover:text-foreground"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span 
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-[#8C6A3C] dark:bg-brand-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Language Switcher Grid */}
          <div className="hidden lg:flex bg-foreground/[0.04] border border-foreground/[0.04] rounded-full p-0.5 text-[8px] font-black uppercase tracking-widest">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-all duration-300",
                  i18n.language.startsWith(lang.code) 
                    ? "bg-[#8C6A3C] dark:bg-brand-gold text-white dark:text-black shadow-sm font-bold" 
                    : "text-foreground/50 hover:text-foreground"
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 lg:gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-foreground/[0.05] text-foreground transition-all duration-300 hover:scale-110"
              aria-label="Theme toggle"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-brand-gold animate-spin-slow" />}
            </button>

            {/* Redesigned Premium Highlighted Shopping Cart */}
            <Link 
              to="/cart" 
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-300 hover:scale-105 border",
                totalItems > 0
                  ? "bg-[#8C6A3C] dark:bg-brand-gold border-[#8C6A3C] dark:border-brand-gold text-white dark:text-black font-extrabold shadow-md shadow-brand-gold/10"
                  : "bg-foreground/[0.04] border-foreground/[0.04] hover:bg-foreground/[0.08] text-foreground"
              )}
              aria-label="Cart link"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                {t('nav.cart') || 'Savat'} {totalItems > 0 && `(${totalItems})`}
              </span>
              {totalItems > 0 && (
                <span className="sm:hidden w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>

            {/* Personal Portal profile link */}
            <Link 
              to={isLoggedIn ? "/profile" : "/auth"} 
              className={cn(
                "p-2 rounded-full hover:bg-foreground/[0.05] transition-all duration-300 hover:scale-110",
                location.pathname === "/profile" || location.pathname === "/auth" ? "text-[#8C6A3C] dark:text-brand-gold" : "text-foreground"
              )}
              aria-label="Profile link"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-foreground/[0.05] text-foreground transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Mobile menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden glass mt-4 rounded-3xl overflow-hidden border border-foreground/5"
          >
            <div className="flex flex-col p-6 gap-5 bg-white dark:bg-[#0F0F0F]">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-hero border-b border-foreground/5 pb-3.5 transition-colors",
                    location.pathname === link.path ? "text-[#8C6A3C] dark:text-brand-gold font-extrabold" : "text-foreground hover:text-brand-gold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Language Switcher in Mobile Drawer */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/45">Language</span>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase transition-all",
                        i18n.language.startsWith(lang.code) 
                          ? "bg-[#8C6A3C] dark:bg-brand-gold text-white dark:text-black font-bold" 
                          : "bg-foreground/5 text-foreground/50"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
