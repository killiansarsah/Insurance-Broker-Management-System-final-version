'use client';

import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import Link from 'next/link';
import {
    Building2, Globe, Phone, Mail, User, Shield, ChevronRight,
    ArrowLeft, Star, Calendar, FileText, ExternalLink, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getCarrierBySlug, type Carrier } from '@/mock/carriers';
import { getProductsByCarrierId, CATEGORY_LABELS, CATEGORY_COLORS } from '@/mock/carrier-products';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TYPE_BADGE: Record<string, string> = {
    'non-life': 'bg-blue-100 text-blue-700 border-blue-200',
    'life': 'bg-violet-100 text-violet-700 border-violet-200',
    'reinsurer': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};
const TYPE_LABEL: Record<string, string> = {
    'non-life': 'Non-Life Insurance',
    'life': 'Life Insurance',
    'reinsurer': 'Reinsurance',
};

function CarrierHeroLogo({ carrier }: { carrier: Carrier }) {
    const [imgError, setImgError] = useState(false);
    if (carrier.logoUrl && !imgError) {
        return (
            <img
                src={carrier.logoUrl}
                alt={`${carrier.name} logo`}
                className="w-20 h-20 object-contain rounded-2xl bg-white shadow-md p-1"
                onError={() => setImgError(true)}
            />
        );
    }
    const initials = carrier.shortName.split(' ').map(w => w[0]).slice(0, 2).join('');
    return (
        <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md"
            style={{ backgroundColor: carrier.brandColor }}
        >
            {initials}
        </div>
    );
}

export default function CarrierDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = use(params);
    const carrier = getCarrierBySlug(slug);

    if (!carrier) notFound();

    const products = getProductsByCarrierId(carrier.id);

    const contactItems = [
        { icon: Globe, label: 'Headquarters', value: carrier.hq },
        { icon: Phone, label: 'Phone', value: carrier.phone },
        { icon: Mail, label: 'Email', value: carrier.email },
        { icon: User, label: 'Contact Person', value: carrier.contactPerson },
        { icon: Calendar, label: 'Established', value: carrier.established > 0 ? String(carrier.established) : 'N/A' },
        ...(carrier.website ? [{ icon: Globe, label: 'Website', value: carrier.website, isLink: true }] : []),
        ...(carrier.parentGroup ? [{ icon: Building2, label: 'Parent Group', value: carrier.parentGroup }] : []),
        ...(carrier.rating ? [{ icon: Star, label: 'Rating', value: carrier.rating }] : []),
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back nav */}
            <Link href="/dashboard/carriers">
                <button className="flex items-center gap-2 text-xs font-bold text-surface-500 hover:text-primary-600 transition-colors uppercase tracking-widest">
                    <ArrowLeft size={13} />
                    All Carriers
                </button>
            </Link>

            {/* Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card padding="none" className="overflow-hidden">
                    {/* Brand header */}
                    <div
                        className="h-2 w-full"
                        style={{ backgroundColor: carrier.brandColor }}
                    />
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <CarrierHeroLogo carrier={carrier} />
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-xl font-black text-surface-900 tracking-tight">{carrier.name}</h1>
                                <span className={cn('text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border', TYPE_BADGE[carrier.type])}>
                                    {TYPE_LABEL[carrier.type]}
                                </span>
                                <span className={cn(
                                    'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border',
                                    carrier.status === 'active'
                                        ? 'bg-success-50 text-success-700 border-success-200'
                                        : 'bg-warning-50 text-warning-700 border-warning-200'
                                )}>
                                    {carrier.status}
                                </span>
                            </div>
                            <p className="text-[12px] text-surface-500 leading-relaxed max-w-2xl">{carrier.description}</p>
                            {carrier.licenseNumber && (
                                <p className="mt-2 text-[10px] text-surface-400 font-mono">NIC License: {carrier.licenseNumber}</p>
                            )}
                        </div>
                        {carrier.website && (
                            <a
                                href={carrier.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={12} />}>
                                    Visit Website
                                </Button>
                            </a>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Products */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Products */}
                    <Card padding="none" className="overflow-hidden">
                        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                            <h2 className="text-xs font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={13} className="text-primary-500" />
                                Products Offered ({products.length})
                            </h2>
                            <Link href="/dashboard/carriers/products">
                                <button className="text-[10px] font-bold text-primary-600 hover:underline flex items-center gap-1">
                                    View All <ChevronRight size={10} />
                                </button>
                            </Link>
                        </div>
                        {products.length === 0 ? (
                            <div className="py-12 text-center text-surface-400">
                                <Shield size={28} className="mx-auto mb-2 opacity-30" />
                                <p className="text-xs">No products on record for this carrier.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-surface-50">
                                {products.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.2 }}
                                        className="px-6 py-4 hover:bg-surface-50/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <h3 className="text-[13px] font-bold text-surface-900">{product.name}</h3>
                                                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded', CATEGORY_COLORS[product.category])}>
                                                        {CATEGORY_LABELS[product.category]}
                                                    </span>
                                                    {product.compulsory && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                                                            Compulsory
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-surface-500 leading-relaxed mb-2">{product.description}</p>
                                                {/* Coverage bullets */}
                                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                    {product.coverageSummary.slice(0, 4).map((cov, ci) => (
                                                        <span key={ci} className="flex items-center gap-1 text-[10px] text-surface-500">
                                                            <CheckCircle size={9} className="text-success-500 shrink-0" />
                                                            {cov}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[11px] text-surface-400 uppercase tracking-widest font-bold">Commission</p>
                                                <p className="text-lg font-black text-primary-600">{product.commissionRate}%</p>
                                                <p className="text-[10px] text-surface-400 mt-0.5">
                                                    Min. GH₵ {product.minPremium.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Product Categories Summary */}
                    <Card padding="none" className="p-5">
                        <h2 className="text-xs font-black text-surface-500 uppercase tracking-widest mb-4">Product Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {carrier.productCategories.map(cat => (
                                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-surface-50 border border-surface-200 rounded-lg">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: carrier.brandColor }}
                                    />
                                    <span className="text-[11px] font-bold text-surface-700 capitalize">
                                        {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}
                                    </span>
                                    <span className="text-[10px] text-surface-400 font-mono">
                                        {(carrier.commissionRates[cat] ?? 0)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right: Contact + Info */}
                <div className="space-y-4">
                    <Card padding="none" className="overflow-hidden">
                        <div className="px-5 py-4 border-b border-surface-100">
                            <h2 className="text-xs font-black text-surface-500 uppercase tracking-widest">Carrier Information</h2>
                        </div>
                        <div className="divide-y divide-surface-50">
                            {contactItems.map((item, i) => (
                                <div key={i} className="px-5 py-3 flex items-start gap-3">
                                    <item.icon size={13} className="mt-0.5 text-surface-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest">{item.label}</p>
                                        {'isLink' in item && item.isLink ? (
                                            <a
                                                href={item.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-primary-600 hover:underline break-all"
                                            >
                                                {item.value.replace('https://', '')}
                                            </a>
                                        ) : (
                                            <p className="text-[12px] text-surface-800 font-medium break-words">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick actions */}
                    <Card padding="none" className="p-4 space-y-2">
                        <h2 className="text-xs font-black text-surface-500 uppercase tracking-widest mb-3">Quick Actions</h2>
                        <Link href={`/dashboard/policies?carrier=${carrier.slug}`}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-2">
                                <FileText size={13} /> View Policies with this Carrier
                            </Button>
                        </Link>
                        <Link href={`/dashboard/finance/commissions?carrier=${carrier.slug}`}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-2">
                                <Shield size={13} /> View Commissions
                            </Button>
                        </Link>
                        <Link href="/dashboard/carriers/products">
                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-2">
                                <ChevronRight size={13} /> All Products browser
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
