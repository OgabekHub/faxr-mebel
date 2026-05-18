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
      setIsScrolled(window.scrollY > 40);
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
      "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 px-6 py-3 w-[92%] max-w-7xl rounded-full border border-foreground/5 glow-tracer",
      isScrolled 
        ? "glass shadow-2xl py-3.5" 
        : "bg-background/25 dark:bg-black/35 backdrop-blur-lg border-white/5"
    )}>
      <div className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-display font-black tracking-tighter text-foreground">
            <span className="text-brand-gold group-hover:gold-foil-text transition-all duration-300">FAXR</span> MEBEL
          </span>
        </Link>

        {/* Desktop Nav Center */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-hero transition-all relative py-1",
                  isActive 
                    ? "text-brand-gold font-extrabold" 
                    : "text-foreground/60 hover:text-brand-gold"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span 
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-5">
          {/* Language Switcher Grid */}
          <div className="hidden lg:flex bg-foreground/5 border border-foreground/5 rounded-full p-0.5 text-[8px] font-black uppercase tracking-widest">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-all duration-300",
                  i18n.language.startsWith(lang.code) 
                    ? "bg-brand-gold text-black shadow-md font-bold" 
                    : "text-foreground/45 hover:text-foreground"
                )}
              >
                {lang.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-foreground/5 text-foreground transition-all duration-300 hover:scale-115"
              aria-label="Theme toggle"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-brand-gold" />}
            </button>

            {/* Shopping Cart Indicator */}
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-foreground/5 text-foreground transition-all duration-300 relative hover:scale-115"
              aria-label="Cart link"
            >
              <ShoppingCart className="w-4 h-4" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-gold text-black text-[8px] font-black rounded-full flex items-center justify-center shadow-md shadow-brand-gold/30"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Personal Portal profile link */}
            <Link 
              to={isLoggedIn ? "/profile" : "/auth"} 
              className={cn(
                "p-2 rounded-full hover:bg-foreground/5 transition-all duration-300 hover:scale-115",
                location.pathname === "/profile" || location.pathname === "/auth" ? "text-brand-gold" : "text-foreground"
              )}
              aria-label="Profile link"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-foreground/5 text-foreground transition-colors"
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
            <div className="flex flex-col p-6 gap-5">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-hero border-b border-foreground/5 pb-3.5 transition-colors",
                    location.pathname === link.path ? "text-brand-gold font-extrabold" : "text-foreground hover:text-brand-gold"
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
                        "px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase transition-all",
                        i18n.language.startsWith(lang.code) 
                          ? "bg-brand-gold text-black font-bold" 
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
