'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { Mail, Send, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';

interface EmailLog {
  id: string;
  recipientEmail: string;
  subject: string;
  templateName: string;
  status: 'SENT' | 'FAILED' | 'QUEUED' | 'PROCESSING';
  sentAt?: string;
  failedAt?: string;
  errorMessage?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface EmailStats {
  totalEmails: number;
  totalSent: number;
  totalFailed: number;
  successRate: number;
  byTemplate: Record<string, number>;
  queueStatus: Record<string, number>;
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    templateName: '',
    recipientEmail: '',
    dateFrom: '',
    dateTo: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchEmailLogs();
    fetchEmailStats();
  }, [filters, pagination.page]);

  const fetchEmailLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
      });

      const response = await fetch(`/api/admin/email/logs?${params}`);
      const data = await response.json();
      
      setLogs(data.logs);
      setPagination(prev => ({
        ...prev,
        total: data.meta.total,
        totalPages: data.meta.totalPages,
      }));
    } catch (error) {
      console.error('Failed to fetch email logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailStats = async () => {
    try {
      const response = await fetch('/api/admin/email/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch email stats:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      SENT: { variant: 'success' as const, icon: CheckCircle, text: 'Sent' },
      FAILED: { variant: 'destructive' as const, icon: AlertCircle, text: 'Failed' },
      QUEUED: { variant: 'secondary' as const, icon: Clock, text: 'Queued' },
      PROCESSING: { variant: 'default' as const, icon: Send, text: 'Processing' },
    };

    const config = variants[status as keyof typeof variants] || variants.QUEUED;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'recipientEmail',
      label: 'Recipient',
      render: (row: any) => (
        <div>
          <div className="font-medium">{row.recipientEmail}</div>
          {row.user && (
            <div className="text-sm text-muted-foreground">
              {row.user.firstName} {row.user.lastName}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (row: any) => (
        <div className="max-w-[300px] truncate" title={row.subject}>
          {row.subject}
        </div>
      ),
    },
    {
      key: 'templateName',
      label: 'Template',
      render: (row: any) => (
        <Badge variant="outline">{row.templateName}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => getStatusBadge(row.status),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row: any) => (
        <div className="text-sm">
          {new Date(row.createdAt).toLocaleString()}
        </div>
      ),
    },
    {
      key: 'sentAt',
      label: 'Sent',
      render: (row: any) => (
        <div className="text-sm">
          {row.sentAt 
            ? new Date(row.sentAt).toLocaleString()
            : row.failedAt
            ? new Date(row.failedAt).toLocaleString()
            : '-'
          }
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Email Logs</h1>
        <Button onClick={fetchEmailLogs} disabled={loading}>
          <Mail className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmails.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalSent} sent, {stats.totalFailed} failed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats.queueStatus.queued || 0) + (stats.queueStatus.processing || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.queueStatus.queued || 0} queued, {stats.queueStatus.processing || 0} processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Template</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(stats.byTemplate).length > 0 
                  ? Object.entries(stats.byTemplate).sort(([,a], [,b]) => b - a)[0][1]
                  : 0
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.keys(stats.byTemplate).length > 0 
                  ? Object.entries(stats.byTemplate).sort(([,a], [,b]) => b - a)[0][0]
                  : 'No templates'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="QUEUED">Queued</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Template</label>
              <Input
                placeholder="Template name"
                value={filters.templateName}
                onChange={(e) => setFilters(prev => ({ ...prev, templateName: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Recipient</label>
              <Input
                placeholder="Email address"
                value={filters.recipientEmail}
                onChange={(e) => setFilters(prev => ({ ...prev, recipientEmail: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={fetchEmailLogs} disabled={loading}>
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setFilters({
                  status: '',
                  templateName: '',
                  recipientEmail: '',
                  dateFrom: '',
                  dateTo: '',
                });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={logs}
          />
        </CardContent>
      </Card>
    </div>
  );
}