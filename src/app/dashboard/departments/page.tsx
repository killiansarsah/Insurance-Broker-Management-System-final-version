'use client';

import { useState } from 'react';
import {
    Building2,
    Users,
    Plus,
    Edit,
    Search,
    Shield,
    Settings,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/api/use-users';
import { useDepartments } from '@/hooks/api/useOther';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Department {
    id: string;
    name: string;
    code: string;
    description: string;
    headId?: string;
    headName?: string;
    branchName: string;
    memberCount: number;
    color: string;
}

const DEPT_COLORS = [
    'bg-primary-50 text-primary-700 border-primary-200',
    'bg-success-50 text-success-700 border-success-200',
    'bg-orange-50 text-orange-700 border-orange-200',
    'bg-yellow-50 text-yellow-700 border-yellow-200',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-blue-50 text-blue-700 border-blue-200',
];

export default function DepartmentsPage() {
    const [search, setSearch] = useState('');
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const { data: usersData } = useUsers();
    const { data: deptsData, isLoading } = useDepartments();
    const allUsers: any[] = (usersData as any)?.items ?? usersData ?? [];

    const departments: Department[] = ((deptsData as any[]) ?? []).map((d: any, i: number) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        description: d.description ?? '',
        headId: d.head?.id,
        headName: d.head ? `${d.head.firstName} ${d.head.lastName}` : undefined,
        branchName: d.branch?.name ?? '',
        memberCount: d.memberCount ?? 0,
        color: d.color && DEPT_COLORS.find(c => c.includes(d.color)) ? DEPT_COLORS.find(c => c.includes(d.color))! : DEPT_COLORS[i % DEPT_COLORS.length],
    }));

    const filtered = departments.filter(d =>
        search === '' ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase()) ||
        d.branchName.toLowerCase().includes(search.toLowerCase())
    );

    const totalMembers = departments.reduce((s, d) => s + d.memberCount, 0);

    const deptMembers = selectedDept
        ? allUsers.filter((u: any) => u.departmentId === selectedDept.id)
        : [];
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Departments</h1>
                    <p className="text-sm text-surface-500 mt-1">Manage teams, roles, and organisational structure.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" leftIcon={<Settings size={16} />} onClick={() => toast.info('Opening settings…')}>Settings</Button>
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => toast.info('New Department', { description: 'Department creation form coming soon.' })}>New Department</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary-50 text-primary-600"><Users size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Total Staff</p>
                        <p className="text-2xl font-bold">{totalMembers}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-success-50 text-success-600"><Building2 size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">Departments</p>
                        <p className="text-2xl font-bold">{departments.length}</p>
                    </div>
                </Card>
                <Card padding="md" className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning-50 text-warning-600"><Users size={20} /></div>
                    <div>
                        <p className="text-xs font-semibold text-surface-500 uppercase">All Users</p>
                        <p className="text-2xl font-bold">{allUsers.length}</p>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card padding="md">
                <div className="relative max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search departments…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </Card>

            {/* Departments grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-surface-500">Loading departments…</p>
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(dept => (
                    <div
                        key={dept.id}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-surface-200/60 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedDept(selectedDept?.id === dept.id ? null : dept)}
                    >
                        <div className={cn('p-4 flex items-start gap-4 border-l-4', dept.color.split(' ').filter(c => c.startsWith('border')).join(' ') || 'border-primary-400')}>
                            <div className={cn('p-2.5 rounded-lg shrink-0', ...dept.color.split(' '))}>
                                <Building2 size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-semibold text-surface-900 text-sm leading-snug">{dept.name}</h3>
                                    <span className="shrink-0 text-xs font-mono text-surface-400">{dept.code}</span>
                                </div>
                                <p className="text-xs text-surface-500 mt-1">{dept.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-surface-600">
                                    <span className="flex items-center gap-1"><Users size={11} />{dept.memberCount} staff</span>
                                    {dept.branchName && <span className="flex items-center gap-1"><Building2 size={11} />{dept.branchName}</span>}
                                    {dept.headName && <span className="flex items-center gap-1"><Shield size={11} />Head: {dept.headName}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Expanded members panel */}
                        {selectedDept?.id === dept.id && deptMembers.length > 0 && (
                            <div className="border-t border-surface-100 bg-surface-50 p-4 space-y-2">
                                <p className="text-xs font-semibold text-surface-500 uppercase mb-2">Team Members</p>
                                {deptMembers.map(member => (
                                    <div key={member.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-surface-100">
                                        <div className="size-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                                            {member.firstName[0]}{member.lastName[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-surface-800 truncate">{member.firstName} {member.lastName}</p>
                                            <p className="text-xs text-surface-400 capitalize">{member.role.replace(/_/g, ' ')}</p>
                                        </div>
                                        <span className={cn('size-2 rounded-full', member.isActive ? 'bg-success-500' : 'bg-surface-300')} />
                                    </div>
                                ))}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-2"
                                    leftIcon={<Edit size={12} />}
                                    onClick={e => { e.stopPropagation(); toast.info('Edit Department', { description: 'Department editor coming soon.' }); }}
                                >
                                    Manage Department
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}
