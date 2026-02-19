'use client';

import { useState } from 'react';
import Image from 'next/image';
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
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900">
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
                        <div className="w-10 h-10 relative rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden">
                            <Image
                                src="/logo.png"
                                alt="IBMS Logo"
                                fill
                                className="object-contain p-1.5"
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">IBMS</span>
                    </motion.div>

                    <div className="max-w-xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-6xl font-extrabold leading-[1.1] mb-8 tracking-tight"
                        >
                            Insurance Management, <br />
                            <span className="text-primary-400">Perfected.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-xl text-primary-100/90 mb-10 leading-relaxed font-light"
                        >
                            The definitive platform for Ghana&apos;s insurance ecosystem.
                            Compliant, efficient, and built for market leaders.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Badge variant="outline" className="bg-white/5 border-white/10 py-2 px-4 text-sm">
                                NIC Compliant
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 py-2 px-4 text-sm">
                                RBAC Security
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 py-2 px-4 text-sm">
                                Cloud Infrastructure
                            </Badge>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-sm font-medium tracking-wide text-primary-200"
                    >
                        &copy; {new Date().getFullYear()} IBMS GHANA. PLATFORM VERSION 1.0.0
                    </motion.div>
                </div>
            </div>

            {/* Right side: Clean Login Form in a focused card */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-surface-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[460px] bg-white rounded-[32px] shadow-2xl shadow-surface-900/5 border border-surface-200 p-8 lg:p-12"
                >
                    <div className="flex flex-col">
                        <div className="mb-10 flex flex-col items-start">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-20 h-20 relative mb-6"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="IBMS Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-surface-900 mb-3 tracking-tight">
                                Portal Login
                            </h1>
                            <p className="text-surface-600 text-lg font-medium leading-relaxed">
                                Access your secure brokerage ecosystem
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-5 w-full">
                                <Input
                                    label="Work Email"
                                    placeholder="name@insurance-firm.com"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    leftIcon={<Mail size={20} />}
                                    className="bg-white"
                                />
                                <Input
                                    label="Secure Password"
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
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center gap-3 cursor-pointer select-none group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="peer w-5 h-5 rounded border-2 border-surface-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer appearance-none checked:bg-primary-600 checked:border-primary-600"
                                        />
                                        <svg
                                            className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-surface-600 group-hover:text-surface-900 transition-colors">Keep me signed in</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-all hover:underline"
                                >
                                    Reset credentials
                                </Link>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-4 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-3 text-danger-700 text-sm"
                                    >
                                        <Info size={20} className="shrink-0 text-danger-500" />
                                        <p className="font-medium leading-relaxed">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary-500/20 rounded-2xl mt-4 transition-transform active:scale-[0.98]"
                                isLoading={isLoading}
                            >
                                Sign Into Dashboard
                            </Button>
                        </form>
                    </div>

                    <div className="mt-12 pt-8 border-t border-surface-100">
                        <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shrink-0 shadow-sm">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-surface-900 mb-1">QA/Demo Access</p>
                                <p className="text-xs text-surface-500 leading-relaxed font-medium">
                                    Auth is currently bypassed for <code className="bg-white px-1.5 py-0.5 rounded text-primary-700 border border-surface-200">admin@ibms.com</code>.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
