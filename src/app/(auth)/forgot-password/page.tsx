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
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-surface-200 p-8"
            >
                {!isSubmitted ? (
                    <>
                        <div className="mb-8">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 transition-colors mb-6"
                            >
                                <ArrowLeft size={16} />
                                Back to login
                            </Link>
                            <h1 className="text-2xl font-bold text-surface-900 mb-2">Forgot Password?</h1>
                            <p className="text-surface-600 text-sm">
                                No worries, we'll send you reset instructions.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email Address"
                                placeholder="name@company.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail size={18} />}
                            />
                            <Button type="submit" className="w-full h-11" isLoading={isLoading}>
                                Reset Password
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full bg-success-50 text-success-500 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-surface-900 mb-2">Check your email</h1>
                        <p className="text-surface-600 text-sm mb-8">
                            We've sent a password reset link to <span className="font-semibold">{email}</span>
                        </p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsSubmitted(false)}
                        >
                            Didn't receive it? Click to retry
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
