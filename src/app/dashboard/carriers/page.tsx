'use client';

import { useState } from 'react';
import { Search, Building2, Shield, RefreshCw, Globe, Trophy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { carriers, getCarriersByType, type CarrierType, type Carrier } from '@/mock/carriers';
import { Card } from '@/components/ui/card';
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
    'non-life': 'bg-blue-100 text-blue-700 border-blue-200',
    'life': 'bg-violet-100 text-violet-700 border-violet-200',
    'reinsurer': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const TYPE_LABEL: Record<CarrierType, string> = {
    'non-life': 'Non-Life',
    'life': 'Life',
    'reinsurer': 'Reinsurer',
};

function CarrierLogo({ carrier }: { carrier: Carrier }) {
    const [imgError, setImgError] = useState(false);
    if (carrier.logoUrl && !imgError) {
        return (
            <img
                src={carrier.logoUrl}
                alt={`${carrier.name} logo`}
                className="w-12 h-12 object-contain rounded-lg bg-white p-0.5"
                onError={() => setImgError(true)}
            />
        );
    }
    const initials = carrier.shortName.split(' ').map(w => w[0]).slice(0, 2).join('');
    return (
        <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0"
            style={{ backgroundColor: carrier.brandColor }}
        >
            {initials}
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
        { label: 'Total Carriers', value: carriers.length, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Non-Life', value: getCarriersByType('non-life').length, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Life', value: getCarriersByType('life').length, color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Reinsurers', value: getCarriersByType('reinsurer').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Carriers</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        All {carriers.length} NIC-licensed insurance companies in Ghana.
                    </p>
                </div>
                <Link href="/dashboard/carriers/products">
                    <Button variant="outline" leftIcon={<Shield size={16} />}>Browse Products</Button>
                </Link>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <Card key={i} padding="none" className={cn('p-5 flex items-center gap-4 hover:shadow-md transition-shadow', kpi.bg)}>
                        <Building2 size={20} className={kpi.color} />
                        <div>
                            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            <p className={cn('text-2xl font-black mt-0.5 tabular-nums', kpi.color)}>{kpi.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white/60 backdrop-blur-xl rounded-[var(--radius-xl)] border border-surface-200/50 p-3 shadow-sm">
                <div className="flex gap-1 flex-wrap">
                    {TABS.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all',
                                tab === t.key
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'text-surface-500 hover:text-surface-800 hover:bg-surface-100'
                            )}
                        >
                            <t.icon size={12} />
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search carriers..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                    />
                </div>
            </div>

            {/* Result count */}
            <p className="text-xs text-surface-400 font-medium -mt-2">
                Showing {filtered.length} of {baseList.length} carriers
            </p>

            {/* Carrier Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={tab + search}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-surface-400">
                            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No carriers match your search.</p>
                        </div>
                    ) : (
                        filtered.map((carrier, i) => (
                            <motion.div
                                key={carrier.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.025, 0.4), duration: 0.25 }}
                            >
                                <Link href={`/dashboard/carriers/${carrier.slug}`} className="block h-full">
                                    <div className="group bg-white/60 backdrop-blur-xl rounded-[var(--radius-2xl)] border border-surface-200/50 shadow-sm hover:shadow-xl hover:border-primary-300/40 transition-all duration-300 p-5 h-full cursor-pointer overflow-hidden relative">
                                        {/* Brand color top accent */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[var(--radius-2xl)]"
                                            style={{ backgroundColor: carrier.brandColor }}
                                        />

                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <CarrierLogo carrier={carrier} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-[13px] font-black text-surface-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                                                        {carrier.name}
                                                    </h3>
                                                    {carrier.revenueRank > 0 && carrier.revenueRank <= 5 && (
                                                        <div className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full">
                                                            <Trophy size={9} className="text-amber-500" />
                                                            <span className="text-[9px] font-black text-amber-700">#{carrier.revenueRank}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={cn('mt-1 inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border', TYPE_BADGE[carrier.type])}>
                                                    {TYPE_LABEL[carrier.type]}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-[11px] text-surface-500 line-clamp-2 mb-3 leading-relaxed">
                                            {carrier.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="space-y-1.5 border-t border-surface-100 pt-3">
                                            <div className="flex items-center gap-2 text-[11px] text-surface-500">
                                                <Globe size={11} className="text-surface-400 shrink-0" />
                                                <span className="truncate">{carrier.hq}</span>
                                            </div>
                                            {carrier.established > 0 && (
                                                <div className="flex items-center gap-2 text-[11px] text-surface-500">
                                                    <Building2 size={11} className="text-surface-400 shrink-0" />
                                                    <span>Est. {carrier.established} · {carrier.productCategories.length} product line{carrier.productCategories.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                            {carrier.rating && (
                                                <span className="inline-block px-2 py-0.5 bg-success-50 text-success-700 border border-success-200 rounded text-[9px] font-black uppercase">
                                                    ★ {carrier.rating}
                                                </span>
                                            )}
                                        </div>

                                        {/* Hover arrow */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink size={14} className="text-primary-500" />
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
