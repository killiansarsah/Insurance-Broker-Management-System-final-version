'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, CreditCard, Building2, Wallet } from 'lucide-react';
import { PaymentMethod } from '@/types';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

const METHODS: {
    id: PaymentMethod;
    label: string;
    icon: any;
    description: string;
    vibrantColor: string;
    lightColor: string;
    brandColorClass: string;
}[] = [
        {
            id: 'mobile_money',
            label: 'Mobile Money',
            icon: Smartphone,
            description: 'MTN, Telecel, AirtelTigo',
            vibrantColor: 'bg-amber-400',
            lightColor: 'bg-amber-50',
            brandColorClass: 'text-amber-600',
        },
        {
            id: 'card',
            label: 'Card Payment',
            icon: CreditCard,
            description: 'Visa, Mastercard, AMEX',
            vibrantColor: 'bg-blue-500',
            lightColor: 'bg-blue-50',
            brandColorClass: 'text-blue-600',
        },
        {
            id: 'bank_transfer',
            label: 'Bank Transfer',
            icon: Building2,
            description: 'Direct Deposit / Transfer',
            vibrantColor: 'bg-indigo-500',
            lightColor: 'bg-indigo-50',
            brandColorClass: 'text-indigo-600',
        },
        {
            id: 'cash',
            label: 'Cash/Cheque',
            icon: Wallet,
            description: 'Physical payment receipting',
            vibrantColor: 'bg-emerald-500',
            lightColor: 'bg-emerald-50',
            brandColorClass: 'text-emerald-600',
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
                            'group relative flex items-start gap-4 p-5 rounded-[var(--radius-2xl)] border transition-all duration-500 text-left overflow-hidden',
                            isSelected
                                ? 'bg-white border-primary ring-2 ring-primary/20 shadow-xl shadow-primary/10'
                                : 'bg-white/50 border-surface-200 hover:border-primary/50 hover:bg-white hover:shadow-lg'
                        )}
                    >
                        {/* Interactive Background Glow */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className={cn("absolute inset-0 opacity-5 pointer-events-none", method.vibrantColor)}
                                />
                            )}
                        </AnimatePresence>

                        <div className="relative flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                animate={isSelected ? {
                                    y: [0, -3, 0],
                                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                } : {}}
                                className={cn(
                                    'p-3 rounded-2xl transition-all duration-500 shadow-sm',
                                    isSelected
                                        ? cn(method.vibrantColor, 'text-white shadow-lg')
                                        : cn(method.lightColor, method.brandColorClass, 'opacity-80 group-hover:opacity-100')
                                )}
                            >
                                <Icon size={24} strokeWidth={isSelected ? 2.5 : 2} />
                            </motion.div>
                        </div>

                        <div className="flex-1 relative z-10">
                            <h4 className={cn(
                                'font-bold text-sm transition-colors',
                                isSelected ? 'text-primary' : 'text-surface-900'
                            )}>
                                {method.label}
                            </h4>
                            <p className="text-xs text-surface-500 mt-1 line-clamp-1 font-medium">
                                {method.description}
                            </p>
                        </div>

                        <div className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10',
                            isSelected ? 'border-primary bg-primary shadow-inner shadow-black/10' : 'border-surface-300'
                        )}>
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
