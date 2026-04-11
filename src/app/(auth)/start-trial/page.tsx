'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Clock3, ShieldCheck, TrendingUp, Mail, Phone, Lock, Building2, User as UserIcon, Eye, EyeOff, Cpu } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { GradientBackground } from '@/components/ui/gradient-background';
import { LiquidFilters } from '@/components/ui/liquid-filters';

interface StartTrialResponse {
    success: boolean;
    tenantSlug: string;
    email: string;
    trialEndsAt: string;
    message: string;
}

export default function StartTrialPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [form, setForm] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    // Hex Background & Cursor Logic (Synced with Landing)
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const supportsPointerEffects = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        const enableHeavyEffects = supportsPointerEffects && !prefersReducedMotion && window.innerWidth >= 1024;

        let mx = 0, my = 0, rx = 0, ry = 0;
        let pId: number;

        const handleMouseMove = (e: MouseEvent) => {
            mx = e.clientX; my = e.clientY;
            if (cursorRef.current) {
                cursorRef.current.style.left = mx + 'px';
                cursorRef.current.style.top = my + 'px';
            }
        };

        const animRing = () => {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.left = rx + 'px';
                ringRef.current.style.top = ry + 'px';
            }
            pId = requestAnimationFrame(animRing);
        };

        if (enableHeavyEffects) {
            window.addEventListener('mousemove', handleMouseMove);
            animRing();
        }

        const canvas = canvasRef.current;
        let cId: number;
        
        if (canvas && enableHeavyEffects) {
            const ctx = canvas.getContext('2d');
            let hexes: Array<{ x: number; y: number; size: number; alpha: number; phase: number; speed: number }> = [];
            const buildHexes = () => {
                if (!canvas || !ctx) return;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                hexes = [];
                const size = 36, cols = Math.ceil(canvas.width / (size * 1.75)) + 2, rows = Math.ceil(canvas.height / (size * 2)) + 2;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const x = c * size * 1.75 + (r % 2) * size * 0.875, y = r * size * 1.5;
                        hexes.push({ x, y, size, alpha: Math.random() * 0.4, phase: Math.random() * Math.PI * 2, speed: 0.003 + Math.random() * 0.004 });
                    }
                }
            };
            const drawHex = (x: number, y: number, s: number, a: number) => {
                if (!ctx) return;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const ang = (Math.PI / 180) * 60 * i - Math.PI / 6;
                    ctx.lineTo(x + s * Math.cos(ang), y + s * Math.sin(ang));
                }
                ctx.closePath();
                ctx.strokeStyle = `rgba(59,130,246,${a})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            };
            const animate = () => {
                if (!ctx || !canvas) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                hexes.forEach(h => {
                    h.phase += h.speed;
                    const a = h.alpha * (0.4 + 0.6 * Math.sin(h.phase));
                    drawHex(h.x, h.y, h.size, a);
                });
                cId = requestAnimationFrame(animate);
            };
            window.addEventListener('resize', buildHexes);
            buildHexes();
            animate();
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(pId);
            cancelAnimationFrame(cId);
        };
    }, []);

    const onChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validatePhone = (phone: string) => {
        return /^\d{10}$/.test(phone);
    };

    const validatePassword = (password: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validatePhone(form.phone)) {
            setError('Phone must be 10 digits.');
            return;
        }

        if (!validatePassword(form.password)) {
            setError('Password requirements: 8+ chars, upper, lower, number, symbol.');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                companyName: form.companyName.trim(),
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || undefined,
                password: form.password,
            };

            const result = await apiClient.post<StartTrialResponse>('/auth/start-trial', payload);
            await login(payload.email, payload.password, result.tenantSlug);
            
            // Success Overlay Sequence
            setShowSuccessOverlay(true);
            setTimeout(() => {
                toast.success('System Online!');
                router.push('/dashboard');
            }, 3500);
            
        } catch (err: any) {
            const message = err?.response?.data?.message;
            setError(Array.isArray(message) ? message.join(', ') : (message || 'Registration failed.'));
            setIsSubmitting(false);
        }
    };

    const isPhoneValid = form.phone.length === 10;
    const isPhoneTyping = form.phone.length > 0;

    return (
        <div className="relative h-screen w-full bg-slate-50 dark:bg-[#020617] flex flex-col lg:flex-row overflow-hidden transition-colors duration-700">
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-25 dark:opacity-10 z-0" />
            <div ref={cursorRef} className="cursor-dot hidden lg:block" />
            <div ref={ringRef} className="cursor-ring hidden lg:block" />

            {/* Success Overlay: Workspace Provisioning */}
            {showSuccessOverlay && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-700">
                    <LiquidFilters />
                    <div className="max-w-xl w-full p-12 text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-primary-600 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-bounce">
                                <Cpu size={48} className="text-white" />
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                                    Welcome, <span className="text-primary-400">{form.firstName}</span>!
                                </h1>
                                <p className="text-slate-400 font-bold text-lg max-w-sm mx-auto leading-relaxed">
                                    Welcome to Brokerium, <br />
                                    <span className="text-emerald-500">Preparing your dedicated workspace...</span>
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-primary-600 via-emerald-500 to-blue-600 animate-progress origin-left" />
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                    <span>Syncing Carrier Data</span>
                                    <span className="animate-pulse">Initializing Secure Bricks...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Left Section: 40% Width for cleaner balance */}
            <div className="relative z-10 w-full lg:w-[40%] flex flex-col justify-center p-8 lg:p-16 bg-gradient-to-br from-primary-600/5 to-transparent dark:from-primary-600/10 h-full">
                <div className="max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-600/10 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-primary-600/20">
                        <TrendingUp size={12} />
                        Elite Onboarding
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tighter mb-8">
                        The Future of <br />
                        <span className="text-primary-600 shadow-primary-600/20">Broker Management.</span>
                    </h1>
                    
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {[
                            { title: 'AI Renewal Engine', desc: 'Auto renewal reminders.', icon: <Clock3 className="text-primary-600" /> },
                            { title: 'Carrier Cloud Sync', desc: 'Real-time insurer sync.', icon: <TrendingUp className="text-emerald-500" /> },
                            { title: 'Revenue Optimizer', desc: 'Commission tracking.', icon: <CheckCircle2 className="text-blue-500" /> },
                            { title: 'Client 360° Portal', desc: 'Self-service access.', icon: <UserIcon className="text-purple-500" /> },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-3xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 backdrop-blur-md group hover:bg-primary-600/5 transition-all shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0 mb-3 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18 })}
                                </div>
                                <h3 className="text-xs font-black text-slate-900 dark:text-white leading-tight mb-1">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-[9px] leading-tight">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-900 dark:bg-slate-800/80 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/20 blur-[40px]" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Deployment Readiness</p>
                                <h4 className="text-white text-lg font-black tracking-tight">Active Engine Provisioned</h4>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/50 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: 60% Width for expanded field visibility */}
            <div className="relative z-10 w-full lg:w-[60%] flex items-center justify-center p-4 lg:p-8 h-full bg-white dark:bg-[#020617]/40 backdrop-blur-sm">
                <div className="w-full max-w-2xl bg-white dark:bg-slate-900/80 border-2 border-slate-100 dark:border-white/5 rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-emerald-500 to-blue-600" />
                    
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Initialize Terminal</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px]">30-Day Zero-Fee Activation Block</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[11px] font-black flex items-center gap-2">
                            <ShieldCheck size={14} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-4 mb-2 block">Organization Entity</label>
                                <div className="relative">
                                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                                    <input required value={form.companyName} onChange={e => onChange('companyName', e.target.value)} placeholder="Enter Full Company Name"
                                        className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold focus:border-primary-600 outline-none transition-all placeholder:font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">First Name</label>
                                    <input required value={form.firstName} onChange={e => onChange('firstName', e.target.value)} placeholder="Given Name"
                                        className="w-full px-8 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold focus:border-primary-600 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Last Name</label>
                                    <input required value={form.lastName} onChange={e => onChange('lastName', e.target.value)} placeholder="Surname"
                                        className="w-full px-8 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold focus:border-primary-600 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Work Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                                        <input type="email" required value={form.email} onChange={e => onChange('email', e.target.value)} placeholder="email@domain.com"
                                            className="w-full pl-14 pr-6 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold focus:border-primary-600 outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Telephone (10 Digits)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                                        <input required value={form.phone} onChange={e => onChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="024XXXXXXX"
                                            className={`w-full pl-14 pr-12 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 text-slate-900 dark:text-white text-base font-bold outline-none transition-all 
                                                ${!isPhoneTyping ? 'border-slate-100 dark:border-slate-800' : isPhoneValid ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-red-500 ring-4 ring-red-500/10'}`} />
                                        <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black ${isPhoneValid ? 'text-emerald-500' : 'text-slate-400'}`}>{form.phone.length}/10</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">New Access Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                                        <input type={showPassword ? "text" : "password"} required value={form.password} onChange={e => onChange('password', e.target.value)} placeholder="Create Password"
                                            className="w-full pl-14 pr-12 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold focus:border-primary-600 outline-none transition-all" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Confirm Access Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700" size={18} />
                                        <input type={showConfirmPassword ? "text" : "password"} required value={form.confirmPassword} onChange={e => onChange('confirmPassword', e.target.value)} placeholder="Repeat Password"
                                            className="w-full pl-14 pr-14 py-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white text-base font-bold focus:border-primary-600 outline-none transition-all" />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors">
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" disabled={isSubmitting}
                                className="w-full py-5 rounded-3xl bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl active:scale-[0.98] transition-all disabled:opacity-50">
                                {isSubmitting ? 'PROVISIONING ENGINE...' : 'Activate My Free Trial'}
                            </button>
                            <div className="mt-4 text-center">
                                <button type="button" onClick={() => router.push('/login')} 
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                                    Member of the Brolly Hub? <span className="text-slate-900 dark:text-white ml-1 border-b-2 border-primary-600/30">Sign In</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
