
/**
 * IBMS Portal - Dashboard Page
 * 
 * @fileoverview Main dashboard page displaying key performance indicators (KPIs),
 * charts, and analytics for the insurance broker business.
 * 
 * @description
 * The Dashboard provides:
 * - Real-time KPI cards (Premium, Commission, Policies, Retention)
 * - Attention alerts (Renewals, Claims, Commissions, NIC Reports)
 * - Monthly premium growth trend chart
 * - Policy distribution by type (donut chart)
 * - Top insurers by premium (horizontal bar chart)
 * - Quick action buttons for common tasks
 * 
 * @remarks
 * **Ghana-Specific Features:**
 * - Currency displayed in Ghana Cedis (GH₵)
 * - Net commission calculated at 8% after NIC levy (1%) deduction
 * - Tracks local insurers: GLICO, Enterprise, Hollard, Star, SIC
 * - NIC compliance reporting indicators
 * - Premium trust account tracking
 * 
 * **Data Filtering:**
 * - All data is filtered by selected fiscal year from YearContext
 * - Data is dynamically generated based on year multiplier
 * - Historical comparison with previous year
 * 
 * **Charts Used:**
 * - ComposedChart: Premium trend with growth line
 * - PieChart: Policy type distribution
 * - BarChart: Top insurers comparison
 * 
 * @author IBMS Ghana Development Team
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, ComposedChart, Line } from 'recharts';
import { useYear } from '../../context/YearContext';
import IconWrapper from '../../components/ui/IconWrapper';

/**
 * Generate dashboard data based on selected fiscal year
 * 
 * @description
 * Creates mock data for dashboard KPIs and charts. In production, this would
 * fetch data from the backend API filtered by fiscal year.
 * 
 * @param {number} year - The fiscal year to generate data for
 * @returns {Object} Dashboard data including KPIs and chart data
 * 
 * @remarks
 * - Uses a multiplier based on year to simulate growth
 * - Monthly performance includes net commission and premium
 * - Policy distribution covers Motor, Fire, Life, Marine, and Others
 * - Top insurers are Ghana's major insurance companies
 * - Commission calculated at 8% (10% base - 1% NIC levy - 1% WHT)
 * 
 * @example
 * const data = generateDashboardData(2023);
 * console.log(data.totalPremium); // Total premium for 2023
 */
const generateDashboardData = (year: number) => {
  const multiplier = (year - 2019) * 1.1;
  
  const monthlyPerformance = [
    { month: 'Jan', net: 14200 * multiplier, premium: 142000 * multiplier, growth: 12 },
    { month: 'Feb', net: 8400 * multiplier, premium: 84000 * multiplier, growth: 8 },
    { month: 'Mar', net: 11200 * multiplier, premium: 112000 * multiplier, growth: 15 },
    { month: 'Apr', net: 9800 * multiplier, premium: 98000 * multiplier, growth: -3 },
    { month: 'May', net: 12500 * multiplier, premium: 125000 * multiplier, growth: 18 },
    { month: 'Jun', net: 7600 * multiplier, premium: 76000 * multiplier, growth: -12 },
    { month: 'Jul', net: 10400 * multiplier, premium: 104000 * multiplier, growth: 10 },
  ];

  const policyDistribution = [
    { type: 'Motor', count: 450, premium: 540000 * multiplier, color: '#137fec' },
    { type: 'Fire', count: 320, premium: 480000 * multiplier, color: '#f59e0b' },
    { type: 'Life', count: 280, premium: 420000 * multiplier, color: '#10b981' },
    { type: 'Marine', count: 120, premium: 180000 * multiplier, color: '#a855f7' },
    { type: 'Others', count: 77, premium: 115500 * multiplier, color: '#64748b' },
  ];

  const topInsurers = [
    { name: 'GLICO', premium: 450000 * multiplier, commission: 36000 * multiplier },
    { name: 'Enterprise', premium: 320000 * multiplier, commission: 25600 * multiplier },
    { name: 'Hollard', premium: 280000 * multiplier, commission: 22400 * multiplier },
    { name: 'Star', premium: 180000 * multiplier, commission: 14400 * multiplier },
    { name: 'SIC', premium: 150000 * multiplier, commission: 12000 * multiplier },
  ];

  const totalPremium = 1480240 * multiplier;
  const netComm = 118419 * multiplier;
  const activePolicies = Math.floor(1247 * (1 + (year - 2024) * 0.1));
  const pendingRenewals = Math.floor(89 * (1 + (year - 2024) * 0.05));
  const openClaims = Math.floor(12 * (1 + (year - 2024) * 0.08));
  const retentionRate = 92 - (year - 2024);

  return { 
    monthlyPerformance, 
    policyDistribution, 
    topInsurers,
    totalPremium, 
    netComm,
    activePolicies,
    pendingRenewals,
    openClaims,
    retentionRate
  };
};

/**
 * Dashboard Component
 * 
 * @description
 * Main dashboard page showing business overview and key metrics.
 * 
 * **KPI Cards:**
 * - Total Premium: Sum of all policy premiums for selected year
 * - Net Commission: 8% commission after NIC levy and WHT deductions
 * - Active Policies: Current count of active insurance policies
 * - Client Retention: Percentage of clients who renewed
 * 
 * **Alert Panel:**
 * - Expiring Soon: Policies due for renewal
 * - Open Claims: Claims pending processing
 * - Pending Commission: Commission awaiting payment
 * - NIC Reports Due: Regulatory reports requiring submission
 * 
 * **Charts:**
 * 1. Premium Growth Trend: Monthly premium and growth rate
 * 2. Policy Distribution: Breakdown by policy type (Motor, Fire, Life, etc.)
 * 3. Top Insurers: Ranking by premium volume and commission
 * 
 * **Quick Actions:**
 * - Import Excel: Bulk data import
 * - Add Policy: Create new policy
 * - Carrier Audit: Generate audit reports
 * - Ledger Summary: View accounting ledger
 * 
 * @returns {JSX.Element} The dashboard page
 * 
 * @example
 * // Used in App.tsx routing
 * <Route path="/dashboard" element={<Layout title="Dashboard Overview"><Dashboard /></Layout>} />
 */
const Dashboard: React.FC = () => {
  const { selectedYear } = useYear();
  
  const { 
    monthlyPerformance, 
    policyDistribution, 
    topInsurers,
    totalPremium, 
    netComm,
    activePolicies,
    pendingRenewals,
    openClaims,
    retentionRate
  } = useMemo(() => generateDashboardData(selectedYear), [selectedYear]);

  const totalPolicies = policyDistribution.reduce((sum, p) => sum + p.count, 0);

  // Get user profile from localStorage
  const userProfile = useMemo(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      firstName: 'James',
      lastName: 'Mensah',
      jobTitle: 'Manager'
    };
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Welcome Greeting Banner */}
      <section 
        className="bg-gradient-to-r from-primary/10 via-blue-50 to-primary/5 dark:from-primary/20 dark:via-slate-900 dark:to-primary/10 rounded-2xl p-5 border border-primary/20 shadow-md"
        style={{
          animation: 'fadeIn 0.8s ease-out'
        }}
      >
        <style>{`
          @keyframes subtlePulse {
            0%, 100% {
              transform: scale(1) rotate(0deg);
              box-shadow: 0 10px 15px -3px rgba(19, 127, 236, 0.1);
            }
            50% {
              transform: scale(1.1) rotate(5deg);
              box-shadow: 0 20px 25px -5px rgba(19, 127, 236, 0.25);
            }
          }
        `}</style>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="size-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg"
              style={{
                animation: 'subtlePulse 2s ease-in-out infinite'
              }}
            >
              <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {getGreeting()}, {userProfile.firstName}!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Welcome back to your dashboard
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Today</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alert Panel */}
      <section className="bg-gradient-to-r from-blue-50 to-primary/5 dark:from-slate-900 dark:to-primary/5 rounded-3xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-2xl">notifications_active</span>
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Attention Required</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-rose-500 text-xl">schedule</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{pendingRenewals}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Expiring Soon</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500 text-xl">pending_actions</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{openClaims}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Open Claims</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">payments</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">GH₵ 45K</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Pending Comm.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-4">
            <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500 text-xl">task_alt</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">2</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">NIC Reports Due</p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards - Row 1 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg hover-lift">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Premium {selectedYear}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">GH₵ {totalPremium.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">+{((selectedYear - 2019) * 2).toFixed(1)}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">vs {selectedYear - 1}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden group hover-lift">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/20"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Net Commission (8%)</p>
          <p className="text-3xl font-black text-primary tracking-tighter">GH₵ {netComm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
             <span className="material-symbols-outlined text-sm">verified</span>
             After Levy Deductions
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg hover-lift">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Active Policies</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{activePolicies.toLocaleString()}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">+23 MTD</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">New Policies</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg hover-lift">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Client Retention</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{retentionRate}%</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{width: `${retentionRate}%`}}></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Target: 90%</span>
          </div>
        </div>
      </section>

      {/* Analytics Rows */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Premium Growth Trend */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-lg">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Premium Growth Trend</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Monthly Performance ({selectedYear})</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyPerformance}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                <YAxis yAxisId="left" hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'premium') return [`GH₵ ${value.toLocaleString()}`, 'Premium'];
                    if (name === 'growth') return [`${value}%`, 'Growth'];
                    return value;
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="premium" stroke="#137fec" strokeWidth={3} fillOpacity={1} fill="url(#colorPremium)" />
                <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Policy Distribution Donut */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Policy Distribution</h3>
          <div className="h-64 flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={policyDistribution} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="count">
                    {policyDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                 </Pie>
                 <Tooltip formatter={(value: any) => `${value} policies`} />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                 <p className="text-3xl font-black text-slate-900 dark:text-white">{totalPolicies}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
               </div>
             </div>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            {policyDistribution.map(p => (
              <div key={p.type} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{p.type}</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{p.count} ({((p.count/totalPolicies)*100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Insurers */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-lg">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Top Insurers by Premium</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topInsurers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 800 }} width={100} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any, name: string) => {
                  if (name === 'premium') return [`GH₵ ${value.toLocaleString()}`, 'Premium'];
                  if (name === 'commission') return [`GH₵ ${value.toLocaleString()}`, 'Commission'];
                  return value;
                }}
              />
              <Bar dataKey="premium" fill="#137fec" radius={[0, 8, 8, 0]} />
              <Bar dataKey="commission" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Bottom Actions */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Import Excel', icon: 'table_view', path: '/integrations' },
          { label: 'Add Policy', icon: 'add_moderator', path: '/policies/create' },
          { label: 'Carrier Audit', icon: 'assignment_turned_in', path: '/reports' },
          { label: 'Ledger Summary', icon: 'account_balance', path: '/accounting' },
        ].map((act) => (
          <Link key={act.label} to={act.path} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg transition-all flex items-center gap-4 group">
            <IconWrapper icon={act.icon} variant="primary" size="md" className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{act.label}</span>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
