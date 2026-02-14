'use client';

import React from 'react';
import { PaymentMethod } from '@/types';
import { Smartphone, CreditCard, Building2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

const METHODS: { id: PaymentMethod; label: string; icon: any; description: string }[] = [
    {
        id: 'mobile_money',
        label: 'Mobile Money',
        icon: Smartphone,
        description: 'MTN, Telecel, AirtelTigo',
    },
    {
        id: 'card',
        label: 'Card Payment',
        icon: CreditCard,
        description: 'Visa, Mastercard, AMEX',
    },
    {
        id: 'bank_transfer',
        label: 'Bank Transfer',
        icon: Building2,
        description: 'Direct Deposit / Transfer',
    },
    {
        id: 'cash',
        label: 'Cash/Cheque',
        icon: Wallet,
        description: 'Physical payment receipting',
    },
];

export function PaymentMethodSelector({ selectedMethod, onSelect }: PaymentMethodSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={cn(
                            'flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left group',
                            isSelected
                                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                : 'bg-white/50 border-slate-200 hover:border-primary/50 hover:bg-white'
                        )}
                    >
                        <div className={cn(
                            'p-2.5 rounded-lg transition-colors',
                            isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'
                        )}>
                            <Icon size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className={cn(
                                'font-semibold text-sm transition-colors',
                                isSelected ? 'text-primary' : 'text-slate-900'
                            )}>
                                {method.label}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {method.description}
                            </p>
                        </div>
                        <div className={cn(
                            'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                            isSelected ? 'border-primary bg-primary' : 'border-slate-300'
                        )}>
                            {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
