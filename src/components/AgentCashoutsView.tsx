import React from 'react';
import { ArrowLeft, Check, X, CreditCard, Calendar, User, Award, ShieldAlert } from 'lucide-react';
import { AgentCashout } from '../types';

interface AgentCashoutsViewProps {
  cashouts: AgentCashout[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBack: () => void;
}

export default function AgentCashoutsView({
  cashouts,
  onApprove,
  onReject,
  onBack,
}: AgentCashoutsViewProps) {
  const pendingCashouts = cashouts.filter((c) => c.status === 'pending');
  const historyCashouts = cashouts.filter((c) => c.status !== 'pending');

  return (
    <div id="agent-cashouts-view" className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>
        <span className="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">
          Admin Portal
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Agent Cashout Requests</h2>
        <p className="text-xs text-slate-500">
          Review, approve, or reject withdrawal requests from verified referral agents.
        </p>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Pending Verification ({pendingCashouts.length})
        </h3>

        {pendingCashouts.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No pending cashouts</p>
            <p className="text-[10px] text-slate-500">
              When referral agents request withdrawals, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingCashouts.map((cashout) => (
              <div
                key={cashout.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {cashout.agentName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        {cashout.agentName}
                        <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase">
                          Agent
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500">{cashout.agentEmail}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">R{cashout.amount.toFixed(2)}</p>
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        cashout.isEarly
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}
                    >
                      {cashout.isEarly ? 'Early Cashout (10 Refs)' : 'Full Cashout (20 Refs)'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Bank Details */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                    <p className="font-bold text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Banking Details
                    </p>
                    <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                      <span className="text-slate-500">Bank Name:</span>
                      <span className="font-semibold text-slate-800">{cashout.bankName || 'N/A'}</span>
                      <span className="text-slate-500">Account No:</span>
                      <span className="font-mono font-semibold text-slate-800">{cashout.accountNumber || 'N/A'}</span>
                      <span className="text-slate-500">Holder:</span>
                      <span className="font-semibold text-slate-800">{cashout.accountHolderName || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Calculations Details */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                    <p className="font-bold text-[10px] text-slate-500 uppercase flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" /> Earnings Math
                    </p>
                    <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                      <span className="text-slate-500">Reward Part:</span>
                      <span className="font-semibold text-slate-800">
                        R{cashout.isEarly ? '25.00' : '100.00'} ({cashout.isEarly ? '25%' : '100%'})
                      </span>
                      <span className="text-slate-500">Topup Part:</span>
                      <span className="font-semibold text-slate-800">
                        R{(cashout.amount - (cashout.isEarly ? 25 : 100)).toFixed(2)} ({cashout.isEarly ? '25%' : '50%'})
                      </span>
                      <span className="text-slate-500">Total Calculation:</span>
                      <span className="font-bold text-slate-900">R{cashout.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Requested on {cashout.date}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(cashout.id)}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => onApprove(cashout.id)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 border border-emerald-100"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve &amp; Pay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Cashout History ({historyCashouts.length})
        </h3>

        {historyCashouts.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic">No processed cashout history found.</p>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
            {historyCashouts.map((cashout) => (
              <div key={cashout.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      cashout.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {cashout.status === 'approved' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-[11px]">
                      {cashout.agentName} ({cashout.isEarly ? 'Early' : 'Full'})
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {cashout.agentEmail} • {cashout.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">R{cashout.amount.toFixed(2)}</p>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      cashout.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {cashout.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
