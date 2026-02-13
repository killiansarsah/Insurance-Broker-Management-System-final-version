'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

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
                            <h1 className="text-2xl font-bold text-surface-900 mb-2">Set New Password</h1>
                            <p className="text-surface-600 text-sm">
                                Your new password must be different from previous passwords.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative">
                                <Input
                                    label="New Password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    leftIcon={<Lock size={18} />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <Input
                                label="Confirm Password"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<Lock size={18} />}
                            />
                            <Button type="submit" className="w-full h-11" isLoading={isLoading}>
                                Update Password
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 rounded-full bg-success-50 text-success-500 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-surface-900 mb-2">Password reset</h1>
                        <p className="text-surface-600 text-sm mb-8">
                            Your password has been successfully reset. You can now log in with your new password.
                        </p>
                        <Button
                            className="w-full"
                            onClick={() => router.push('/login')}
                        >
                            Continue to Login
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
