import { Building2 } from 'lucide-react';

const mockTopTenants = [
  { id: '1', name: 'Vanguard Insurance Group', count: 12450, percentage: 34, mrr: 21500 },
  { id: '2', name: 'Horizon Brokers Ltd', count: 8320, percentage: 22, mrr: 15400 },
  { id: '3', name: 'Apex Secure Solutions', count: 5100, percentage: 14, mrr: 9800 },
  { id: '4', name: 'Meridian Capital', count: 3200, percentage: 9, mrr: 7500 },
  { id: '5', name: 'Sterling Risk Mgmt', count: 2100, percentage: 6, mrr: 4200 },
];

export function TopTenantsTable() {
  return (
    <div 
      className="p-5 flex flex-col sa-card-hover"
      style={{
        backgroundColor: 'var(--sa-bg-card)',
        border: '1px solid var(--sa-border)',
        borderRadius: 'var(--sa-radius-md)',
        height: '100%',
        minHeight: 380,
        boxShadow: 'var(--sa-shadow-card)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold font-serif text-[var(--sa-text-primary)] mb-1">Top Performing Tenants</h3>
          <p className="text-xs text-[var(--sa-text-muted)]">By active policy volume & MRR</p>
        </div>
        <Building2 size={24} className="text-[#1D9E75] opacity-20" />
      </div>

      <div className="flex-1 overflow-x-auto text-sm">
        <table className="w-full text-left font-sans">
          <thead>
            <tr className="border-b border-[#d4e0dc] text-[#7a9a8c] text-[10px] uppercase font-bold tracking-widest">
              <th className="pb-3 pr-4 font-bold">Tenant Name</th>
              <th className="pb-3 px-4 font-bold text-right">Policies</th>
              <th className="pb-3 pl-4 font-bold text-right">MRR (GHS)</th>
            </tr>
          </thead>
          <tbody>
            {mockTopTenants.map((t, idx) => (
              <tr 
                key={t.id} 
                className="border-b border-[#f0f4f3] hover:bg-[#f8faf9] transition-colors sa-reveal"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <td className="py-3 pr-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  {/* Progress bar representing percentage */}
                  <div className="w-full bg-[#e6ecea] h-1.5 mt-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#1D9E75] h-full" 
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-right text-[#021a13]">
                  {t.count.toLocaleString()}
                </td>
                <td className="py-3 pl-4 font-mono text-right text-[#0f6e56]">
                  {t.mrr.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
