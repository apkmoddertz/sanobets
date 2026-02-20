import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, Mail, Loader2, Trophy, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const authError = err as AuthError;
      let message = 'An error occurred';
      if (authError.code === 'auth/invalid-email') message = 'Invalid email address';
      if (authError.code === 'auth/user-disabled') message = 'User account is disabled';
      if (authError.code === 'auth/user-not-found') message = 'User not found';
      if (authError.code === 'auth/wrong-password') message = 'Incorrect password';
      if (authError.code === 'auth/email-already-in-use') message = 'Email already in use';
      if (authError.code === 'auth/weak-password') message = 'Password should be at least 6 characters';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1012] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Minimalist Container */}
        <div className="relative">
          
          <div className="text-center mb-6">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] transform rotate-3"
            >
              <Trophy size={32} className="text-white drop-shadow-md" />
            </motion.div>
            <motion.h1 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white tracking-tight"
            >
              Sano Bet
            </motion.h1>
          </div>

          {/* Animated Toggle */}
          <div className="bg-[#1a1b1e]/50 p-1 rounded-lg mb-6 relative w-full max-w-[200px] mx-auto">
            <div className="grid grid-cols-2 relative z-10">
              <button
                onClick={() => setIsLogin(true)}
                className={`py-1.5 text-xs font-bold rounded-md transition-colors ${isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`py-1.5 text-xs font-bold rounded-md transition-colors ${!isLogin ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Register
              </button>
            </div>
            <motion.div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-md shadow-sm"
              animate={{ x: isLogin ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <div className="relative group">
                <div className="relative bg-[#1a1b1e]/50 rounded-xl transition-colors hover:bg-[#1a1b1e]">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-3 pl-10 pr-4 text-white text-sm focus:outline-none placeholder-gray-600 font-medium"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="relative bg-[#1a1b1e]/50 rounded-xl transition-colors hover:bg-[#1a1b1e]">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3 pl-10 pr-4 text-white text-sm focus:outline-none placeholder-gray-600 font-medium"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="text-sm">{isLogin ? 'Access Dashboard' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 font-medium">
              {isLogin ? "New here? " : "Member? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
