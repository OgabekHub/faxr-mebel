import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

const languages = [
  { code: 'uz', name: 'UZ' },
  { code: 'ru', name: 'RU' },
  { code: 'en', name: 'EN' },
];

const WIPE_FLIP_MS = 380; // theme flips when the wipe covers the screen (~45% of 850ms)
const WIPE_DONE_MS = 850;

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  // Only the admin flag: reading the session here would force every visitor to download Firebase.
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Circular Theme Wipe Switcher Coords/State
  const [wipeActive, setWipeActive] = useState(false);
  const [wipeCoords, setWipeCoords] = useState({ x: 0, y: 0 });
  const [targetTheme, setTargetTheme] = useState<'light' | 'dark' | null>(null);
  const wipeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear pending wipe timers on unmount so `theme-wipe-active` never sticks on <body>.
  useEffect(() => {
    return () => {
      wipeTimers.current.forEach(clearTimeout);
      wipeTimers.current = [];
      document.body.classList.remove('theme-wipe-active');
    };
  }, []);

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (wipeActive) return; // Guard against rapid double-clicks
    setWipeCoords({ x: e.clientX, y: e.clientY });
    setTargetTheme(theme === 'light' ? 'dark' : 'light');
    setWipeActive(true);

    // Disable CSS transitions during wipe so theme flip is instant (wipe handles visual)
    document.body.classList.add('theme-wipe-active');

    wipeTimers.current = [
      setTimeout(() => toggleTheme(), WIPE_FLIP_MS),
      setTimeout(() => {
        document.body.classList.remove('theme-wipe-active');
        setWipeActive(false);
        setTargetTheme(null);
        wipeTimers.current = [];
      }, WIPE_DONE_MS),
    ];
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the drawer whenever the route changes (back button, programmatic navigation).
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Keep the page behind the drawer still while it is open.
  useBodyScrollLock(isOpen);

  const changeLanguage = (code: string) => {
    // Load the bundle first: switching straight away suspends every component that
    // calls `t` while the JSON downloads, so on a slow phone connection the whole
    // page is replaced by the route spinner and the reader loses their place.
    void i18n.loadLanguages(code).then(() => i18n.changeLanguage(code));
    setIsOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.portfolio'), path: '/portfolio' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
    ...(isAdmin ? [{ name: t('nav.admin'), path: '/admin' }] : []),
  ];


  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 lg:hidden" aria-hidden="true" onClick={() => setIsOpen(false)} />}
      <nav className={cn(
        "fixed top-[max(1.5rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-50 transition-[background-color,border-color,padding,border-radius,box-shadow] duration-300 px-4 sm:px-6 md:px-8 py-3.5 w-[92%] max-w-7xl border shadow-xl backdrop-blur-md rounded-full",
        isScrolled
          ? "bg-white dark:bg-[#0A0A0A] border-neutral-200 dark:border-neutral-800/80 py-3 shadow-2xl"
          : "bg-white/95 dark:bg-[#0D0D0D]/95 border-neutral-200/60 dark:border-neutral-800/60"
      )}>
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group shrink-0">
            <BrandLogo className="text-lg md:text-[22px]" />
          </Link>

          {/* Desktop Nav Center (lg+; tablets use the drawer so the language switcher stays reachable) */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-[10px] xl:text-[11px] font-bold uppercase tracking-hero transition-all relative py-1",
                    isActive
                      ? "text-neutral-950 dark:text-neutral-50 font-black"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-50"
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
            {/* Language Switcher Grid - High contrast text */}
            <div className="hidden lg:flex bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 p-0.5 rounded-full text-[8px] font-black uppercase tracking-widest" role="group" aria-label="Language">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  aria-pressed={i18n.language.startsWith(lang.code)}
                  className={cn(
                    "px-3 py-1.5 rounded-full",
                    i18n.language.startsWith(lang.code)
                      ? "bg-[#8C6A3C] dark:bg-brand-gold text-white dark:text-black shadow-sm font-bold"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={handleThemeToggle}
                className="p-3 -m-1 lg:p-2 lg:m-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors duration-300 active:scale-95"
                aria-label={t('nav.theme')}
              >
                {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-brand-gold animate-spin-slow" />}
              </button>

            {/* Personal Portal profile link */}
            <Link
              to="/profile" /* ProtectedRoute sends signed-out visitors to /auth and back */
              className={cn(
                "p-3 -m-1 lg:p-2 lg:m-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300 active:scale-95",
                location.pathname === "/profile" || location.pathname === "/auth"
                  ? "text-[#8C6A3C] dark:text-brand-gold"
                  : "text-neutral-700 dark:text-neutral-200"
              )}
              aria-label={t('nav.profile')}
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Mobile / tablet Menu Trigger */}
            <button
              type="button"
              className="lg:hidden p-3 -m-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors"
              onClick={() => setIsOpen(open => !open)}
              aria-label={t('nav.menu')}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
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
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-[calc(100%+0.75rem)] left-0 right-0 lg:hidden bg-white/95 dark:bg-[#0D0D0D]/95 border border-neutral-200 dark:border-neutral-800/80 rounded-[2rem] shadow-2xl backdrop-blur-md p-6 max-h-[calc(100dvh-8rem)] overflow-y-auto overscroll-contain flex flex-col gap-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-xs font-bold uppercase tracking-hero border-b border-neutral-100 dark:border-neutral-800 pt-3 pb-3.5 transition-colors",
                  location.pathname === link.path
                    ? "text-[#8C6A3C] dark:text-brand-gold font-extrabold"
                    : "text-neutral-800 dark:text-neutral-200 hover:text-brand-gold"
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Language Switcher in Mobile Drawer */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">{t('nav.language')}</span>
              <div className="flex gap-2" role="group" aria-label={t('nav.language')}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    aria-pressed={i18n.language.startsWith(lang.code)}
                    className={cn(
                      "min-h-11 min-w-11 px-4 flex items-center justify-center rounded-full text-[11px] font-black tracking-widest uppercase",
                      i18n.language.startsWith(lang.code)
                        ? "bg-[#8C6A3C] dark:bg-brand-gold text-white dark:text-black font-bold"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    {wipeActive && (
      <div
        className={cn(
          "circular-transition-overlay animate-circular-wipe",
          targetTheme === 'dark' ? "bg-[#050505]" : "bg-[#F9F9F6]"
        )}
        style={{
          '--wipe-x': `${wipeCoords.x}px`,
          '--wipe-y': `${wipeCoords.y}px`
        }}
      />
    )}
    </>
  );
};
