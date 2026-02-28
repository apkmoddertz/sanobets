import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Shield, Target, TrendingUp, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface QuizStep {
  id: number;
  title: string;
  description: string;
  options: { id: string; label: string; icon: React.ReactNode }[];
}

const QUIZ_STEPS: QuizStep[] = [
  {
    id: 1,
    title: "Which sports do you follow?",
    description: "Select your primary interest for better accuracy.",
    options: [
      { id: 'soccer', label: 'Soccer / Football', icon: <Trophy size={20} /> },
      { id: 'basketball', label: 'Basketball', icon: <Target size={20} /> },
      { id: 'tennis', label: 'Tennis', icon: <TrendingUp size={20} /> }
    ]
  },
  {
    id: 2,
    title: "What's your betting experience?",
    description: "This helps us tailor the predictions to your level.",
    options: [
      { id: 'beginner', label: 'Beginner', icon: <TrendingUp size={20} /> },
      { id: 'intermediate', label: 'Intermediate', icon: <Target size={20} /> },
      { id: 'pro', label: 'Professional', icon: <Trophy size={20} /> }
    ]
  },
  {
    id: 3,
    title: "What's your primary goal?",
    description: "Tell us what you're looking for in Sano Bet.",
    options: [
      { id: 'daily', label: 'Daily Free Tips', icon: <TrendingUp size={20} /> },
      { id: 'vip', label: 'High Confidence VIP', icon: <Shield size={20} /> },
      { id: 'fixed', label: 'Exclusive Fixed Matches', icon: <Target size={20} /> }
    ]
  }
];

export default function OnboardingQuiz() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [QUIZ_STEPS[currentStep].id]: optionId }));
    
    if (currentStep < QUIZ_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setIsFinishing(true);
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        onboardingCompleted: true,
        quizAnswers: answers,
        updatedAt: new Date().toISOString()
      });
      // Small delay for effect
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error saving quiz answers:", error);
      setIsFinishing(false);
    }
  };

  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#141517] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Step {currentStep + 1} of {QUIZ_STEPS.length}</span>
            <span className="text-xs font-bold text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#1a1b1e] rounded-2xl border border-white/10 p-8 shadow-2xl"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">{QUIZ_STEPS[currentStep].title}</h2>
              <p className="text-gray-400 text-sm">{QUIZ_STEPS[currentStep].description}</p>
            </div>

            <div className="space-y-3">
              {QUIZ_STEPS[currentStep].options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${
                    answers[QUIZ_STEPS[currentStep].id] === option.id
                      ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-[#25262b] border-white/5 text-gray-300 hover:border-emerald-500/50 hover:bg-[#2c2e33]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      answers[QUIZ_STEPS[currentStep].id] === option.id
                        ? 'bg-black/10 text-black'
                        : 'bg-white/5 text-emerald-500 group-hover:bg-emerald-500/10'
                    }`}>
                      {option.icon}
                    </div>
                    <span className="font-bold">{option.label}</span>
                  </div>
                  {answers[QUIZ_STEPS[currentStep].id] === option.id ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {isFinishing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="animate-spin text-emerald-500 mb-4 mx-auto" size={48} />
              <h3 className="text-white font-bold text-xl">All set!</h3>
              <p className="text-gray-400">Redirecting you to our Daily Free Tips section...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
