'use client';

import { useState, useMemo } from 'react';
import { Search, Shield, CheckCircle, Filter } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { carriers } from '@/mock/carriers';
import {
    carrierProducts, CATEGORY_LABELS, CATEGORY_COLORS,
    getAllCategories, getCompulsoryProducts, type ProductCategory
} from '@/mock/carrier-products';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [selectedCarrier, setSelectedCarrier] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState<'all' | ProductCategory>('all');
    const [compulsoryOnly, setCompulsoryOnly] = useState(false);

    const allCategories = useMemo(() => getAllCategories(), []);
    const compulsoryCount = getCompulsoryProducts().length;

    const filtered = useMemo(() => {
        return carrierProducts.filter(p => {
            if (selectedCarrier !== 'all' && p.carrierId !== selectedCarrier) return false;
            if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
            if (compulsoryOnly && !p.compulsory) return false;
            if (search) {
                const q = search.toLowerCase();
                const c = carriers.find(c => c.id === p.carrierId);
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    c?.shortName.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [search, selectedCarrier, selectedCategory, compulsoryOnly]);

    const kpis = [
        { label: 'Total Products', value: carrierProducts.length, color: 'text-primary-600' },
        { label: 'Compulsory', value: compulsoryCount, color: 'text-red-600' },
        { label: 'Categories', value: allCategories.length, color: 'text-blue-600' },
        { label: 'Carriers', value: carriers.length, color: 'text-violet-600' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/carriers" className="text-xs font-bold text-surface-500 hover:text-primary-600 transition-colors uppercase tracking-widest">
                            Carriers
                        </Link>
                        <span className="text-surface-300">/</span>
                        <span className="text-xs font-bold text-surface-800 uppercase tracking-widest">Products</span>
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Products Browser</h1>
                    <p className="text-sm text-surface-500 mt-1">
                        All insurance products across {carriers.length} carriers · {carrierProducts.length} products listed.
                    </p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <Card key={i} padding="none" className="p-5">
                        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                        <p className={cn('text-2xl font-black mt-1 tabular-nums', kpi.color)}>{kpi.value}</p>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[var(--radius-xl)] border border-surface-200/50 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-surface-500 uppercase tracking-widest">
                    <Filter size={12} />
                    Filters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                        />
                    </div>
                    {/* Carrier */}
                    <select
                        value={selectedCarrier}
                        onChange={e => setSelectedCarrier(e.target.value)}
                        className="px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-surface-700"
                    >
                        <option value="all">All Carriers</option>
                        {carriers.map(c => (
                            <option key={c.id} value={c.id}>{c.shortName}</option>
                        ))}
                    </select>
                    {/* Category */}
                    <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value as 'all' | ProductCategory)}
                        className="px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-surface-700"
                    >
                        <option value="all">All Categories</option>
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                        ))}
                    </select>
                    {/* Compulsory toggle */}
                    <button
                        onClick={() => setCompulsoryOnly(!compulsoryOnly)}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold border transition-all',
                            compulsoryOnly
                                ? 'bg-red-50 border-red-300 text-red-700'
                                : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-surface-100'
                        )}
                    >
                        <Shield size={13} />
                        Compulsory Only {compulsoryOnly && `(${compulsoryCount})`}
                    </button>
                </div>
            </div>

            {/* Result count */}
            <p className="text-xs text-surface-400 font-medium -mt-2">
                Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Products List */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={search + selectedCarrier + selectedCategory + String(compulsoryOnly)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                >
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center text-surface-400">
                            <Shield size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No products match your filters.</p>
                        </div>
                    ) : (
                        filtered.map((product, i) => {
                            const carrier = carriers.find(c => c.id === product.carrierId);
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.2 }}
                                >
                                    <Card padding="none" className="p-5 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <h3 className="text-[14px] font-bold text-surface-900">{product.name}</h3>
                                                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded', CATEGORY_COLORS[product.category])}>
                                                        {CATEGORY_LABELS[product.category]}
                                                    </span>
                                                    {product.compulsory && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                                                            NIC Compulsory
                                                        </span>
                                                    )}
                                                    {product.status === 'discontinued' && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-surface-100 text-surface-400 border border-surface-200">
                                                            Discontinued
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Carrier link */}
                                                {carrier && (
                                                    <Link href={`/dashboard/carriers/${carrier.slug}`}>
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600 hover:underline mb-1.5">
                                                            <span
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: carrier.brandColor }}
                                                            />
                                                            {carrier.shortName}
                                                        </span>
                                                    </Link>
                                                )}

                                                <p className="text-[11px] text-surface-500 leading-relaxed mb-2">{product.description}</p>

                                                {/* Coverage */}
                                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                    {product.coverageSummary.map((cov, ci) => (
                                                        <span key={ci} className="flex items-center gap-1 text-[10px] text-surface-500">
                                                            <CheckCircle size={9} className="text-success-500 shrink-0" />
                                                            {cov}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Commission + Min Premium */}
                                            <div className="text-right shrink-0 pl-4 border-l border-surface-100">
                                                <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Commission Rate</p>
                                                <p className="text-2xl font-black text-primary-600 tabular-nums">{product.commissionRate}%</p>
                                                <p className="text-[10px] text-surface-400 mt-0.5">
                                                    Min. GH₵ {product.minPremium.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
