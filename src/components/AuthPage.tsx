import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw, Zap, Mail, Lock, Eye, EyeOff, Check,
  Info, Sparkles, Hash, Video, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type AuthView = 'signin' | 'signup' | 'verify';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [view, setView] = useState<AuthView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (view === 'signin') {
        const err = await signIn(email, password);
        if (err) setError(err.message);
      } else {
        const err = await signUp(email, password);
        if (err) setError(err.message);
        else setView('verify');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, label: 'Viral Intelligence', desc: 'Curiosity-driven hooks for TikTok, Reels & Shorts' },
    { icon: Hash, label: 'SEO Hashtag Engine', desc: '15-20 trending, relevant tags per generation' },
    { icon: Video, label: 'Caption Studio', desc: 'Multiple caption styles in one click' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">

      {/* ── Left / Brand Panel ── */}
      <div className="relative flex flex-col justify-between lg:w-[52%] px-10 py-12 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        {/* Glow blob */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.5)]">
            <RefreshCw className="w-5 h-5 text-black" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            REGEN<span className="text-teal text-sm ml-1">AI</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative my-12 lg:my-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/5 border border-teal/15 mb-6 font-mono text-[10px] uppercase tracking-widest text-teal">
              <Zap className="w-3 h-3 fill-teal" />
              Premium Social Intelligence
            </div>
            <h1 className="text-5xl xl:text-6xl font-bold tracking-tighter leading-[1.05] mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent italic">
              Regenerate<br />for Virality.
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              Transform weak social text into high-retention content — titles, captions, hooks, and hashtags in seconds.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 space-y-4"
          >
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-zinc-950/60 border border-zinc-900 rounded-xl hover:border-teal/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="relative text-[10px] text-zinc-700 uppercase tracking-widest">
          © 2026 REGEN AI • Premium Social Optimization Interface
        </p>
      </div>

      {/* ── Right / Auth Panel ── */}
      <div className="flex flex-col justify-center lg:w-[48%] bg-zinc-950 border-l border-zinc-900 px-8 sm:px-14 py-14">
        <AnimatePresence mode="wait">

          {/* ── Verify email screen ── */}
          {view === 'verify' ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-sm mx-auto w-full text-center"
            >
              <div className="w-16 h-16 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-teal" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Check your email</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                We sent a confirmation link to{' '}
                <span className="text-white font-semibold">{email}</span>.
                Click it to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setView('signin'); setError(null); }}
                className="w-full py-3.5 bg-teal text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Go to Sign In
              </button>
            </motion.div>
          ) : (

            /* ── Sign in / Sign up form ── */
            <motion.div
              key={view}
              initial={{ opacity: 0, x: view === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-sm mx-auto w-full"
            >
              <h2 className="text-3xl font-bold tracking-tighter mb-1">
                {view === 'signin' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-zinc-400 text-sm mb-8">
                {view === 'signin'
                  ? 'Sign in to access your generations'
                  : 'Start regenerating content for free'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={view === 'signup' ? 'At least 6 characters' : '••••••••'}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-10 pr-11 text-sm focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                    >
                      <Info className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-teal text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] uppercase tracking-widest"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 fill-current" />
                  )}
                  {loading
                    ? 'Please wait...'
                    : view === 'signin'
                    ? 'Sign In'
                    : 'Create Account'}
                </button>
              </form>

              {/* Toggle */}
              <p className="text-center text-sm text-zinc-500 mt-6">
                {view === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setView(view === 'signin' ? 'signup' : 'signin'); setError(null); }}
                  className="text-teal font-semibold hover:underline underline-offset-2"
                >
                  {view === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
