'use client';

import React, { useState } from 'react';
import { Modal } from './modal';
import { PaymentMethod, MoMoNetwork, Policy } from '@/types';
import { PaymentMethodSelector } from '../forms/payment-method-selector';
import { MoMoPaymentForm } from '../forms/momo-payment-form';
import { usePaymentStore } from '@/stores/payment-store';
import { Button } from './button';
import { Spinner } from './spinner';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    policy: Policy;
}

type Step = 'method' | 'details' | 'processing' | 'success' | 'error';

export function PaymentProcessModal({
    isOpen,
    onClose,
    policy,
}: PaymentProcessModalProps) {
    const [step, setStep] = useState<Step>('method');
    const [method, setMethod] = useState<PaymentMethod>('mobile_money');
    const [network, setNetwork] = useState<MoMoNetwork>('mtn');
    const [phone, setPhone] = useState('');

    const { isProcessing, processMoMoPayment } = usePaymentStore();

    const handleNext = async () => {
        if (step === 'method' && method === 'mobile_money') {
            setStep('details');
        } else if (step === 'details') {
            setStep('processing');
            const success = await processMoMoPayment({
                policyId: policy.id,
                policyNumber: policy.policyNumber,
                clientId: policy.clientId,
                clientName: policy.clientName,
                amount: policy.premiumAmount,
                currency: policy.currency,
                method: 'mobile_money',
                momoNetwork: network,
                phoneNumber: phone,
                reference: `PREM-${policy.policyNumber.split('/').pop()}`,
                description: `Premium payment for ${policy.insuranceType} policy`,
            });

            if (success) {
                setStep('success');
            } else {
                setStep('error');
            }
        }
    };

    const reset = () => {
        setStep('method');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={reset}
            title={step === 'processing' ? 'Processing Payment' : 'Make a Payment'}
            className="overflow-hidden"
        >
            <div className="relative">
                {/* Step Indicator */}
                <div className="flex gap-1 mb-8">
                    {['method', 'details', 'success'].map((s, i) => (
                        <div
                            key={s}
                            className={cn(
                                "h-1 rounded-full transition-all duration-500",
                                step === s || (step === 'details' && i === 0) || (step === 'processing' && i <= 1) || (step === 'success' && i <= 2)
                                    ? "bg-primary w-8"
                                    : "bg-slate-100 w-4"
                            )}
                        />
                    ))}
                </div>

                {step === 'method' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Choose how to pay</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Securely pay your premium for policy <span className="text-slate-900 font-medium">{policy.policyNumber}</span>
                            </p>
                        </div>
                        <PaymentMethodSelector
                            selectedMethod={method}
                            onSelect={setMethod}
                        />
                    </div>
                )}

                {step === 'details' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900">MoMo Details</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Enter your mobile money number to receive a payment prompt
                            </p>
                        </div>
                        <MoMoPaymentForm
                            network={network}
                            phoneNumber={phone}
                            onNetworkChange={setNetwork}
                            onPhoneChange={setPhone}
                        />
                    </div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                            <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse" />
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Spinner size="lg" className="text-primary" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Waiting for prompt...</h3>
                        <p className="text-sm text-slate-500 mt-2 text-center max-w-[280px]">
                            Check your phone <span className="font-bold text-slate-900">+233 {phone}</span> for the authorization request.
                        </p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-700">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
                            <CheckCircle2 size={48} strokeWidth={2.5} className="animate-in zoom-in spin-in-12 duration-1000" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Payment Successful</h3>
                        <p className="text-sm text-slate-500 mt-2 text-center">
                            Premium for <span className="font-medium text-slate-900">{policy.policyNumber}</span> has been received.
                        </p>

                        <div className="mt-8 p-4 bg-transparent rounded-2xl w-full border border-[var(--glass-border)] border-dashed">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-bold text-slate-900">{policy.premiumAmount} {policy.currency}</span>
                            </div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-500">Method</span>
                                <span className="font-bold text-slate-900 uppercase">{network} MoMo</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Reference</span>
                                <span className="font-mono text-slate-600 truncate max-w-[120px]">PREM-{policy.policyNumber.split('/').pop()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                {step !== 'processing' && (
                    <div className="mt-10 flex gap-3">
                        {step !== 'success' && step !== 'error' ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={step === 'details' ? () => setStep('method') : onClose}
                                >
                                    {step === 'details' ? 'Back' : 'Cancel'}
                                </Button>
                                <Button
                                    className="flex-[1.5]"
                                    onClick={handleNext}
                                    disabled={step === 'details' && !phone}
                                >
                                    {step === 'details' ? 'Authorize Payment' : 'Next'}
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </>
                        ) : (
                            <Button className="w-full" onClick={reset}>
                                Got it
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Liquid Background Effect (Glassmorphism) */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-slate-400/5 rounded-full blur-3xl pointer-events-none" />
        </Modal>
    );
}
