import { User } from '@/types';

export const users: User[] = [
    {
        id: 'usr-001',
        tenantId: 'platform',
        email: 'admin@ibms.com.gh',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'platform_super_admin',
        phone: '+233 24 123 4567',
        branchId: 'HQ',
        isActive: true,
        lastLogin: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        createdAt: '2023-01-01T08:00:00Z'
    },
    {
        id: 'usr-002',
        tenantId: 'tenant-001',
        email: 'ernest.osei@ibms.com.gh',
        firstName: 'Dr. Ernest',
        lastName: 'Osei',
        role: 'tenant_admin',
        phone: '+233 20 987 6543',
        branchId: 'BR-ACC-01',
        isActive: true,
        lastLogin: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        createdAt: '2023-01-15T10:00:00Z'
    },
    {
        id: 'usr-003',
        email: 'kwame.mensah@ibms.com.gh',
        firstName: 'Kwame',
        lastName: 'Mensah',
        role: 'senior_broker',
        phone: '+233 55 444 3322',
        branchId: 'BR-ACC-01',
        isActive: true,
        lastLogin: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        createdAt: '2023-02-01T09:00:00Z'
    },
    {
        id: 'usr-004',
        email: 'ama.serwaa@ibms.com.gh',
        firstName: 'Ama',
        lastName: 'Serwaa',
        role: 'broker',
        phone: '+233 27 555 6677',
        branchId: 'BR-KUM-01',
        isActive: true,
        lastLogin: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        createdAt: '2023-03-10T14:30:00Z'
    },
    {
        id: 'usr-005',
        email: 'emmanuel.tetteh@ibms.com.gh',
        firstName: 'Emmanuel',
        lastName: 'Tetteh',
        role: 'broker',
        phone: '+233 24 888 9900',
        branchId: 'BR-ACC-01',
        isActive: true,
        lastLogin: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        createdAt: '2023-04-05T11:15:00Z'
    },
    {
        id: 'usr-006',
        email: 'support@ibms.com.gh',
        firstName: 'Tech',
        lastName: 'Support',
        role: 'data_entry',
        phone: '+233 30 222 1100',
        branchId: 'BR-ACC-01',
        isActive: false,
        lastLogin: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
        createdAt: '2023-05-20T16:00:00Z'
    },
    {
        id: 'usr-007',
        email: 'mercy.danquah@ibms.com.gh',
        firstName: 'Mercy',
        lastName: 'Danquah',
        role: 'secretary',
        phone: '+233 24 555 1122',
        branchId: 'BR-ACC-01',
        isActive: true,
        lastLogin: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        createdAt: '2023-06-01T08:30:00Z'
    },
    {
        id: 'usr-008',
        tenantId: 'tenant-001',
        email: 'john.mensah@ibms.com.gh',
        firstName: 'John',
        lastName: 'Mensah',
        role: 'broker',
        phone: '+233 24 999 0011',
        branchId: 'BR-KUM-01',
        isActive: true,
        delegatedTo: 'usr-004', // Delegated to Ama Serwaa
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        createdAt: '2023-06-15T10:00:00Z'
    }
];
