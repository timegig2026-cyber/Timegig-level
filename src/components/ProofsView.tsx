import React, { useState } from 'react';
import { ArrowLeft, Check, X, Maximize2, XCircle } from 'lucide-react';
import { Proof } from '../types';

export default function ProofsView({ 
  proofs, 
  onApprove, 
  onReject, 
  onBack 
}: { 
  proofs: Proof[], 
  onApprove: (id: number) => void, 
  onReject: (id: number) => void, 
  onBack: () => void 
}) {
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center text-sm text-slate-500 mb-4 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4 text-slate-900">Proof of Payment Documents</h2>
      <div className="space-y-3">
        {proofs.map(proof => (
          <div key={proof.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <img src={proof.image} alt="Proof" className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setFullScreenImage(proof.image)} />
              <div>
                <p className="text-sm font-semibold text-slate-900">{proof.user}</p>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <p className="text-xs text-slate-500 capitalize">Status: {proof.status}</p>
                  {proof.coins && proof.price && (
                    <p className="text-xs text-indigo-600 font-semibold">Requested: {proof.coins}c for {proof.price}</p>
                  )}
                </div>
              </div>
            </div>
            {proof.status === 'pending' && (
              <div className="flex items-center gap-2">
                <button onClick={() => onApprove(proof.id)} className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                  <Check className="w-5 h-5" />
                </button>
                <button onClick={() => onReject(proof.id)} className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {fullScreenImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <button onClick={() => setFullScreenImage(null)} className="absolute top-4 right-4 text-white hover:text-slate-300">
            <XCircle className="w-8 h-8" />
          </button>
          <img src={fullScreenImage} alt="Full screen" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
