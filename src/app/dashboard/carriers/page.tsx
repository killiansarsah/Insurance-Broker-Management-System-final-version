'use client';

import { Building2, Plus, ArrowUpRight } from 'lucide-react';

// Mock Carrier Data
const carriers = [
    { id: 1, name: 'Allianz Global', products: 12, rating: 'A+', status: 'Active' },
    { id: 2, name: 'AXA Insurance', products: 8, rating: 'A', status: 'Active' },
    { id: 3, name: 'Chubb Limited', products: 5, rating: 'A++', status: 'Active' },
    { id: 4, name: 'Zurich Insurance', products: 15, rating: 'A+', status: 'Review' },
];

export default function CarriersPage() {
    return (
        <div className="h-full flex flex-col space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Carriers & Products</h1>
                    <p className="text-muted-foreground text-sm">Manage insurance carrier relationships and product lines.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium rounded-none shadow-sm">
                    <Plus size={16} />
                    Add Carrier
                </button>
            </header>

            {/* Data Grid */}
            <div className="border border-border rounded-none shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-4 py-3 border-b border-border">Carrier Name</th>
                            <th className="px-4 py-3 border-b border-border">Products</th>
                            <th className="px-4 py-3 border-b border-border">Rating</th>
                            <th className="px-4 py-3 border-b border-border">Status</th>
                            <th className="px-4 py-3 border-b border-border text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {carriers.map((carrier) => (
                            <tr key={carrier.id} className="hover:bg-muted/5 transition-colors group">
                                <td className="px-4 py-3 font-medium text-foreground">{carrier.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{carrier.products} Lines</td>
                                <td className="px-4 py-3">
                                    <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-bold border border-blue-500/20 rounded-sm">
                                        {carrier.rating}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${carrier.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <span className="text-muted-foreground">{carrier.status}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button className="text-primary hover:underline text-xs font-medium flex items-center justify-end gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        Manage <ArrowUpRight size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
