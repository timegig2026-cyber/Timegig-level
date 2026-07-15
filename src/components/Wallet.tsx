import React, { useRef, useState } from 'react';
import { ArrowLeft, Wallet as WalletIcon, UploadCloud, CheckCircle } from 'lucide-react';
import { Proof } from '../types';

interface Transaction {
  id: number;
  label: string;
  amount: string;
  date: string;
}

const coinOptions = [
  { coins: 500, price: 'R5,00' },
  { coins: 1000, price: 'R10,00' },
  { coins: 2000, price: 'R20,00' },
  { coins: 3000, price: 'R30,00' },
  { coins: 6000, price: 'R60,00' },
  { coins: 8000, price: 'R80,00' },
  { coins: 10000, price: 'R100,00' },
  { coins: 40000, price: 'R400,00' },
];

export default function Wallet({ 
  onBack, 
  addProof, 
  balance, 
  setBalance,
  referralProfit
}: { 
  onBack: () => void, 
  addProof: (proof: Proof) => void,
  balance: number,
  setBalance: React.Dispatch<React.SetStateAction<number>>,
  referralProfit: number
}) {
  const [view, setView] = useState<'main' | 'options' | 'payment' | 'success'>('main');
  const [selectedOption, setSelectedOption] = useState<{coins: number, price: string} | null>(null);
  const [transactions] = useState<Transaction[]>([
    { id: 1, label: 'GiG Completed: Graphic Design', amount: '+500c', date: '2026-07-13' },
    { id: 2, label: 'Topup: 1000c', amount: '+1000c', date: '2026-07-10' },
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const handleSubmitProof = () => {
      if (uploadedFile && selectedOption) {
          addProof({
              id: Date.now(),
              user: 'CurrentUser',
              image: URL.createObjectURL(uploadedFile),
              status: 'pending',
              coins: selectedOption.coins,
              price: selectedOption.price
          });
          setView('success');
      }
  };

  if (view === 'success') {
    return (
      <div className="p-4 max-w-5xl mx-auto flex flex-col items-center justify-center h-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Review in progress</h2>
        <p className="text-slate-600 mt-2 mb-6">Your payment proof has been submitted. We will notify you once verified.</p>
        <button onClick={() => { setView('main'); onBack(); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold">Back to Wallet</button>
      </div>
    );
  }

  if (view === 'payment') {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <button onClick={() => setView('options')} className="flex items-center text-sm text-slate-900 mb-4 hover:opacity-80 transition-opacity"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Options</button>
        <h2 className="text-xl font-bold mb-4 text-slate-900">Pay via Bank Transfer</h2>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-slate-700"><strong>Bank:</strong> Capitec</p>
          <p className="text-slate-700"><strong>Account name:</strong> Matthews</p>
          <p className="text-slate-700"><strong>Account number:</strong> 1334067366</p>
          <p className="text-slate-700"><strong>Ref:</strong> {selectedOption?.coins}c</p>
          <div className="mt-6 border-t pt-4">
             <label className="block text-sm font-medium text-slate-700 mb-2">Upload Proof of Payment</label>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400"
             >
                <UploadCloud className="w-8 h-8 text-slate-900 mx-auto" />
                <p className="text-slate-500 text-sm mt-2">{uploadedFile ? uploadedFile.name : 'Click or drag to upload'}</p>
             </div>
             <button 
                onClick={handleSubmitProof} 
                disabled={!uploadedFile}
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50"
             >
                {uploadedFile ? 'Submit Proof' : 'Select a file to continue'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'options') {
    return (
      <div className="p-4 max-w-5xl mx-auto">
        <button onClick={() => setView('main')} className="flex items-center text-sm text-slate-900 mb-4 hover:opacity-80 transition-opacity"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Wallet</button>
        <h2 className="text-xl font-bold mb-4 text-slate-900">Select Coin Option</h2>
        <div className="grid grid-cols-2 gap-3">
          {coinOptions.map((opt, i) => (
            <button key={i} onClick={() => { setSelectedOption(opt); setView('payment'); }} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left hover:border-indigo-400">
              <p className="font-bold text-lg text-indigo-700">{opt.coins}c</p>
              <p className="text-sm text-slate-500">{opt.price}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2"><WalletIcon className="w-6 h-6" /> Wallet</h2>
      <div className="bg-indigo-700 text-white p-6 rounded-2xl mb-6 shadow-lg space-y-4">
        <div>
          <p className="text-indigo-200 text-sm uppercase font-bold tracking-wider">Coin Balance</p>
          <p className="text-4xl font-bold">{balance}c</p>
        </div>
        <div className="pt-4 border-t border-indigo-600/50">
          <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-widest">Agents Referral Profit</p>
          <p className="text-2xl font-bold">R{referralProfit.toLocaleString()}</p>
        </div>
        <button onClick={() => setView('options')} className="w-full mt-2 py-2.5 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Topup</button>
      </div>
      <h3 className="font-bold text-slate-900 mb-3">Transactions</h3>
      <div className="space-y-3">
        {transactions.map(t => (
          <div key={t.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-900">{t.label}</p>
              <p className="text-xs text-slate-500">{t.date}</p>
            </div>
            <p className="font-bold text-indigo-600">{t.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
