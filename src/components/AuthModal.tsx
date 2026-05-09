import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, RefreshCw, Zap, Eye, EyeOff, Check, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
}

type AuthView = 'signin' | 'signup' | 'success';

export function AuthModal({ onClose }: AuthModalProps) {
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
        if (err) {
          setError(err.message);
        } else {
          onClose();
        }
      } else {
        const err = await signUp(email, password);
        if (err) {
          setError(err.message);
        } else {
          setView('success');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-zinc-900">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)]">
              <RefreshCw className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              REGEN<span className="text-teal text-sm ml-1">AI</span>
            </span>
          </div>
          <p className="text-zinc-400 text-sm mt-3">
            {view === 'success'
              ? 'Account created'
              : view === 'signin'
              ? 'Sign in to sync your generations across devices'
              : 'Create an account to save your generations to the cloud'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {view === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 py-10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center">
                <Check className="w-7 h-7 text-teal" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Check your email</h3>
                <p className="text-zinc-400 text-sm">
                  We sent a confirmation link to <span className="text-white font-medium">{email}</span>.
                  Confirm your email then sign in.
                </p>
              </div>
              <button
                onClick={() => setView('signin')}
                className="mt-2 w-full py-3 bg-teal text-black font-bold rounded-xl text-sm hover:bg-white transition-colors"
              >
                Go to Sign In
              </button>
            </motion.div>
          ) : (
            <motion.form
              key={view}
              initial={{ opacity: 0, x: view === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="px-8 py-8 space-y-5"
            >
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={view === 'signup' ? 'At least 6 characters' : '••••••••'}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-teal/40 focus:ring-1 focus:ring-teal/20 transition-all placeholder:text-zinc-600"
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
                className="w-full py-3.5 bg-teal text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-current" />
                )}
                <span className="uppercase tracking-widest">
                  {loading ? 'Please wait...' : view === 'signin' ? 'Sign In' : 'Create Account'}
                </span>
              </button>

              {/* Toggle */}
              <p className="text-center text-xs text-zinc-500">
                {view === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => { setView(view === 'signin' ? 'signup' : 'signin'); setError(null); }}
                  className="text-teal font-semibold hover:underline"
                >
                  {view === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
