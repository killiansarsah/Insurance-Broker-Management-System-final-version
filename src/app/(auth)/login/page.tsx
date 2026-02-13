'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, isLoading } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Hint: use admin@ibms.com / any password');
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left side: Premium Branding & Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900 overflow-hidden">
                {/* Animated Mesh Gradient Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-600 blur-[100px] opacity-40 animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-success-600 blur-[100px] opacity-20 animate-pulse delay-700" />
                    <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-accent-600 blur-[80px] opacity-20 animate-pulse delay-500" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                            <Shield className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">IBMS</span>
                    </motion.div>

                    <div className="max-w-md">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-5xl font-bold leading-tight mb-6"
                        >
                            Insurance Management, <br />
                            <span className="text-primary-400">Perfected.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg text-primary-100 mb-8"
                        >
                            The definitive platform for Ghana's insurance ecosystem.
                            Compliant, efficient, and built for growth.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Badge variant="outline" className="bg-white/5 border-white/10 py-1.5 px-3">
                                NIC Compliant
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 py-1.5 px-3">
                                RBAC Security
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 py-1.5 px-3">
                                Cloud Ready
                            </Badge>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-sm text-primary-200"
                    >
                        &copy; {new Date().getFullYear()} IBMS Ghana. All rights reserved.
                    </motion.div>
                </div>
            </div>

            {/* Right side: Clean Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-surface-900 mb-2">Welcome Back</h1>
                        <p className="text-surface-600">Enter your credentials to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                label="Email Address"
                                placeholder="name@company.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail size={18} />}
                                className="bg-white"
                            />
                            <div className="relative">
                                <Input
                                    label="Password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    leftIcon={<Lock size={18} />}
                                    className="bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                                />
                                <span className="text-sm text-surface-600">Remember me</span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3 rounded-md bg-danger-50 border border-danger-100 flex items-start gap-2 text-danger-700 text-sm"
                                >
                                    <Info size={16} className="mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-surface-200 text-center">
                        <p className="text-sm text-surface-500">
                            Need assistance?{' '}
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
                                Contact IT Support
                            </a>
                        </p>
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-primary-50 border border-primary-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                            <Info size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-primary-900 mb-0.5">Development Access</p>
                            <p className="text-[11px] text-primary-700 leading-normal">
                                Use <code className="bg-primary-200 px-1 rounded">admin@ibms.com</code> to bypass authentication in this demo.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
