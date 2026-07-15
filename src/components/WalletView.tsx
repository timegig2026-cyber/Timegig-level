import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, List, ShieldCheck, Sparkles, X } from 'lucide-react';
import { WalletTransaction } from '../types';

interface WalletViewProps {
  balance: number;
  referralProfit: number;
  transactions: WalletTransaction[];
  onDeposit: (amount: number, desc: string) => void;
  onWithdraw: (amount: number, desc: string) => void;
  onShowToast: (msg: string) => void;
}

export default function WalletView({ balance, referralProfit, transactions, onDeposit, onWithdraw, onShowToast }: WalletViewProps) {
  const [isTxPanelOpen, setIsTxPanelOpen] = useState(false);
  const [txType, setTxType] = useState<'deposit' | 'withdraw'>('withdraw');
  
  // Transaction form states
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount.trim()) {
      onShowToast("Please specify the transfer amount.");
      return;
    }

    const amountVal = parseFloat(txAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      onShowToast("Please enter a valid transfer amount.");
      return;
    }

    if (txType === 'withdraw' && amountVal > balance) {
      onShowToast(`Insufficient balance. Maximum withdrawable amount is $${balance.toFixed(2)}.`);
      return;
    }

    const description = txDesc.trim() || (txType === 'deposit' ? 'Direct ACH Deposit' : 'Bank ACH Withdrawal');

    if (txType === 'deposit') {
      onDeposit(amountVal, description);
      onShowToast(`Simulated ACH Deposit initiated: $${amountVal.toFixed(2)}!`);
    } else {
      onWithdraw(amountVal, description);
      onShowToast(`Simulated Bank Transfer request created: $${amountVal.toFixed(2)}!`);
    }

    setIsTxPanelOpen(false);
    setTxAmount('');
    setTxDesc('');
  };

  const getTxIcon = (type: WalletTransaction['type']) => {
    if (type === 'deposit') {
      return (
        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
      );
    } else if (type === 'withdrawal') {
      return (
        <ArrowUpRight className="w-5 h-5 text-rose-600" />
      );
    } else {
      return (
        <Sparkles className="w-5 h-5 text-indigo-600" />
      );
    }
  };

  return (
    <div id="wallet-view" className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Balance Indicator & Quick transfer (Span 2) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* balance board */}
        <div className="bg-white border border-slate-200 text-slate-900 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center sm:text-left z-10 w-full sm:w-auto">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-extrabold flex items-center justify-center sm:justify-start gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                Withdrawable Wallet Balance
              </span>
              <h1 className="text-4xl font-black font-mono tracking-tight text-slate-900 flex items-center justify-center sm:justify-start">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-extrabold flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Agents Referral Profit
              </span>
              <h2 className="text-2xl font-black font-mono tracking-tight text-slate-900 flex items-center justify-center sm:justify-start">
                R{referralProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">Status: Connected &bull; Referral Tier: Gold</p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 z-10">
            <button
              onClick={() => {
                setTxType('deposit');
                setIsTxPanelOpen(true);
              }}
              className="py-2.5 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Deposit Funds
            </button>
            <button
              onClick={() => {
                setTxType('withdraw');
                setIsTxPanelOpen(true);
              }}
              className="py-2.5 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Withdraw Cash
            </button>
          </div>

          {/* Decorative backdrop glow */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500 rounded-full filter blur-[100px] opacity-15 pointer-events-none" />
        </div>

        {/* Slide-down transaction drawer */}
        {isTxPanelOpen && (
          <div id="tx-panel" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-slide-down space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                {txType === 'deposit' ? 'ACH Deposit Funds' : 'Bank ACH Cash Out'}
              </h3>
              <button 
                onClick={() => setIsTxPanelOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Transfer Amount ($ USD) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="input-tx-amount"
                      type="number"
                      required
                      placeholder="500"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reference Note / Description</label>
                  <input
                    id="input-tx-desc"
                    type="text"
                    placeholder={txType === 'deposit' ? 'Direct deposit reference' : 'Local checking account transfer'}
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTxPanelOpen(false)}
                  className="py-2 px-4 rounded-md border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Initiate Transfer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transaction Ledger */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center gap-2">
            <List className="w-4 h-4 text-slate-900" />
            <h4 className="font-bold text-slate-900 text-xs">Transaction Ledger History</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/50">
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Settlement Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 divide-y divide-slate-50 font-mono text-[11px]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      No transaction records registered. Complete some gigs to populate earnings ledger!
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isCredit = tx.type === 'earning' || tx.type === 'deposit';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 text-slate-400 font-bold">#{tx.id}</td>
                        <td className="py-3 px-3 text-slate-800 font-bold font-sans flex items-center gap-2">
                          {getTxIcon(tx.type)}
                          <span className="truncate max-w-[160px]">{tx.description}</span>
                        </td>
                        <td className="py-3 px-3">{tx.date}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            tx.status === 'completed' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold font-mono text-sm ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Security Check card (Span 1) */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 text-sm">Escrow Integrity</h3>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-500">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span>Compliance Code</span>
                <span className="text-slate-700 font-bold">FIN-5026</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span>Withdrawing Lock</span>
                <span className="text-emerald-600 font-bold">0.00s</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span>Security Key</span>
                <span className="text-slate-400 truncate max-w-[100px] font-bold">SHA-JWT-256</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs space-y-1.5 font-mono">
            <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wide">Payout Rules</span>
            <p className="text-slate-400 leading-relaxed text-[10px]">
              Gigs balances clear instantly upon completed contractor approvals. Bank cash out requests clear in simulated local testing streams.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
