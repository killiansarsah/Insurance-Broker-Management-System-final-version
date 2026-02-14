'use client';

import React from 'react';
import { MoMoNetwork } from '@/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface MoMoPaymentFormProps {
    network: MoMoNetwork;
    phoneNumber: string;
    onNetworkChange: (network: MoMoNetwork) => void;
    onPhoneChange: (phone: string) => void;
}

const NETWORKS: { id: MoMoNetwork; label: string; color: string; logo?: string }[] = [
    { id: 'mtn', label: 'MTN MoMo', color: 'bg-[#FFCC00] text-black' },
    { id: 'telecel', label: 'Telecel Cash', color: 'bg-[#E60000] text-white' },
    { id: 'airteltigo', label: 'AT Money', color: 'bg-[#003399] text-white' },
];

export function MoMoPaymentForm({
    network,
    phoneNumber,
    onNetworkChange,
    onPhoneChange,
}: MoMoPaymentFormProps) {
    return (
        <div className="space-y-6 py-2">
            <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Choose Network Provider
                </label>
                <div className="flex gap-3">
                    {NETWORKS.map((n) => (
                        <button
                            key={n.id}
                            type="button"
                            onClick={() => onNetworkChange(n.id)}
                            className={cn(
                                'flex-1 p-3 rounded-xl border relative transition-all duration-300 flex flex-col items-center gap-2 group overflow-hidden',
                                network === n.id
                                    ? 'border-primary ring-1 ring-primary'
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                            )}
                        >
                            <div className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-110 transition-transform',
                                n.color
                            )}>
                                {n.id === 'mtn' ? 'MTN' : n.id === 'telecel' ? 'TC' : 'AT'}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                {n.label}
                            </span>

                            {network === n.id && (
                                <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 animate-in zoom-in">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Mobile Number
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none border-r pr-2 border-slate-200 group-focus-within:border-primary/30 transition-colors">
                        <span className="text-sm font-bold text-slate-400">+233</span>
                    </div>
                    <input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        placeholder="24 000 0000"
                        className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5 ml-1">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    Ensure the phone is registered for Mobile Money
                </p>
            </div>
        </div>
    );
}
