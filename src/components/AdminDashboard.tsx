import React, { useState } from 'react';
import ProofsView from './ProofsView';
import AgentCashoutsView from './AgentCashoutsView';
import { Proof, AgentCashout } from '../types';

interface Stat {
  label: string;
  value: string;
  color: string;
}

export default function AdminDashboard({ 
  proofs, 
  stats, 
  onApproveProof,
  onRejectProof,
  onResetDashboard,
  agentCashouts,
  onApproveAgentCashout,
  onRejectAgentCashout
}: { 
  proofs: Proof[], 
  stats: Stat[], 
  onApproveProof: (id: number) => void,
  onRejectProof: (id: number) => void,
  onResetDashboard: () => void,
  agentCashouts: AgentCashout[],
  onApproveAgentCashout: (id: string) => void,
  onRejectAgentCashout: (id: string) => void
}) {
  const [view, setView] = useState<'dashboard' | 'proofs' | 'cashouts'>('dashboard');

  if (view === 'proofs') {
    return <ProofsView proofs={proofs} onApprove={onApproveProof} onReject={onRejectProof} onBack={() => setView('dashboard')} />;
  }

  if (view === 'cashouts') {
    return (
      <AgentCashoutsView 
        cashouts={agentCashouts} 
        onApprove={onApproveAgentCashout} 
        onReject={onRejectAgentCashout} 
        onBack={() => setView('dashboard')} 
      />
    );
  }

  const handleReset = () => {
    onResetDashboard();
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Admin Dashboard</h2>
        <button onClick={handleReset} className="text-sm text-red-600 hover:text-red-800 font-medium">Reset All Data</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat) => {
          const isClickable = stat.label === 'Proof of Payment' || stat.label === 'Total Owed to Agents';
          return (
            <div key={stat.label} 
              className={`bg-white p-3 rounded-xl border border-slate-200 border-l-4 ${stat.color} shadow-sm ${isClickable ? 'cursor-pointer hover:bg-slate-50 transition-colors' : ''}`}
              onClick={() => {
                  if (stat.label === 'Proof of Payment') setView('proofs');
                  if (stat.label === 'Total Owed to Agents') setView('cashouts');
              }}
            >
              <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{stat.value}</p>
              {isClickable && (
                <p className="text-[9px] text-indigo-500 mt-1 font-bold">Click to view &rarr;</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
