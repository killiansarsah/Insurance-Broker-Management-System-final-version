'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import {
    FileBarChart,
    Plus,
    TrendingUp,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock,
    Send,
    Eye,
    Download,
    Copy,
    Trash2,
    X,
    Shield,
    User,
    Phone,
    Mail,
    CalendarDays,
    FileText,
    Star,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-display/data-table';
import { CustomSelect } from '@/components/ui/select-custom';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
    mockQuotes,
    quoteSummary,
    QUOTE_STATUS_CONFIG,
    type Quote,
    type QuoteStatus,
} from '@/mock/quotes';

// ─── Pipeline Tab ───
type PipelineTab = 'all' | QuoteStatus;

const PIPELINE_TABS: { key: PipelineTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: quoteSummary.total },
    { key: 'draft', label: 'Draft', count: quoteSummary.drafts },
    { key: 'sent', label: 'Sent', count: quoteSummary.sent },
    { key: 'accepted', label: 'Accepted', count: quoteSummary.accepted },
    { key: 'declined', label: 'Declined', count: quoteSummary.declined },
    { key: 'expired', label: 'Expired', count: quoteSummary.expired },
    { key: 'converted', label: 'Converted', count: quoteSummary.converted },
];

// ─── Status Badge ───
function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
    const config = QUOTE_STATUS_CONFIG[status];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}

// ─── CSV Export ───
function exportToCsv(quotes: Quote[]) {
    const headers = ['Quote #', 'Client', 'Type', 'Coverage', 'Status', 'Sum Insured Req.', 'Best Premium', 'Best Carrier', 'Commission', 'Request Date', 'Valid Until', 'Prepared By'];
    const rows = quotes.map(q => {
        const best = q.options.find(o => o.isRecommended) || q.options[0];
        return [
            q.quoteNumber, q.clientName, q.insuranceType, q.coverageType, q.status,
            q.sumInsuredRequested.toFixed(2), best?.premium?.toFixed(2) ?? '—', best?.carrierName ?? '—',
            best?.commissionAmount?.toFixed(2) ?? '—', q.requestDate, q.validUntil, q.preparedBy,
        ];
    });
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotes-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${quotes.length} quotes to CSV`);
}

// ─── Quote Detail Modal ───
function QuoteDetailModal({ quote, onClose }: { quote: Quote; onClose: () => void }) {
    const selectedOption = quote.options.find(o => o.isSelected) || quote.options.find(o => o.isRecommended) || quote.options[0];
    const isValid = new Date(quote.validUntil) >= new Date();

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background border-b border-surface-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary-50">
                                <FileBarChart size={20} className="text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-surface-900">Quote Details</h2>
                                <p className="text-sm text-surface-500 font-mono">{quote.quoteNumber}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <QuoteStatusBadge status={quote.status} />
                        {!isValid && quote.status !== 'expired' && quote.status !== 'converted' && quote.status !== 'accepted' && (
                            <span className="text-xs font-bold text-danger-600 bg-danger-50 px-2 py-0.5 rounded-full border border-danger-200">
                                Quote expired
                            </span>
                        )}
                    </div>
                </div>

                <div className="px-6 py-5 space-y-6">
                    {/* Client & Quote Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Client" value={quote.clientName} icon={<User size={16} />} />
                        <InfoCard label="Insurance Type" value={`${quote.coverageType} (${quote.insuranceType})`} icon={<Shield size={16} />} />
                        <InfoCard label="Policy Type" value={quote.policyType === 'life' ? 'Life' : 'Non-Life'} icon={<FileText size={16} />} />
                        <InfoCard label="Sum Insured (Requested)" value={formatCurrency(quote.sumInsuredRequested)} icon={<BarChart3 size={16} />} />
                        <InfoCard label="Request Date" value={formatDate(quote.requestDate)} icon={<CalendarDays size={16} />} />
                        <InfoCard label="Valid Until" value={formatDate(quote.validUntil)} icon={<Clock size={16} />} />
                    </div>

                    {/* Risk Description */}
                    <Card padding="none" className="p-4">
                        <h3 className="text-sm font-semibold text-surface-700 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-primary-600" />
                            Risk Description
                        </h3>
                        <p className="text-sm text-surface-600 leading-relaxed">{quote.riskDescription}</p>
                    </Card>

                    {/* Carrier Options Comparison */}
                    <Card padding="none" className="p-4">
                        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
                            <BarChart3 size={16} className="text-primary-600" />
                            Carrier Options ({quote.options.length})
                        </h3>
                        {quote.options.length === 0 ? (
                            <p className="text-sm text-surface-400 italic">No carrier options added yet (draft quote).</p>
                        ) : (
                            <div className="space-y-3">
                                {quote.options.map((opt) => (
                                    <div
                                        key={opt.id}
                                        className={cn(
                                            'relative p-4 rounded-xl border-2 transition-colors',
                                            opt.isSelected
                                                ? 'border-success-400 bg-success-50/50'
                                                : opt.isRecommended
                                                ? 'border-primary-300 bg-primary-50/30'
                                                : 'border-surface-200 bg-surface-50'
                                        )}
                                    >
                                        {/* Labels */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-bold text-surface-900">{opt.carrierName}</span>
                                            {opt.isRecommended && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                                                    <Star size={10} /> RECOMMENDED
                                                </span>
                                            )}
                                            {opt.isSelected && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success-700 bg-success-100 px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 size={10} /> SELECTED
                                                </span>
                                            )}
                                        </div>
                                        {/* Metrics Grid */}
                                        <div className="grid grid-cols-4 gap-3">
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-surface-500">Premium</p>
                                                <p className="text-base font-bold text-surface-900">{formatCurrency(opt.premium)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-surface-500">Sum Insured</p>
                                                <p className="text-sm font-bold text-surface-800">{opt.sumInsured > 0 ? formatCurrency(opt.sumInsured) : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-surface-500">Commission</p>
                                                <p className="text-sm font-bold text-success-700">{opt.commissionRate}% ({formatCurrency(opt.commissionAmount)})</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-semibold text-surface-500">Excess</p>
                                                <p className="text-sm font-medium text-surface-600">{opt.excessOrDeductible}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-surface-500 mt-2">{opt.coverageNotes}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Contact Details */}
                    <Card padding="none" className="p-4">
                        <h3 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-2">
                            <Phone size={16} className="text-primary-600" />
                            Contact & Assignment
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Phone</span>
                                <a href={`tel:${quote.clientPhone}`} className="text-primary-600 font-medium hover:underline">{quote.clientPhone}</a>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Email</span>
                                <a href={`mailto:${quote.clientEmail}`} className="text-primary-600 font-medium hover:underline">{quote.clientEmail}</a>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-surface-500">Prepared By</span>
                                <span className="font-medium text-surface-800">{quote.preparedBy}</span>
                            </div>
                            {quote.sentDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-surface-500">Sent Date</span>
                                    <span className="text-surface-700">{formatDate(quote.sentDate)}</span>
                                </div>
                            )}
                            {quote.responseDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-surface-500">Response Date</span>
                                    <span className="text-surface-700">{formatDate(quote.responseDate)}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-background border-t border-surface-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Copy size={14} />}
                            onClick={() => toast.success('Quote duplicated as new draft')}
                        >
                            Duplicate
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Download size={14} />}
                            onClick={() => toast.success(`Downloaded ${quote.quoteNumber} as PDF`)}
                        >
                            Export PDF
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        {quote.status === 'draft' && (
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Send size={14} />}
                                onClick={() => toast.success(`Quote ${quote.quoteNumber} sent to client`)}
                            >
                                Send to Client
                            </Button>
                        )}
                        {quote.status === 'sent' && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    leftIcon={<RefreshCw size={14} />}
                                    onClick={() => toast.info('Resending quote to client…')}
                                >
                                    Resend
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    leftIcon={<CheckCircle2 size={14} />}
                                    onClick={() => toast.success('Quote marked as accepted')}
                                >
                                    Mark Accepted
                                </Button>
                            </>
                        )}
                        {quote.status === 'accepted' && (
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<ArrowRight size={14} />}
                                onClick={() => toast.success('Conversion to policy initiated')}
                            >
                                Convert to Policy
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}

// ─── Info Card sub-component ───
function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-surface-50 rounded-xl">
            <div className="p-1.5 rounded-lg bg-surface-100 text-surface-500 mt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-semibold text-surface-400 tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-surface-800">{value}</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// ─── Main Page ────────────────────────────
// ═══════════════════════════════════════════
export default function QuotesPage() {
    const [activeTab, setActiveTab] = useState<PipelineTab>('all');
    const [filterType, setFilterType] = useState('');
    const [filterBroker, setFilterBroker] = useState('');
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    // Filter data
    const filtered = useMemo(() => {
        return mockQuotes.filter((q) => {
            if (activeTab !== 'all' && q.status !== activeTab) return false;
            if (filterType && q.insuranceType !== filterType) return false;
            if (filterBroker && q.preparedBy !== filterBroker) return false;
            return true;
        });
    }, [activeTab, filterType, filterBroker]);

    const hasFilters = filterType || filterBroker;

    // Insurance types from quotes data
    const insuranceTypes = useMemo(() => {
        const types = Array.from(new Set(mockQuotes.map(q => q.insuranceType)));
        return types.sort().map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, ' '), value: t }));
    }, []);

    const brokers = useMemo(() => {
        const b = Array.from(new Set(mockQuotes.map(q => q.preparedBy)));
        return b.sort().map(name => ({ label: name, value: name }));
    }, []);

    // KPIs
    const kpis = [
        {
            label: 'Total Quotes',
            value: quoteSummary.total,
            icon: <FileBarChart size={20} />,
            color: 'text-primary-500 bg-primary-50',
        },
        {
            label: 'Conversion Rate',
            value: `${quoteSummary.conversionRate.toFixed(0)}%`,
            icon: <TrendingUp size={20} />,
            color: 'text-success-500 bg-success-50',
        },
        {
            label: 'Premium Quoted',
            value: formatCurrency(quoteSummary.totalPremiumQuoted),
            icon: <BarChart3 size={20} />,
            color: 'text-accent-500 bg-accent-50',
        },
        {
            label: 'Awaiting Response',
            value: quoteSummary.sent,
            icon: <Clock size={20} />,
            color: 'text-warning-500 bg-warning-50',
        },
    ];

    // DataTable columns
    const columns = [
        {
            key: 'quoteNumber',
            label: 'Quote #',
            sortable: true,
            render: (row: Quote) => (
                <span className="text-xs font-mono text-surface-500">{row.quoteNumber}</span>
            ),
        },
        {
            key: 'clientName',
            label: 'Client',
            sortable: true,
            render: (row: Quote) => (
                <p className="text-sm font-semibold text-surface-900">{row.clientName}</p>
            ),
        },
        {
            key: 'insuranceType',
            label: 'Type',
            sortable: true,
            render: (row: Quote) => (
                <div>
                    <span className="text-sm text-surface-700 capitalize">{row.insuranceType.replace(/_/g, ' ')}</span>
                    <p className="text-[11px] text-surface-400">{row.coverageType}</p>
                </div>
            ),
        },
        {
            key: 'options',
            label: 'Carriers',
            render: (row: Quote) => {
                if (row.options.length === 0) return <span className="text-xs text-surface-400 italic">No options</span>;
                const names = row.options.map(o => o.carrierName);
                return (
                    <div className="flex flex-wrap gap-1">
                        {names.map(n => (
                            <span key={n} className="text-[11px] font-medium text-surface-600 bg-surface-100 px-2 py-0.5 rounded-full">
                                {n}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'bestPremium',
            label: 'Best Premium',
            sortable: true,
            render: (row: Quote) => {
                const best = row.options.find(o => o.isRecommended) || row.options[0];
                return best ? (
                    <span className="text-sm font-semibold text-surface-700">{formatCurrency(best.premium)}</span>
                ) : (
                    <span className="text-xs text-surface-400">—</span>
                );
            },
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (row: Quote) => <QuoteStatusBadge status={row.status} />,
        },
        {
            key: 'requestDate',
            label: 'Requested',
            sortable: true,
            render: (row: Quote) => (
                <div>
                    <span className="text-xs text-surface-500">{formatDate(row.requestDate)}</span>
                    {row.status === 'sent' && new Date(row.validUntil) < new Date() && (
                        <p className="text-[10px] font-semibold text-danger-600">Validity expired</p>
                    )}
                </div>
            ),
        },
        {
            key: 'actions' as keyof Quote,
            label: 'Actions',
            render: (row: Quote) => (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-primary-600 transition-colors cursor-pointer"
                        title="View"
                        onClick={() => setSelectedQuote(row)}
                    >
                        <Eye size={15} />
                    </button>
                    {row.status === 'draft' && (
                        <button
                            className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-success-600 transition-colors cursor-pointer"
                            title="Send to client"
                            onClick={() => toast.success(`Quote ${row.quoteNumber} sent to client`)}
                        >
                            <Send size={15} />
                        </button>
                    )}
                    <button
                        className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-surface-700 transition-colors cursor-pointer"
                        title="Duplicate"
                        onClick={() => toast.success(`Duplicated ${row.quoteNumber} as new draft`)}
                    >
                        <Copy size={15} />
                    </button>
                    <button
                        className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 hover:text-danger-600 transition-colors cursor-pointer"
                        title="Delete"
                        onClick={() => toast.success(`Deleted ${row.quoteNumber}`)}
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Quotes</h1>
                    <p className="text-sm text-surface-500 mt-1">Generate, compare, and manage insurance quotations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download size={14} />}
                        onClick={() => exportToCsv(filtered)}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="primary"
                        leftIcon={<Plus size={16} />}
                        onClick={() => toast.info('New quote form — coming soon')}
                    >
                        New Quote
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <Card key={kpi.label} padding="md" className="relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300',
                                kpi.color,
                            )}>
                                {kpi.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-surface-900">{kpi.value}</p>
                                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{kpi.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Pipeline Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {PIPELINE_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer',
                            activeTab === tab.key
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'text-surface-600 hover:bg-surface-100',
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            'ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full',
                            activeTab === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-surface-100 text-surface-500',
                        )}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <CustomSelect
                    label="Insurance Type"
                    options={insuranceTypes}
                    value={filterType}
                    onChange={(v) => setFilterType(String(v || ''))}
                    clearable
                />
                <CustomSelect
                    label="Prepared By"
                    options={brokers}
                    value={filterBroker}
                    onChange={(v) => setFilterBroker(String(v || ''))}
                    clearable
                />
                {hasFilters && (
                    <button
                        onClick={() => { setFilterType(''); setFilterBroker(''); }}
                        className="inline-flex items-center gap-1 text-xs text-danger-600 font-medium hover:text-danger-700 cursor-pointer"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            {/* Data Table */}
            <DataTable<Quote>
                data={filtered}
                columns={columns}
                searchPlaceholder="Search by quote #, client, type, carrier…"
                searchKeys={['quoteNumber', 'clientName', 'insuranceType', 'coverageType']}
                onRowClick={(row) => setSelectedQuote(row)}
                emptyMessage="No quotes match the current filters."
            />

            {/* Detail Modal */}
            {selectedQuote && (
                <QuoteDetailModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
            )}
        </div>
    );
}
