import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, Mail, Loader2, Trophy, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [regStep, setRegStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setRegStep(2);
  };

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
      // Removed window.location.reload() to avoid blank screen and use React state instead
    } catch (err: any) {
      console.error("Login Error:", err);
      const authError = err as AuthError;
      let message = 'An error occurred';
      if (authError.code === 'auth/invalid-email') message = 'Invalid email address';
      if (authError.code === 'auth/user-disabled') message = 'User account is disabled';
      if (authError.code === 'auth/user-not-found') message = 'User not found';
      if (authError.code === 'auth/wrong-password') message = 'Incorrect password';
      if (authError.code === 'auth/email-already-in-use') message = 'Email already in use';
      if (authError.code === 'auth/weak-password') message = 'Password should be at least 6 characters';
      if (authError.code === 'auth/too-many-requests') message = 'Too many attempts. Please try again later.';
      if (authError.code === 'auth/network-request-failed') message = 'Network error. Check your connection.';
      setError(authError.message || message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* 3D Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] animate-pulse"></div>
        
        {/* Floating 3D Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[15%] text-emerald-500/10"
        >
          <Trophy size={120} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[10%] text-blue-500/10"
        >
          <Zap size={100} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ 
            x: [0, 40, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] left-[20%] text-emerald-400/5"
        >
          <Globe size={150} strokeWidth={0.5} />
        </motion.div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: "1200px" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card with Glassmorphism and 3D Tilt */}
        <motion.div 
          whileHover={{ rotateY: 2, rotateX: -2, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
          className="bg-[#121417]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
          
          <div className="text-center mb-8 relative">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_30px_rgba(16,185,129,0.4)] relative"
            >
              <Trophy size={40} className="text-black" />
              <div className="absolute inset-0 rounded-3xl bg-white/20 animate-pulse"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">
                SANO<span className="text-emerald-500">BET</span>
              </h1>
              <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">
                Premium Sports Analytics 2026
              </p>
            </motion.div>
          </div>

          {/* Modern Tab Switcher */}
          <div className="bg-black/40 p-1.5 rounded-2xl mb-8 relative flex items-center border border-white/5">
            <button
              onClick={() => { setIsLogin(true); setRegStep(1); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all relative z-10 ${isLogin ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => { setIsLogin(false); setRegStep(1); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all relative z-10 ${!isLogin ? 'text-black' : 'text-gray-500 hover:text-gray-300'}`}
            >
              REGISTER
            </button>
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-emerald-500 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              animate={{ x: isLogin ? 0 : '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : `register-step-${regStep}`}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={isLogin || regStep === 2 ? handleSubmit : handleNextStep} 
              className="space-y-4"
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-bold flex items-center gap-2"
                >
                  <ShieldCheck size={16} />
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                {(isLogin || regStep === 1) && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-600 font-bold"
                      placeholder="EMAIL ADDRESS"
                      required
                      autoFocus
                    />
                  </div>
                )}

                {(isLogin || regStep === 2) && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-gray-600 font-bold"
                      placeholder="PASSWORD"
                      required
                      autoFocus={!isLogin}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mt-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                    <span className="text-xs font-black tracking-widest uppercase">PROCESSING...</span>
                  </div>
                ) : (
                  <>
                    <span className="tracking-widest uppercase">
                      {isLogin ? 'ENTER ARENA' : regStep === 1 ? 'CONTINUE' : 'JOIN THE ELITE'}
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">
              {isLogin ? "Don't have an account? " : "Already a member? "}
              <button
                onClick={() => { setIsLogin(!isLogin); setRegStep(1); setError(''); }}
                className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1"
              >
                {isLogin ? 'REGISTER NOW' : 'SIGN IN'}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer Stats */}
        <div className="mt-8 flex justify-center gap-8 opacity-40">
          <div className="text-center">
            <p className="text-white font-black text-lg">95%</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Win Rate</p>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-lg">24/7</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Support</p>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-lg">50K+</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Active Users</p>
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
