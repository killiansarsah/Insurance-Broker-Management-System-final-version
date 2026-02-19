'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-6 lg:p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl shadow-surface-900/5 border border-surface-200 p-8 lg:p-10"
            >
                {!isSubmitted ? (
                    <div className="flex flex-col">
                        <div className="mb-10 text-center lg:text-left">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-all mb-8 group"
                            >
                                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                Back to login
                            </Link>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 mx-auto lg:mx-0"
                            >
                                <Mail className="text-primary-600" size={32} />
                            </motion.div>

                            <h1 className="text-3xl font-extrabold text-surface-900 mb-3 tracking-tight">Recover Access</h1>
                            <p className="text-surface-600 text-lg font-medium leading-relaxed">
                                Enter your email and we&apos;ll send you instructions to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
                            <Input
                                label="Registered Email"
                                placeholder="name@insurance-firm.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail size={20} />}
                                className="bg-white"
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary-500/10 rounded-2xl transition-transform active:scale-[0.98]"
                                isLoading={isLoading}
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="text-center py-4 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-20 h-20 rounded-full bg-success-50 text-success-600 flex items-center justify-center mb-8 shadow-inner"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h1 className="text-3xl font-extrabold text-surface-900 mb-4 tracking-tight">Check your email</h1>
                        <p className="text-surface-600 text-lg font-medium mb-10 leading-relaxed px-4">
                            Instructions have been sent to <span className="text-surface-900 font-bold underline decoration-success-500 underline-offset-4">{email}</span>.
                        </p>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full h-14 rounded-2xl border-2 font-bold"
                            onClick={() => setIsSubmitted(false)}
                        >
                            Didn&apos;t receive it? Retry
                        </Button>
                    </div>
                )}
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-sm font-medium text-surface-500"
            >
                &copy; {new Date().getFullYear()} IBMS Ghana. Secure Recovery System.
            </motion.p>
        </div>
    );
}
