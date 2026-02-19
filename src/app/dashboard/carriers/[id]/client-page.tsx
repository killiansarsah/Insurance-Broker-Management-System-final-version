'use client';

import { ArrowLeft, ArrowRight, Building2, Globe, Mail, Phone, Shield, Trophy, ExternalLink, MapPin, Calendar, Users, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { type Carrier } from '@/mock/carriers';
import { type CarrierProduct } from '@/mock/carrier-products';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Reusing the logo component with size prop for the hero
function CarrierHeroLogo({ carrier, size = 'large' }: { carrier: Carrier, size?: 'normal' | 'large' }) {
    const [imgError, setImgError] = useState(false);

    // Size classes
    const containerClass = size === 'large' ? 'w-40 h-40 rounded-3xl' : 'w-16 h-16 rounded-xl';
    const iconClass = size === 'large' ? 'text-4xl' : 'text-xl';
    const imgClass = size === 'large' ? 'w-32 h-32' : 'w-12 h-12';

    return (
        <div className="relative group/hero-logo z-10">
            {/* Glow effect */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-30 animate-pulse"
                style={{ backgroundColor: carrier.brandColor }}
            />

            <div className={cn(
                "relative flex items-center justify-center bg-white shadow-2xl border border-white/50 ring-4 ring-white/20 backdrop-blur-xl transition-transform duration-700 hover:scale-105",
                containerClass
            )}>
                {carrier.logoUrl && !imgError ? (
                    <img
                        src={carrier.logoUrl}
                        alt={`${carrier.name} logo`}
                        className={cn("object-contain", imgClass)}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center text-white font-black"
                        style={{ backgroundColor: carrier.brandColor, borderRadius: 'inherit' }}
                    >
                        <span className={iconClass}>{carrier.shortName.substring(0, 2)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CarrierClientPage({ carrier, products = [] }: { carrier: Carrier; products?: CarrierProduct[] }) {
    const router = useRouter();

    const groupedProducts = (products || []).reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {} as Record<string, CarrierProduct[]>);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in relative">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[120px] opacity-10 mix-blend-multiply"
                    style={{ backgroundColor: carrier.brandColor }}
                />
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="text-surface-500 hover:text-surface-900 group"
                    leftIcon={<ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
                >
                    Back to Carriers
                </Button>
            </div>

            {/* Hero Section - Redesigned */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
            >
                {/* Glass Card */}
                <div className="premium-glass-card rounded-[32px] overflow-hidden relative min-h-[300px] flex flex-col md:flex-row items-center md:items-start p-8 md:p-12 gap-8 md:gap-12">

                    {/* Brand Stripe */}
                    <div
                        className="absolute top-0 inset-x-0 h-2"
                        style={{ backgroundColor: carrier.brandColor }}
                    />

                    {/* Massive Logo Pedestal */}
                    <div className="shrink-0 pt-4">
                        <CarrierHeroLogo carrier={carrier} size="large" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left space-y-6 pt-4">
                        <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    carrier.type === 'life' ? "bg-violet-100 text-violet-700 border-violet-200" :
                                        carrier.type === 'non-life' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                            "bg-emerald-100 text-emerald-700 border-emerald-200"
                                )}>
                                    {carrier.type} Insurance
                                </span>
                                {carrier.revenueRank > 0 && carrier.revenueRank <= 10 && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">
                                        <Trophy size={12} className="text-amber-500" />
                                        ranked #{carrier.revenueRank}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-surface-900 tracking-tight leading-tight mb-4">
                                {carrier.name}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-surface-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-primary-500" />
                                    {carrier.hq}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-primary-500" />
                                    Est. {new Date().getFullYear() - 25}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-primary-500" />
                                    {products.length} Active Products
                                </div>
                            </div>
                        </div>

                        {/* Description / Bio (Mock) */}
                        <p className="text-surface-600 leading-relaxed max-w-3xl mx-auto md:mx-0">
                            {carrier.name} is a leading provider of {carrier.type} insurance solutions in Ghana.
                            Headquartered in {carrier.hq}, they are known for their strong financial stability and
                            commitment to customer service. Partnered with us since 2020.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                            <Button className="shimmer-button h-12 px-8 text-base shadow-xl shadow-primary-500/20" leftIcon={<FileText size={18} />}>
                                View Contracts
                            </Button>
                            <Button variant="outline" className="h-12 px-8 text-base bg-white/50 backdrop-blur-md border-surface-200 hover:bg-white" leftIcon={<ExternalLink size={18} />}>
                                Visit Website
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Products */}
                <div className="lg:col-span-2 space-y-8">
                    {Object.entries(groupedProducts).map(([category, items], sectionIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 + (sectionIndex * 0.1) }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-px bg-surface-200 flex-1" />
                                <h3 className="text-sm font-black text-surface-400 uppercase tracking-widest">{category} Products</h3>
                                <div className="h-px bg-surface-200 flex-1" />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {items.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group bg-white/60 backdrop-blur-md border border-surface-200 rounded-2xl p-5 hover:bg-white hover:border-primary-200 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-surface-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Shield size={20} className="text-surface-400 group-hover:text-primary-500 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4 mb-1">
                                                <h4 className="text-base font-bold text-surface-900 truncate">{product.name}</h4>
                                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md whitespace-nowrap">
                                                    {product.commissionRate}% comm.
                                                </span>
                                            </div>
                                            <p className="text-sm text-surface-500 line-clamp-2">{product.description}</p>
                                        </div>
                                        <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <ArrowRight size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Column: Contact & Info */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card padding="none" className="overflow-hidden border-surface-200 bg-white/60 backdrop-blur-xl shadow-lg">
                            <div className="p-5 border-b border-surface-100 bg-surface-50/50">
                                <h3 className="font-bold text-surface-900 flex items-center gap-2">
                                    <Building2 size={16} className="text-primary-500" />
                                    Contact Information
                                </h3>
                            </div>
                            <div className="p-2">
                                {[
                                    { icon: MapPin, label: 'Address', value: 'Headquarters', sub: carrier.hq },
                                    { icon: Phone, label: 'Phone', value: '+233 (0) 30 200 0000' },
                                    { icon: Mail, label: 'Email', value: `info@${carrier.slug.replace(/-/g, '')}.com.gh` },
                                    { icon: Globe, label: 'Website', value: `www.${carrier.slug.replace(/-/g, '')}.com.gh` },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/80 rounded-xl transition-colors group">
                                        <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <item.icon size={18} className="text-surface-500 group-hover:text-primary-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-bold text-surface-900 truncate">{item.value}</p>
                                            {item.sub && <p className="text-xs text-surface-500 truncate">{item.sub}</p>}
                                        </div>
                                        {i > 0 && <ExternalLink size={14} className="text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Stats or compliance */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-900">Compliance Verified</p>
                                <p className="text-xs text-emerald-700">License active for {new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
