import React from 'react';
import { X, CreditCard, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export default function WalletModal({ isOpen, onClose, balance, onDeposit, onWithdraw }: WalletModalProps) {
  const [amount, setAmount] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'deposit' | 'withdraw'>('deposit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
      if (activeTab === 'deposit') {
        onDeposit(val);
      } else {
        onWithdraw(val);
      }
      setAmount('');
      onClose();
    }
  };

  const quickAmounts = [10, 20, 50, 100, 500];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1a1b1e] rounded-2xl border border-white/10 p-6 z-[101] shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1">My Wallet</h2>
              <div className="text-3xl font-bold text-emerald-400">${balance.toFixed(2)}</div>
              <p className="text-gray-400 text-xs mt-1">Available Balance</p>
            </div>

            <div className="flex p-1 bg-[#25262b] rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'deposit' 
                    ? 'bg-emerald-500 text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'withdraw' 
                    ? 'bg-emerald-500 text-black shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Withdraw
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 ml-1 mb-1 block">
                  {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#25262b] border border-white/10 rounded-xl py-4 pl-8 pr-4 text-white text-lg font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {activeTab === 'deposit' && (
                <div className="grid grid-cols-5 gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className="bg-[#25262b] hover:bg-[#2c2e33] border border-white/5 rounded-lg py-2 text-xs font-medium text-gray-300 transition-colors"
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-[#25262b]/50 rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a1b1e] flex items-center justify-center text-gray-400 border border-white/5">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Visa •••• 4242</div>
                  <div className="text-xs text-gray-500">Expires 12/28</div>
                </div>
                <button type="button" className="text-emerald-400 text-xs font-bold hover:underline">
                  Change
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {activeTab === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                {activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
