import React, { useState, useEffect } from 'react';
import { 
  Gift, UserCheck, CheckCircle, CreditCard, Link2, Users, 
  ArrowRight, DollarSign, Award, TrendingUp, X, Sparkles, 
  Lock, Check, AlertCircle, Copy, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Referral, AgentCashout } from '../types';

interface ReferralViewProps {
  referrals: Referral[];
  onAddReferral: (ref: Referral) => void;
  onUpdateReferral: (ref: Referral) => void;
  onResetReferrals: () => void;
  onShowToast: (msg: string) => void;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  isVerifiedAgent: boolean;
  setIsVerifiedAgent: (v: boolean) => void;
  onAddNotification: (title: string, desc: string, type: 'info' | 'success' | 'alert' | 'wallet') => void;
  onNormalLinkClick: () => void;
  onRequestAgentCashout: (
    amount: number,
    isEarly: boolean,
    bankName: string,
    accountNumber: string,
    accountHolderName: string,
    rawRewards?: number,
    rawTopups?: number
  ) => void;
  agentCashouts: AgentCashout[];
  userName: string;
}

export default function ReferralView({
  referrals,
  onAddReferral,
  onUpdateReferral,
  onResetReferrals,
  onShowToast,
  balance,
  setBalance,
  isVerifiedAgent,
  setIsVerifiedAgent,
  onAddNotification,
  onNormalLinkClick,
  onRequestAgentCashout,
  agentCashouts,
  userName,
}: ReferralViewProps) {
  // State for banking details submission
  const [bankName, setBankName] = useState(() => localStorage.getItem('agent_bankName') || '');
  const [accountNumber, setAccountNumber] = useState(() => localStorage.getItem('agent_accountNumber') || '');
  const [accountHolderName, setAccountHolderName] = useState(() => localStorage.getItem('agent_accountHolderName') || '');
  const [isBankingSubmitted, setIsBankingSubmitted] = useState(() => {
    return localStorage.getItem('agent_isBankingSubmitted') === 'true';
  });

  // UI States
  const [copied, setCopied] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showCashoutSuccessModal, setShowCashoutSuccessModal] = useState(false);
  const [cashoutSuccessAmount, setCashoutSuccessAmount] = useState(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('agent_bankName', bankName);
    localStorage.setItem('agent_accountNumber', accountNumber);
    localStorage.setItem('agent_accountHolderName', accountHolderName);
    localStorage.setItem('agent_isBankingSubmitted', JSON.stringify(isBankingSubmitted));
  }, [bankName, accountNumber, accountHolderName, isBankingSubmitted]);

  const validCount = referrals.length;

  // Math calculations
  const totalReferralTopups = referrals.reduce((sum, r) => sum + (r.topupAmount || 0), 0);
  
  // Decide rates and rewards based on referral count
  let milestoneStatus: 'none' | 'early' | 'full' = 'none';
  let onceOffReward = 0;
  // User requested: "For every referral... user will receive 50% and admin 50%"
  const commissionRate = 0.50; 

  if (validCount >= 20) {
    milestoneStatus = 'full';
    onceOffReward = 100.00;
  } else if (validCount >= 10) {
    milestoneStatus = 'early';
    onceOffReward = 25.00; // 25% of 100
  }

  const commissionEarnings = totalReferralTopups * commissionRate;
  const totalEarnings = onceOffReward + commissionEarnings;

  // Custom link generation
  const slug = userName ? userName.replace(/\s+/g, '').toLowerCase() : 'agent';
  const referralLink = `https://timegig.co.za/join?ref=${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    onShowToast("Custom referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber || !accountHolderName) {
      onShowToast("Please fill in all banking details!");
      return;
    }
    setIsBankingSubmitted(true);
    setShowCongratsModal(true);
    onAddNotification(
      "Agent Setup Complete! 🎉",
      "Congratulations! Your banking details are saved, and your custom agent referral link is now live.",
      "success"
    );
  };

  const handleRequestCashout = () => {
    if (validCount < 10) {
      onShowToast("Minimum 10 valid referrals required to cash out!");
      return;
    }

    const isEarly = milestoneStatus === 'early';
    
    // Check if there is already a pending cashout
    const hasPending = agentCashouts.some(c => c.status === 'pending');
    if (hasPending) {
      onShowToast("You already have a pending cashout request in verification!");
      return;
    }

    onRequestAgentCashout(
      totalEarnings,
      isEarly,
      bankName,
      accountNumber,
      accountHolderName,
      onceOffReward,
      totalReferralTopups
    );

    setCashoutSuccessAmount(totalEarnings);
    setShowCashoutSuccessModal(true);
  };

  // Simulate verification for demo/testing
  const handleQuickVerify = () => {
    setIsVerifiedAgent(true);
    onAddNotification(
      "Agent Verified (Demo)",
      "You simulated agent verification. Now add your bank details!",
      "success"
    );
    onShowToast("Agent verification unlocked!");
  };

  // Simulations to build referral networks instantly
  const handleSimulateReferral = (count: number) => {
    const existingCount = referrals.length;
    const newRefs: Referral[] = [];
    const emails = [
      "john.doe", "mandla.sithole", "sara.govender", "lerato.khumalo", "piet.dupreez",
      "chloe.williams", "ayanda.ndlovu", "tanya.coetzee", "sipho.masango", "david.smith",
      "zola.dlamini", "bruce.wayne", "goku.son", "elon.musk", "kevin.hart", "sharon.stone",
      "will.smith", "lara.croft", "tony.stark", "peter.parker", "bruce.banner", "clark.kent"
    ];

    for (let i = 0; i < count; i++) {
      const uniqueId = `sim-ref-${Date.now()}-${i}`;
      const nameIndex = (existingCount + i) % emails.length;
      const domain = ["gmail.com", "yahoo.com", "outlook.co.za", "webmail.co.za"][Math.floor(Math.random() * 4)];
      const randomEmail = `${emails[nameIndex]}+${Math.floor(Math.random() * 900) + 100}@${domain}`;
      const randomTopup = [30, 50, 80, 100, 150, 200, 300][Math.floor(Math.random() * 7)];
      
      const newRef: Referral = {
        id: uniqueId,
        email: randomEmail,
        status: 'Joined',
        reward: 5, // Base points
        date: new Date().toISOString().split('T')[0],
        isValid: true,
        topupAmount: randomTopup,
        hasBecomeAgent: Math.random() > 0.6
      };
      onAddReferral(newRef);
    }
    
    onShowToast(`Simulated +${count} referred users!`);
    onAddNotification(
      "Referrals Joined",
      `Simulated ${count} new referred users with topups! Check your new commission earnings.`,
      "info"
    );
  };

  const handleResetReferralData = () => {
    onResetReferrals();
    setIsBankingSubmitted(false);
    setBankName('');
    setAccountNumber('');
    setAccountHolderName('');
    localStorage.removeItem('agent_bankName');
    localStorage.removeItem('agent_accountNumber');
    localStorage.removeItem('agent_accountHolderName');
    localStorage.removeItem('agent_isBankingSubmitted');
    onShowToast("All agent program data has been reset.");
  };

  return (
    <div id="referral-program-view" className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Banner Card */}
      <div className="relative overflow-hidden bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 md:p-8 shadow-md">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold tracking-wider uppercase">
              <Gift className="w-3.5 h-3.5" /> High-Paying Referral Agent Program
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Earn Big on TimeGiG
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Become a verified agent, share your custom link, and claim a <strong className="text-amber-600">R100.00 once-off reward</strong> along with a massive <strong className="text-emerald-600">50% cut of all referral wallet top-ups!</strong>
            </p>
          </div>

          <div className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 min-w-[200px] text-center shadow-xs">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Referral Rate</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">
              50%
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {validCount} Joined (Admin Split: 50/50)
            </p>
          </div>
        </div>
      </div>

      {/* Rules Dashboard Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3.5 items-start">
          <div className="w-6 h-6 flex items-center justify-center font-black text-indigo-600 text-lg shrink-0">
            1.
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-900">Verify Agent Status</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Top up at least <strong className="text-indigo-600">R20.00</strong> to get verified. This validates your account for security.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3.5 items-start">
          <div className="w-6 h-6 flex items-center justify-center font-black text-emerald-600 text-lg shrink-0">
            2.
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-900">Add Bank &amp; Share</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Submit your bank details to unlock your custom referral link. We pay commission directly to your account!
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-3.5 items-start">
          <div className="w-6 h-6 flex items-center justify-center font-black text-amber-600 text-lg shrink-0">
            3.
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-xs text-slate-900">Accumulate &amp; Cash Out</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cashout early at <strong className="text-amber-600">10 referrals</strong> (50% rate) or unlock maximum payouts at <strong className="text-emerald-600">20 referrals</strong> (50% rate + Bonus)!
            </p>
          </div>
        </div>
      </div>

      {/* Core Flow Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Verification and Bank Account Setup (Col-span-1) */}
        <div className="space-y-4 lg:col-span-1">
          {/* Step 1: Verification Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-500" /> 1. Verification
              </h3>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                isVerifiedAgent 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                {isVerifiedAgent ? 'Verified Agent' : 'Action Required'}
              </span>
            </div>

            {isVerifiedAgent ? (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 font-bold" />
                </div>
                <h4 className="font-bold text-xs text-emerald-800">You are Verified!</h4>
                <p className="text-[10px] text-emerald-600">
                  Your wallet has met the R20.00+ agent deposit criteria. Proceed to Bank details.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To prevent fraudulent referrals, you must topup <strong className="text-slate-900">R20.00</strong> or more in your TimeGiG wallet. This will activate your agent dashboard.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between text-[11px] items-center">
                  <span className="text-slate-500">Your wallet balance:</span>
                  <span className="font-bold text-slate-800">R{balance.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleQuickVerify}
                    className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    Instant Verify (Demo)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Bank Account Details Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-500" /> 2. Banking Details
            </h3>

            {!isVerifiedAgent ? (
              <div className="py-6 text-center space-y-2">
                <Lock className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400">Locked</p>
                <p className="text-[9px] text-slate-400">Verify your agent status to unlock banking details form.</p>
              </div>
            ) : isBankingSubmitted ? (
              <div className="space-y-3">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-indigo-500 mx-auto" />
                  <h4 className="font-bold text-xs text-indigo-800">Banking Configured</h4>
                  <p className="text-[10px] text-indigo-600">
                    Your South African bank details are saved. Your payout account is active.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-[10px] space-y-1 text-slate-600 border border-slate-100">
                  <p><span className="text-slate-400">Bank:</span> <strong className="text-slate-800">{bankName}</strong></p>
                  <p><span className="text-slate-400">Account No:</span> <strong className="text-slate-800">{accountNumber}</strong></p>
                  <p><span className="text-slate-400">Holder:</span> <strong className="text-slate-800">{accountHolderName}</strong></p>
                </div>

                <button
                  onClick={() => setIsBankingSubmitted(false)}
                  className="w-full text-center text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Edit Banking Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleBankSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Bank Name</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Local Bank...</option>
                    <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                    <option value="Capitec Bank">Capitec Bank</option>
                    <option value="Standard Bank">Standard Bank</option>
                    <option value="Nedbank">Nedbank</option>
                    <option value="Absa Bank">Absa Bank</option>
                    <option value="TymeBank">TymeBank</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Account Number</label>
                  <input
                    type="text"
                    pattern="[0-9]{7,13}"
                    title="Account number should be 7-13 digits"
                    placeholder="e.g. 62134567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Save &amp; Activate Agent
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Referrals & Payouts Engine (Col-span-2) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Custom Link & Share Box (Visible only after Bank setup) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-slate-900" /> 3. Share Your Agent Link
            </h3>

            {!isBankingSubmitted ? (
              <div className="py-6 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-100">
                <Lock className="w-6 h-6 text-slate-900 mx-auto" />
                <p className="text-[10px] font-bold text-slate-500">Link locked until bank setup completed</p>
                <p className="text-[9px] text-slate-400">We need your banking details to direct referral commissions correctly.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500">
                  Share this link with your network. When friends register and top up, your earnings grow instantly!
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-mono text-indigo-600 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Referral Progress and Cashout Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-500" /> Your Referrals &amp; Earnings
                </h3>
                <p className="text-[10px] text-slate-400">Track milestones and withdrawal statuses.</p>
              </div>

              {/* Simulation Helper Panel */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-bold text-slate-400">Simulation:</span>
                <button
                  onClick={() => handleSimulateReferral(1)}
                  className="px-2 py-1 text-[9px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
                >
                  +1 Referral
                </button>
                <button
                  onClick={() => handleSimulateReferral(10 - validCount > 0 ? 10 - validCount : 10)}
                  className="px-2 py-1 text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all border border-amber-100"
                  title="Adds enough referrals to unlock early cashout milestone"
                >
                  Reach 10 Refs
                </button>
                <button
                  onClick={() => handleSimulateReferral(20 - validCount > 0 ? 20 - validCount : 20)}
                  className="px-2 py-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-100"
                  title="Adds enough referrals to unlock maximum payouts milestone"
                >
                  Reach 20 Refs
                </button>
              </div>
            </div>

            {/* Milestones Tracker Progress Bar */}
            <div className="space-y-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span>Milestone Progress</span>
                <span className="text-indigo-600">{validCount} / 20 Referrals</span>
              </div>

              <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min((validCount / 20) * 100, 100)}%` }}
                />
                
                {/* 10 Referrals Milestone Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80" 
                  style={{ left: '50%' }}
                />
              </div>

              <div className="grid grid-cols-2 text-[10px] text-slate-500 pt-1">
                <div className={`space-y-0.5 ${validCount >= 10 ? 'text-amber-600 font-bold' : ''}`}>
                  <p className="flex items-center gap-1">
                    {validCount >= 10 ? <CheckCircle className="w-3 h-3 text-amber-500" /> : <Lock className="w-3 h-3 text-slate-400" />}
                    Milestone 1 (10 Referrals)
                  </p>
                  <p className="text-[9px] pl-4">Eligible for Early Cashout: 50% Rewards</p>
                </div>
                <div className={`space-y-0.5 text-right ${validCount >= 20 ? 'text-emerald-600 font-bold' : ''}`}>
                  <p className="flex items-center justify-end gap-1">
                    {validCount >= 20 ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3 text-slate-400" />}
                    Milestone 2 (20 Referrals)
                  </p>
                  <p className="text-[9px]">Eligible for Full Cashout: 50% Rewards + R100 Bonus</p>
                </div>
              </div>
            </div>

            {/* Earnings Breakdowns Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">Referral Stats Summary</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Referred Users:</span>
                    <span className="font-bold text-slate-800">{validCount} Users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Wallet Deposits:</span>
                    <span className="font-bold text-slate-800">R{totalReferralTopups.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reward Rate Activated:</span>
                    <span className="font-bold text-emerald-600">
                      50% (Standard)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-950 text-white rounded-2xl p-4 space-y-3 border border-indigo-900 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                
                <h4 className="font-bold text-[11px] text-indigo-300 uppercase tracking-wider">Withdrawable Balance</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Once-off reward:</span>
                    <span className="font-semibold text-slate-100">R{onceOffReward.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deposits Commission:</span>
                    <span className="font-semibold text-slate-100">R{commissionEarnings.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-indigo-800 my-1 pt-1.5 flex justify-between items-baseline">
                    <span className="text-indigo-200 font-bold">Total Earnings:</span>
                    <span className="text-lg font-black text-amber-400">R{totalEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cashout Request Action Button */}
            <div className="space-y-2 pt-1">
              {!isBankingSubmitted ? (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-bold">Payout account is not set up</p>
                    <p className="text-[9.5px]">You must complete and save your banking details in Section 2 before requesting withdrawals.</p>
                  </div>
                </div>
              ) : validCount < 10 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-500 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-slate-900 mt-0.5" />
                  <div>
                    <p className="font-bold">Milestone locked</p>
                    <p className="text-[9.5px]">You need at least 10 valid referrals to activate early cashout. Share your link above to start growing your network!</p>
                  </div>
                </div>
              ) : null}

              <button
                onClick={handleRequestCashout}
                disabled={!isBankingSubmitted || validCount < 10}
                className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  !isBankingSubmitted || validCount < 10
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                }`}
              >
                <Award className="w-4 h-4" />
                {validCount >= 20 
                  ? `Request Full Cashout (50% Rate + Bonus) - R${totalEarnings.toFixed(2)}` 
                  : validCount >= 10 
                    ? `Request Early Cashout (50% Rate) - R${totalEarnings.toFixed(2)}`
                    : 'Referrals Milestone Payout (Locked)'}
              </button>
            </div>
          </div>

          {/* List of Referred Users */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Your Referred Network</h4>
                <p className="text-[10px] text-slate-400">Total joined users: {referrals.length}</p>
              </div>
              {referrals.length > 0 && (
                <button
                  onClick={handleResetReferralData}
                  className="text-[10px] text-red-600 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Reset Program Data
                </button>
              )}
            </div>

            {referrals.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-[11px] space-y-1 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-6 h-6 text-slate-900 mx-auto" />
                <p className="font-bold text-slate-600">No referred users yet</p>
                <p className="text-[10px] text-slate-400">When people join through your custom link, they'll appear here.</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto pr-1 border border-slate-100 rounded-2xl divide-y divide-slate-100">
                {referrals.map((ref) => (
                  <div key={ref.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {ref.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-[11px]">{ref.email}</p>
                        <p className="text-[9px] text-slate-400">Joined on {ref.date}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900">Topped up R{(ref.topupAmount || 0).toFixed(2)}</p>
                      <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Active Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* Congratulations Popup modal for Banking submitted */}
        {showCongratsModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute left-0 bottom-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-950 tracking-tight">Congratulations! 🎉</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your banking details have been successfully verified and securely stored. Your custom referral engine is now fully activated!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] space-y-1 text-left text-slate-600 font-mono">
                <p><span className="text-slate-400">BANK:</span> <span className="font-bold text-slate-800">{bankName}</span></p>
                <p><span className="text-slate-400">AC NO:</span> <span className="font-bold text-slate-800">{accountNumber}</span></p>
                <p><span className="text-slate-400">HOLDER:</span> <span className="font-bold text-slate-800">{accountHolderName}</span></p>
              </div>

              <button
                onClick={() => setShowCongratsModal(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Let's Start Earning!
              </button>
            </motion.div>
          </div>
        )}

        {/* Payout Cashout Success Confirmation Modal */}
        {showCashoutSuccessModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <Award className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900 tracking-tight">Withdrawal Requested</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your agent payout of <strong className="text-slate-900">R{cashoutSuccessAmount.toFixed(2)}</strong> has been successfully submitted to the Admin portal for verification!
                </p>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 text-xs text-slate-500 space-y-1 text-left">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Requested Amount:</span>
                  <span className="text-indigo-600 font-mono">R{cashoutSuccessAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Status:</span>
                  <span className="font-semibold text-amber-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending Approval
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Bank Account:</span>
                  <span className="font-semibold text-slate-800">{bankName}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-normal italic">
                Tip: You can login as Admin (from More Menu) to instantly approve this withdrawal request!
              </p>

              <button
                onClick={() => setShowCashoutSuccessModal(false)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Understood, thank you!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
