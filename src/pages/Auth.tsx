import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Send, ShieldCheck, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/profile');
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: '✦', text: t('auth.feat1', 'Eksklyuziv kolleksiyalarga kirish') },
    { icon: '✦', text: t('auth.feat2', 'Premium buyurtma tarixingiz') },
    { icon: '✦', text: t('auth.feat3', 'Maxsus chegirmalar va takliflar') },
    { icon: '✦', text: t('auth.feat4', 'Shaxsiy dizayn maslahati') },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* ─── Left Panel – Branding ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden">
        {/* Dark overlay background */}
        <div className="absolute inset-0 bg-[#080604]" />

        {/* Gold gradient blobs */}
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-brand-gold/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-brand-bronze/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(197,160,89,1) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Animated decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[320, 480, 640].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full border border-brand-gold/10"
              style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
              transition={{ duration: 30 + i * 10, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-display font-black tracking-tighter text-white">
              <span className="text-brand-gold">FAXR</span> MEBEL
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                {t('auth.badge', 'Premium Membership')}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl xl:text-6xl font-display font-light text-white leading-[1.05] tracking-tight"
            >
              {t('auth.heroTitle', 'Hashamat')}
              <br />
              <span className="italic font-extralight text-brand-gold">
                {t('auth.heroSub', 'uyingizda.')}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 text-sm leading-relaxed max-w-sm font-light"
            >
              {t('auth.heroDesc', "O'zbekistonning eng premium mebel platformasiga xush kelibsiz.")}
            </motion.p>
          </div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3.5"
          >
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="flex items-center gap-3 text-white/60 text-xs font-medium"
              >
                <span className="text-brand-gold text-base leading-none">{f.icon}</span>
                {f.text}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Bottom testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 bg-white/[0.04] backdrop-blur border border-white/[0.06] rounded-2xl p-6"
        >
          <p className="text-white/60 text-xs leading-relaxed italic mb-4">
            "{t('home.testimonial.text', '\"Faxr Mebel uyingizga shunchaki mebel emas, haqiqiy hashamat va nafislik olib kiradi.\"').replace(/"/g, '')}"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center">
              <span className="text-brand-gold text-xs font-bold">E</span>
            </div>
            <div>
              <p className="text-white text-xs font-bold">{t('home.testimonial.name', 'Elena V.')}</p>
              <p className="text-white/40 text-[10px]">{t('home.testimonial.role', 'Interyer Dizayner')}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Right Panel – Form ────────────────────────────────────── */}
      <div className="w-full lg:w-[48%] flex flex-col justify-center items-center px-6 py-20 relative">
        {/* Subtle top-right glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-block text-xl font-display font-black tracking-tighter text-foreground">
              <span className="text-brand-gold">FAXR</span> MEBEL
            </Link>
          </div>

          {/* Tab switcher */}
          <div className="bg-foreground/[0.05] border border-foreground/[0.07] p-1 rounded-2xl flex mb-8">
            {[
              { key: true, label: t('auth.signIn', 'Kirish') },
              { key: false, label: t('auth.signUp', "Ro'yxatdan o'tish") },
            ].map(({ key, label }) => (
              <button
                key={String(key)}
                onClick={() => setIsLogin(key)}
                className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  isLogin === key
                    ? 'bg-brand-gold text-black shadow-md'
                    : 'text-foreground/40 hover:text-foreground/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={String(isLogin)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-display font-light tracking-tight text-foreground mb-1">
                {isLogin ? (
                  <>
                    <span className="font-bold">{t('auth.welcomeBack', 'Qaytib kelganingizdan')}</span>{' '}
                    <span className="italic text-brand-gold">{t('auth.glad', 'xursandmiz.')}</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold">{t('auth.joinUs', 'Oilaga')}</span>{' '}
                    <span className="italic text-brand-gold">{t('auth.qo\'shiling', "qo'shiling.")}</span>
                  </>
                )}
              </h1>
              <p className="text-foreground/40 text-xs">
                {isLogin
                  ? t('auth.loginDesc', 'Akkauntingizga kiring va premium tajribani davom ettiring.')
                  : t('auth.registerDesc', "Yangi akkaunt yarating va hashamat olamiga qadam qo'ying.")}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">
                {t('auth.email', 'Elektron pochta')}
              </label>
              <div className={`relative transition-all duration-300 ${focused === 'email' ? 'scale-[1.01]' : ''}`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="alexander@prestige.com"
                  className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-brand-gold/60 focus:bg-foreground/[0.06] transition-all text-foreground placeholder:text-foreground/25 pr-12"
                />
                <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'email' ? 'text-brand-gold' : 'text-foreground/20'}`}>
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">
                {t('auth.passcode', 'Parol')}
              </label>
              <div className={`relative transition-all duration-300 ${focused === 'pass' ? 'scale-[1.01]' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('pass')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••••"
                  className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-brand-gold/60 focus:bg-foreground/[0.06] transition-all text-foreground placeholder:text-foreground/25 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused === 'pass' ? 'text-brand-gold' : 'text-foreground/20'} hover:text-brand-gold`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button className="text-[10px] text-brand-gold/70 hover:text-brand-gold uppercase tracking-widest font-bold transition-colors">
                  {t('auth.forgot', 'Parolni unutdingizmi?')}
                </button>
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="relative w-full bg-brand-gold text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-hero overflow-hidden group mt-2"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? t('auth.grantAccess', 'Kirish') : t('auth.createAccount', "Akkaunt yaratish")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 skew-x-12" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-1 h-px bg-foreground/[0.08]" />
            <span className="px-4 text-[10px] uppercase tracking-widest text-foreground/25 font-bold">
              {t('auth.orConnect', 'Yoki')}
            </span>
            <div className="flex-1 h-px bg-foreground/[0.08]" />
          </div>

          {/* Google Button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-foreground/[0.08] hover:border-foreground/15 transition-all text-[11px] font-bold uppercase tracking-widest disabled:opacity-50"
          >
            {/* Google icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('auth.continueGoogle', 'Google orqali kirish')}
          </motion.button>

          {/* Switch mode */}
          <p className="mt-8 text-center text-[11px] text-foreground/40">
            {isLogin ? t('auth.newToFaxr', "Faxr Mebel da akkauntingiz yo'qmi?") : t('auth.alreadyMember', 'Allaqachon akkauntingiz bormi?')}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-gold font-bold hover:underline underline-offset-4 decoration-brand-gold/30 transition-all"
            >
              {isLogin ? t('auth.apply', "Ro'yxatdan o'tish") : t('auth.login', 'Kirish')}
            </button>
          </p>

          {/* Trust badges */}
          <div className="mt-10 flex items-center justify-center gap-6 text-foreground/20">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold/40" />
              <span className="text-[9px] uppercase tracking-widest font-bold">{t('auth.secure', 'SSL Himoyali')}</span>
            </div>
            <div className="w-px h-3 bg-foreground/10" />
            <div className="flex items-center gap-1.5">
              <Send className="w-3 h-3 text-brand-gold/40" />
              <span className="text-[9px] uppercase tracking-widest font-bold">{t('auth.privacy', 'Maxfiylik')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
