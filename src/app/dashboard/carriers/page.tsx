'use client';

import { useState } from 'react';
import { Search, Building2, Shield, RefreshCw, Globe, Trophy, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { carriers, getCarriersByType, type CarrierType, type Carrier } from '@/mock/carriers';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Tab = 'all' | CarrierType;

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'All Carriers', icon: Building2 },
    { key: 'non-life', label: 'Non-Life', icon: Shield },
    { key: 'life', label: 'Life', icon: Shield },
    { key: 'reinsurer', label: 'Reinsurers', icon: RefreshCw },
];

const TYPE_BADGE: Record<CarrierType, string> = {
    'non-life': 'bg-blue-100/80 text-blue-700 border-blue-200 backdrop-blur-md',
    'life': 'bg-violet-100/80 text-violet-700 border-violet-200 backdrop-blur-md',
    'reinsurer': 'bg-emerald-100/80 text-emerald-700 border-emerald-200 backdrop-blur-md',
};

const TYPE_LABEL: Record<CarrierType, string> = {
    'non-life': 'Non-Life',
    'life': 'Life',
    'reinsurer': 'Reinsurer',
};

function CarrierLogo({ carrier }: { carrier: Carrier }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="relative group/logo">
            {/* Glow effect behind logo */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover/card:opacity-60 transition-opacity duration-500"
                style={{ backgroundColor: carrier.brandColor }}
            />

            {/* Logo Container - Pedestal */}
            <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center bg-white shadow-lg border border-white/40 ring-1 ring-black/5 group-hover/card:scale-110 transition-transform duration-500 ease-out z-10">
                {carrier.logoUrl && !imgError ? (
                    <img
                        src={carrier.logoUrl}
                        alt={`${carrier.name} logo`}
                        className="w-20 h-20 object-contain p-1"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div
                        className="w-full h-full rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                        style={{ backgroundColor: carrier.brandColor }}
                    >
                        {carrier.shortName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CarriersPage() {
    const [tab, setTab] = useState<Tab>('all');
    const [search, setSearch] = useState('');

    const baseList = tab === 'all' ? carriers : getCarriersByType(tab);
    const filtered = search
        ? baseList.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.shortName.toLowerCase().includes(search.toLowerCase()) ||
            c.hq.toLowerCase().includes(search.toLowerCase())
        )
        : baseList;

    const kpis = [
        { label: 'Total Carriers', value: carriers.length, color: 'text-primary-600', bg: 'bg-primary-50/50' },
        { label: 'Non-Life', value: getCarriersByType('non-life').length, color: 'text-blue-600', bg: 'bg-blue-50/50' },
        { label: 'Life', value: getCarriersByType('life').length, color: 'text-violet-600', bg: 'bg-violet-50/50' },
        { label: 'Reinsurers', value: getCarriersByType('reinsurer').length, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Minimalist Hero Section */}
            <div className="relative rounded-[32px] overflow-hidden p-8 md:p-10 mb-8 group">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/50 to-white/90 backdrop-blur-3xl" />
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,transparent)]" />

                {/* Subtle Ambient Glow */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Panel: Title & Actions */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-black text-surface-900 tracking-tight mb-6">
                            Carriers & <span className="text-primary-600">Partners</span>
                        </h1>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/dashboard/carriers/products">
                                <Button
                                    className="h-11 px-6 rounded-xl bg-surface-900 text-white hover:bg-surface-800 shadow-lg shadow-surface-900/10 hover:shadow-xl transition-all"
                                    leftIcon={<Shield size={18} />}
                                >
                                    Browse Products
                                </Button>
                            </Link>
                            <Link href="https://nicgh.org" target="_blank" rel="noopener noreferrer">
                                <Button
                                    variant="outline"
                                    className="h-11 px-6 rounded-xl border-surface-200 bg-white/60 hover:bg-white text-surface-700"
                                    leftIcon={<ExternalLink size={18} />}
                                >
                                    NIC Portal
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Panel: KPI Matrix */}
                    <div className="lg:col-span-5">
                        <div className="grid grid-cols-2 gap-3">
                            {kpis.map((kpi, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "group/kpi relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-white/60",
                                        "bg-white/50 backdrop-blur-md hover:bg-white/80"
                                    )}
                                >
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0", kpi.bg)}>
                                            <Building2 size={18} className={kpi.color} />
                                        </div>
                                        <div>
                                            <p className={cn("text-2xl font-black tracking-tight tabular-nums leading-none", kpi.color)}>
                                                {kpi.value}
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mt-1 truncate">
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
            <div className="premium-glass-card p-2 rounded-2xl flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between sticky top-4 z-10 backdrop-blur-xl">
                <div className="flex gap-1 bg-surface-100/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap',
                                tab === t.key
                                    ? 'bg-white text-primary-700 shadow-sm ring-1 ring-black/5'
                                    : 'text-surface-500 hover:text-surface-800 hover:bg-white/50'
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
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-50/50 hover:bg-surface-100/50 focus:bg-white border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-surface-400 font-medium"
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
                                                background: `linear-gradient(to bottom, ${carrier.brandColor}, transparent)`
                                            }}
                                        />

                                        {/* Centered Logo Pedestal */}
                                        <div className="mb-6 relative">
                                            <CarrierLogo carrier={carrier} />

                                            {/* Rank Badge */}
                                            {carrier.revenueRank > 0 && carrier.revenueRank <= 10 && (
                                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2.5 py-1 bg-white shadow-md border border-amber-100 rounded-full">
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
                                                    <span>{carrier.productCategories.length} Products</span>
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
