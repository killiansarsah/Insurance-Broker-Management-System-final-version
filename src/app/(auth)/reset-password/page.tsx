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
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 mx-auto lg:mx-0"
                            >
                                <Lock className="text-primary-600" size={32} />
                            </motion.div>
                            <h1 className="text-3xl font-extrabold text-surface-900 mb-3 tracking-tight">New Password</h1>
                            <p className="text-surface-600 text-lg font-medium leading-relaxed">
                                Please create a strong password to secure your account access.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                            <Input
                                label="New Password"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock size={20} />}
                                className="bg-white"
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-2 -mr-1 text-surface-400 hover:text-primary-600 focus:outline-none transition-colors cursor-pointer rounded-full hover:bg-surface-100"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                }
                            />
                            <Input
                                label="Confirm Password"
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                leftIcon={<Lock size={20} />}
                                className="bg-white"
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary-500/10 rounded-2xl mt-4 transition-transform active:scale-[0.98]"
                                isLoading={isLoading}
                            >
                                Secure My Account
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
                        <h1 className="text-3xl font-extrabold text-surface-900 mb-4 tracking-tight">Success!</h1>
                        <p className="text-surface-600 text-lg font-medium mb-10 leading-relaxed px-4">
                            Your password has been successfully updated. You can now access your dashboard.
                        </p>
                        <Button
                            size="lg"
                            className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary-500/10"
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
