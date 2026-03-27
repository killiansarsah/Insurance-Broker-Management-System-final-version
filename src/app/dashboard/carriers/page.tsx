'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Building2, Shield, RefreshCw, Globe, Trophy, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarriers } from '@/hooks/api/use-carriers';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AppLoader } from '@/components/ui/AppLoader';

type CarrierType = 'NON_LIFE' | 'LIFE' | 'REINSURER';

interface Carrier {
    id: string;
    name: string;
    shortName: string;
    type: CarrierType;
    slug: string;
    hq: string;
    brandColor: string;
    logoUrl?: string;
    status: string;
    revenueRank: number;
    productCategories: string[];
    website?: string;
    [key: string]: any;
}

type Tab = 'all' | CarrierType;

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All Carriers', icon: Building2 },
    { key: 'NON_LIFE', label: 'Non-Life', icon: Shield },
    { key: 'LIFE', label: 'Life', icon: Shield },
    { key: 'REINSURER', label: 'Reinsurers', icon: RefreshCw },
];

const TYPE_BADGE: Record<CarrierType, string> = {
    'NON_LIFE': 'bg-blue-100/80 text-blue-700 border-blue-200 backdrop-blur-md',
    'LIFE': 'bg-violet-100/80 text-violet-700 border-violet-200 backdrop-blur-md',
    'REINSURER': 'bg-emerald-100/80 text-emerald-700 border-emerald-200 backdrop-blur-md',
};

const TYPE_LABEL: Record<CarrierType, string> = {
    'NON_LIFE': 'Non-Life',
    'LIFE': 'Life',
    'REINSURER': 'Reinsurer',
};

function CarrierLogo({ carrier }: { carrier: Carrier }) {
    const [imgError, setImgError] = useState(false);
    
    // Fix: If the logo URL is an upload (e.g., starts with /uploads), point it to the backend API.
    // If it's a static frontend asset (e.g., /images/carriers/...), keep it as is.
    const fullLogoUrl = carrier.logoUrl?.startsWith('/uploads')
        ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000'}${carrier.logoUrl}`
        : carrier.logoUrl;

    const fallbackColor = carrier.brandColor || '#3b82f6';

    const renderInitials = () => {
        const text = carrier.shortName || carrier.name || 'C';
        return text.split(' ').filter(Boolean).map(w => w[0]?.toUpperCase()).slice(0, 2).join('');
    };

    return (
        <div className="relative group/logo">
            {/* Glow effect behind logo */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover/card:opacity-60 transition-opacity duration-500"
                style={{ backgroundColor: fallbackColor }}
            />

            {/* Logo Container - Pedestal */}
            <div className="relative w-20 h-20 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-md border border-white/40 ring-1 ring-black/5 group-hover/card:scale-110 transition-transform duration-500 ease-out z-10">
                {fullLogoUrl && !imgError ? (
                    <Image
                        src={fullLogoUrl}
                        alt={`${carrier.name} logo`}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain p-1"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div
                        className="w-full h-full rounded-xl flex items-center justify-center text-white font-black text-xl"
                        style={{ backgroundColor: fallbackColor }}
                    >
                        {renderInitials()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CarriersPage() {
    const [tab, setTab] = useState<Tab>('all');
    const [search, setSearch] = useState('');

    const { data: carriersData, isLoading } = useCarriers();
    const carriers: Carrier[] = ((carriersData as any)?.items ?? (carriersData as any)?.data ?? (Array.isArray(carriersData) ? carriersData : [])) as Carrier[];
    const getCarriersByType = (type: CarrierType) => carriers.filter((c: Carrier) => c.type === type);

    const baseList = tab === 'all' ? carriers : getCarriersByType(tab);
    const filtered = search
        ? baseList.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.shortName || '').toLowerCase().includes(search.toLowerCase()) ||
            (c.hq || '').toLowerCase().includes(search.toLowerCase())
        )
        : baseList;

    const kpis = [
        { label: 'Total Carriers', value: carriers.length, color: 'text-primary-600', bg: 'bg-primary-50/50' },
        { label: 'Non-Life', value: getCarriersByType('NON_LIFE').length, color: 'text-blue-600', bg: 'bg-blue-50/50' },
        { label: 'Life', value: getCarriersByType('LIFE').length, color: 'text-violet-600', bg: 'bg-violet-50/50' },
        { label: 'Reinsurers', value: getCarriersByType('REINSURER').length, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
    ];

    if (isLoading) {
        return <AppLoader message="Loading carriers..." isLoading={true} />;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Standard Dashboard Header — Refined for Carriers */}
            <div className="relative rounded-3xl bg-slate-950 overflow-hidden min-h-[220px] shadow-xl group/header">
                {/* Visual Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse-slow translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse-slow -translate-x-1/2 translate-y-1/2" />

                <div className="relative px-8 py-8 md:px-10 md:py-10 flex flex-col lg:flex-row items-center justify-between gap-8 h-full">
                    {/* Left Panel: Title & Actions */}
                    <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-5">
                            Carriers <span className="text-blue-400">&</span> Partners
                        </h1>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            <Link href="/dashboard/carriers/products">
                                <Button
                                    className="h-11 px-7 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all font-black border-0"
                                    leftIcon={<Shield size={18} />}
                                >
                                    Browse Products
                                </Button>
                            </Link>
                            <Link href="https://nicgh.org" target="_blank" rel="noopener noreferrer">
                                <Button
                                    variant="outline"
                                    className="h-11 px-7 rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md"
                                    leftIcon={<ExternalLink size={18} />}
                                >
                                    NIC Portal
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Panel: KPI Matrix (Condensed) */}
                    <div className="lg:col-span-5 w-full lg:w-auto">
                        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto lg:mx-0">
                            {kpis.map((kpi, i) => (
                                <div
                                    key={i}
                                    className="group/kpi relative overflow-hidden rounded-xl p-3 transition-all duration-300 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
                                >
                                    <div className="relative z-10 flex items-center gap-3">
                                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shadow-sm shrink-0", kpi.bg.replace('bg-', 'bg-').replace('50/50', '500/20'))}>
                                            <Building2 size={16} className={kpi.color.replace('text-', 'text-').replace('600', '400')} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-white tracking-tight tabular-nums leading-none">
                                                {kpi.value}
                                            </p>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mt-1 truncate">
                                                {kpi.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-surface-50/95 dark:bg-slate-900/95 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between sticky top-[64px] z-40 backdrop-blur-3xl shadow-md border border-surface-200 dark:border-slate-800">
                <div className="flex gap-1 bg-surface-100/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                                tab === t.key
                                    ? 'bg-white dark:bg-slate-800 text-primary-700 shadow-sm ring-1 ring-black/5'
                                    : 'text-surface-500 hover:text-surface-800 hover:bg-white/50 dark:hover:bg-slate-800/50'
                            )}
                        >
                            <t.icon size={14} className={tab === t.key ? "text-primary-500" : "opacity-70"} />
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-72 group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, location..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-50/50 hover:bg-surface-100/50 focus:bg-white dark:focus:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-surface-400 font-medium"
                    />
                </div>
            </div>

            {/* Result Stats */}
            <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">
                    Showing {filtered.length} {tab === 'all' ? '' : tab} carriers
                </p>
            </div>

            {/* Carrier Grid - Redesigned for Logo Focus */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center"
                        >
                            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search size={32} className="text-surface-400" />
                            </div>
                            <h3 className="text-lg font-bold text-surface-900">No carriers found</h3>
                            <p className="text-sm text-surface-500 mt-1">Try adjusting your search or filters.</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => { setSearch(''); setTab('all'); }}
                            >
                                Clear Filters
                            </Button>
                        </motion.div>
                    ) : (
                        filtered.map((carrier, i) => (
                            <motion.div
                                layout
                                key={carrier.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                            >
                                <Link href={`/dashboard/carriers/${carrier.slug}`} className="block h-full group/card">
                                    <div className="premium-glass-card h-full rounded-[24px] p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/10 flex flex-col items-center text-center">

                                        {/* Background Decoration */}
                                        <div
                                            className="absolute top-0 inset-x-0 h-32 opacity-10 transition-opacity duration-300 group-hover/card:opacity-20"
                                            style={{
                                                background: `linear-gradient(to bottom, ${carrier.brandColor || '#3b82f6'}, transparent)`
                                            }}
                                        />

                                        {/* Centered Logo Pedestal */}
                                        <div className="mb-6 relative">
                                            <CarrierLogo carrier={carrier} />

                                            {/* Rank Badge */}
                                            {carrier.revenueRank > 0 && carrier.revenueRank <= 10 && (
                                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 shadow-md border border-amber-100 rounded-full">
                                                    <Trophy size={10} className="text-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-700 whitespace-nowrap">#{carrier.revenueRank}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="w-full relative z-10 flex flex-col flex-1 items-center">
                                            <div className="mb-1">
                                                <span className={cn('text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm', TYPE_BADGE[carrier.type])}>
                                                    {TYPE_LABEL[carrier.type]}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-black text-surface-900 leading-tight group-hover/card:text-primary-600 transition-colors line-clamp-2 mb-2 w-full">
                                                {carrier.name}
                                            </h3>

                                            <div className="w-8 h-1 rounded-full bg-surface-200 mb-4 group-hover/card:bg-primary-500 transition-colors duration-300" />

                                            <div className="text-xs text-surface-500 space-y-1 mb-6 flex-1 w-full">
                                                <div className="flex items-center justify-center gap-1.5 opacity-80">
                                                    <Globe size={11} />
                                                    <span className="truncate max-w-[150px]">{carrier.hq}</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-1.5 opacity-80">
                                                    <Building2 size={11} />
                                                    <span>{carrier.productCategories?.length || 0} Products</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="w-full pt-4 border-t border-surface-100/50">
                                                <div className="flex items-center justify-center gap-2 text-xs font-bold text-primary-600 bg-primary-50/50 py-2 rounded-xl group-hover/card:bg-primary-600 group-hover/card:text-white transition-all duration-300 shadow-sm opacity-90 group-hover/card:opacity-100 group-hover/card:shadow-md hover:scale-[1.02]">
                                                    <span>View Profile</span>
                                                    <ArrowRight size={14} className="group-hover/card:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
