import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Send, Globe, ShieldCheck } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/profile');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex items-center justify-center bg-background overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bento-card p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-light italic mb-2 tracking-tighter">
            {isLogin ? <span className="not-italic font-bold">Welcome</span> : <span className="not-italic font-bold">Join</span>} Back.
          </h1>
          <p className="text-foreground/40 text-[10px] uppercase tracking-hero font-bold">Luxury curated furniture experience</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-4">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="alexander@prestige.com"
                className="w-full bg-foreground/5 border border-white/5 rounded-full px-6 py-4 text-xs focus:outline-none focus:border-brand-gold transition-colors italic"
              />
              <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-4">Passcode</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-foreground/5 border border-white/5 rounded-full px-6 py-4 text-xs focus:outline-none focus:border-brand-gold transition-colors"
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            </div>
          </div>

          <button className="w-full bg-brand-gold text-black py-5 rounded-full font-bold text-xs uppercase tracking-hero hover:bg-brand-gold-muted transition-all shadow-xl hover:scale-[1.02] active:scale-95">
            {isLogin ? 'Grant Access' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative px-4 bg-background text-[10px] uppercase tracking-widest text-foreground/20 font-bold">Or connect with</span>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-full flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Send className="w-4 h-4 text-brand-gold" />
            Continue with Google
          </button>
        </div>

        <p className="mt-10 text-center text-[10px] uppercase tracking-widest font-bold">
          <span className="text-foreground/40">{isLogin ? "New to Faxr?" : "Already a member?"}</span>{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-gold hover:underline decoration-brand-gold/30 underline-offset-4"
          >
            {isLogin ? 'Apply for Account' : 'Security Log In'}
          </button>
        </p>

        <div className="mt-8 flex justify-center gap-4 text-foreground/10">
          <ShieldCheck className="w-4 h-4" />
          <Globe className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
};
