'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import {
    Search,
    User,
    Shield,
    FileText,
    AlertCircle,
    MessageSquare,
    Users,
    TrendingUp,
    ArrowLeft,
    ChevronRight,
    Building2,
    DollarSign,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/data-display/status-badge';
import type { ClientStatus, PolicyStatus, ClaimStatus, LeadStatus, ComplaintStatus } from '@/types';

type AnyStatus = ClientStatus | PolicyStatus | ClaimStatus | LeadStatus | ComplaintStatus | 'active' | 'inactive';
import { mockClients } from '@/hooks/api';
import { mockPolicies } from '@/hooks/api';
import { claims } from '@/hooks/api';
import { mockLeads } from '@/hooks/api';
import { MOCK_COMPLAINTS } from '@/hooks/api';
import { nonLifeCarriers, lifeCarriers } from '@/hooks/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { getClientDisplayName } from '@/hooks/api';

type ResultCategory = 'clients' | 'policies' | 'claims' | 'leads' | 'carriers' | 'complaints';

interface SearchResult {
    id: string;
    category: ResultCategory;
    title: string;
    subtitle: string;
    status?: AnyStatus;
    meta?: string;
    href: string;
}

const CATEGORY_ICONS: Record<ResultCategory, React.ReactNode> = {
    clients: <User size={16} />,
    policies: <Shield size={16} />,
    claims: <AlertCircle size={16} />,
    leads: <TrendingUp size={16} />,
    carriers: <Building2 size={16} />,
    complaints: <MessageSquare size={16} />,
};

const CATEGORY_COLORS: Record<ResultCategory, string> = {
    clients: 'bg-primary-50 text-primary-600',
    policies: 'bg-blue-50 text-blue-600',
    claims: 'bg-orange-50 text-orange-600',
    leads: 'bg-purple-50 text-purple-600',
    carriers: 'bg-teal-50 text-teal-600',
    complaints: 'bg-warning-50 text-warning-600',
};

const CATEGORY_LABELS: Record<ResultCategory, string> = {
    clients: 'Clients',
    policies: 'Policies',
    claims: 'Claims',
    leads: 'Leads',
    carriers: 'Carriers',
    complaints: 'Complaints',
};

function highlight(text: string, query: string) {
    if (!query || query.trim() === '') return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    );
}

function ResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') ?? '';

    const results: SearchResult[] = useMemo(() => {
        if (!query || query.trim().length < 2) return [];
        const q = query.toLowerCase();
        const out: SearchResult[] = [];

        // Clients
        mockClients.forEach(c => {
            const name = getClientDisplayName(c);
            if (
                name.toLowerCase().includes(q) ||
                c.clientNumber.toLowerCase().includes(q) ||
                (c.email ?? '').toLowerCase().includes(q) ||
                (c.phone ?? '').includes(q)
            ) {
                out.push({
                    id: c.id,
                    category: 'clients',
                    title: name,
                    subtitle: c.clientNumber,
                    status: c.status as AnyStatus,
                    meta: c.type === 'corporate' ? 'Corporate' : 'Individual',
                    href: `/dashboard/clients/${c.id}`,
                });
            }
        });

        // Policies
        mockPolicies.forEach(p => {
            if (
                p.policyNumber.toLowerCase().includes(q) ||
                p.clientName.toLowerCase().includes(q) ||
                p.insurerName.toLowerCase().includes(q) ||
                p.insuranceType.toLowerCase().includes(q)
            ) {
                out.push({
                    id: p.id,
                    category: 'policies',
                    title: p.policyNumber,
                    subtitle: p.clientName,
                    status: p.status as AnyStatus,
                    meta: formatCurrency(p.premiumAmount),
                    href: `/dashboard/policies/${p.id}`,
                });
            }
        });

        // Claims
        claims.forEach(c => {
            if (
                c.claimNumber.toLowerCase().includes(q) ||
                c.clientName.toLowerCase().includes(q) ||
                (c.incidentDescription ?? '').toLowerCase().includes(q)
            ) {
                out.push({
                    id: c.id,
                    category: 'claims',
                    title: c.claimNumber,
                    subtitle: c.clientName,
                    status: c.status as AnyStatus,
                    meta: formatCurrency(c.claimAmount),
                    href: `/dashboard/claims/${c.id}`,
                });
            }
        });

        // Leads
        mockLeads.forEach(l => {
            if (
                l.leadNumber.toLowerCase().includes(q) ||
                l.contactName.toLowerCase().includes(q) ||
                (l.companyName ?? '').toLowerCase().includes(q)
            ) {
                out.push({
                    id: l.id,
                    category: 'leads',
                    title: l.contactName,
                    subtitle: l.leadNumber,
                    status: l.status as AnyStatus,
                    meta: l.estimatedPremium ? formatCurrency(l.estimatedPremium) : undefined,
                    href: `/dashboard/leads/${l.id}`,
                });
            }
        });

        // Carriers
        [...nonLifeCarriers, ...lifeCarriers].forEach(c => {
            if (
                c.name.toLowerCase().includes(q) ||
                c.shortName.toLowerCase().includes(q) ||
                c.licenseNumber.toLowerCase().includes(q)
            ) {
                out.push({
                    id: c.id,
                    category: 'carriers',
                    title: c.name,
                    subtitle: c.licenseNumber,
                    status: c.status as AnyStatus,
                    meta: c.type,
                    href: `/dashboard/carriers/${c.id}`,
                });
            }
        });

        // Complaints
        MOCK_COMPLAINTS.forEach(c => {
            if (
                c.complaintNumber.toLowerCase().includes(q) ||
                c.complainantName.toLowerCase().includes(q) ||
                c.subject.toLowerCase().includes(q)
            ) {
                out.push({
                    id: c.id,
                    category: 'complaints',
                    title: c.subject,
                    subtitle: c.complainantName,
                    status: c.status as AnyStatus,
                    meta: c.complaintNumber,
                    href: `/dashboard/complaints/${c.id}`,
                });
            }
        });

        return out.slice(0, 60); // cap at 60 results
    }, [query]);

    const grouped = useMemo(() => {
        const groups: Partial<Record<ResultCategory, SearchResult[]>> = {};
        results.forEach(r => {
            if (!groups[r.category]) groups[r.category] = [];
            groups[r.category]!.push(r);
        });
        return groups;
    }, [results]);

    const categories = Object.keys(grouped) as ResultCategory[];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} onClick={() => router.back()}>Back</Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight flex items-center gap-2">
                        <Search size={22} className="text-surface-400" />
                        {query ? <>Results for <span className="text-primary-600">"{query}"</span></> : 'Search Results'}
                    </h1>
                    <p className="text-sm text-surface-500 mt-1">
                        {results.length > 0
                            ? `${results.length} result${results.length === 1 ? '' : 's'} across ${categories.length} module${categories.length === 1 ? '' : 's'}`
                            : query.length >= 2 ? 'No results found' : 'Enter at least 2 characters to search'}
                    </p>
                </div>
            </div>

            {/* No results state */}
            {query.length >= 2 && results.length === 0 && (
                <div className="text-center py-20">
                    <Search size={48} className="mx-auto mb-4 text-surface-200" />
                    <h2 className="text-lg font-semibold text-surface-600">No results for "{query}"</h2>
                    <p className="text-sm text-surface-400 mt-2">Try different keywords or check your spelling.</p>
                    <Button variant="outline" className="mt-6" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </div>
            )}

            {/* Empty query state */}
            {query.length < 2 && (
                <div className="text-center py-20">
                    <Search size={48} className="mx-auto mb-4 text-surface-200" />
                    <h2 className="text-lg font-semibold text-surface-600">What are you looking for?</h2>
                    <p className="text-sm text-surface-400 mt-2">Search across clients, policies, claims, leads, carriers, and complaints.</p>
                </div>
            )}

            {/* Category summary pills */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <a
                            key={cat}
                            href={`#section-${cat}`}
                            className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold', CATEGORY_COLORS[cat])}
                        >
                            {CATEGORY_ICONS[cat]}
                            {CATEGORY_LABELS[cat]} ({grouped[cat]!.length})
                        </a>
                    ))}
                </div>
            )}

            {/* Results by category */}
            {categories.map(cat => (
                <section key={cat} id={`section-${cat}`}>
                    <h2 className="flex items-center gap-2 text-sm font-bold text-surface-700 uppercase tracking-wide mb-3">
                        <span className={cn('p-1.5 rounded-lg', CATEGORY_COLORS[cat])}>{CATEGORY_ICONS[cat]}</span>
                        {CATEGORY_LABELS[cat]} · {grouped[cat]!.length}
                    </h2>
                    <Card padding="none" className="overflow-hidden divide-y divide-surface-100">
                        {grouped[cat]!.map(result => (
                            <div
                                key={result.id}
                                className="flex items-center gap-4 px-4 py-3 hover:bg-surface-50 transition-colors cursor-pointer group"
                                onClick={() => router.push(result.href)}
                            >
                                <div className={cn('shrink-0 p-2 rounded-lg', CATEGORY_COLORS[cat])}>
                                    {CATEGORY_ICONS[cat]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-surface-900 text-sm truncate">
                                        {highlight(result.title, query)}
                                    </p>
                                    <p className="text-xs text-surface-500 truncate">
                                        {highlight(result.subtitle, query)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {result.status && <StatusBadge status={result.status as any} />}
                                    {result.meta && <span className="text-xs text-surface-400 hidden sm:block">{result.meta}</span>}
                                    <ChevronRight size={14} className="text-surface-300 group-hover:text-surface-600 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </Card>
                </section>
            ))}
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={
            <div className="space-y-4 animate-pulse">
                <div className="h-8 w-64 bg-surface-200 rounded" />
                <div className="h-4 w-40 bg-surface-100 rounded" />
                <div className="h-20 bg-surface-100 rounded-xl" />
                <div className="h-20 bg-surface-100 rounded-xl" />
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
