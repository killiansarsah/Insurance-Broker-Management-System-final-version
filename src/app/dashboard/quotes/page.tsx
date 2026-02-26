'use client';

import { FileBarChart, Plus, Search, Filter } from 'lucide-react';

export default function QuotesPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotes</h1>
                    <p className="text-muted-foreground text-sm">Generate and manage insurance quotes.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium rounded-none shadow-sm">
                    <Plus size={16} />
                    New Quote
                </button>
            </header>

            {/* Filters Bar */}
            <div className="flex items-center justify-between gap-4 p-2 bg-card border border-border rounded-none shadow-sm">
                <div className="flex items-center flex-1 relative" style={{ maxWidth: '24rem' }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search quotes..."
                        className="w-full pl-9 pr-4 py-1.5 text-sm bg-background border border-input focus:outline-none focus:ring-1 focus:ring-ring rounded-none transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-none transition-colors">
                    <Filter size={14} />
                    Filters
                </button>
            </div>

            {/* Empty State / List Placeholder */}
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-none bg-muted/10 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileBarChart className="text-muted-foreground w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Quotes Generated Yet</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-6" style={{ maxWidth: '24rem' }}>
                    Start by creating a new quote for a client. You can compare multiple carriers and products.
                </p>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium rounded-none">
                    Create First Quote
                </button>
            </div>
        </div>
    );
}
