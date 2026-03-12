'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Bell, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailPreferences {
  policyRenewal: boolean;
  claimUpdates: boolean;
  taskAssignments: boolean;
  systemNotifications: boolean;
  marketingEmails: boolean;
}

export default function EmailPreferencesPage() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    policyRenewal: true,
    claimUpdates: true,
    taskAssignments: true,
    systemNotifications: true,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/email-preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      toast.error('Failed to load email preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user/email-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast.success('Email preferences updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof EmailPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const preferenceItems = [
    {
      key: 'policyRenewal' as keyof EmailPreferences,
      title: 'Policy Renewal Reminders',
      description: 'Get notified when your policies are due for renewal (90, 60, and 30 days before expiry)',
      icon: FileText,
      category: 'Business Operations',
      importance: 'high',
    },
    {
      key: 'claimUpdates' as keyof EmailPreferences,
      title: 'Claim Status Updates',
      description: 'Receive notifications when claim statuses change (approved, rejected, settled)',
      icon: CheckCircle,
      category: 'Business Operations',
      importance: 'high',
    },
    {
      key: 'taskAssignments' as keyof EmailPreferences,
      title: 'Task Assignments',
      description: 'Get notified when tasks are assigned to you or when you assign tasks to others',
      icon: Users,
      category: 'Workflow',
      importance: 'medium',
    },
    {
      key: 'systemNotifications' as keyof EmailPreferences,
      title: 'System Notifications',
      description: 'Important system updates, security alerts, and account-related notifications',
      icon: Bell,
      category: 'System',
      importance: 'high',
    },
    {
      key: 'marketingEmails' as keyof EmailPreferences,
      title: 'Marketing & Promotional Emails',
      description: 'Product updates, feature announcements, and promotional content',
      icon: Mail,
      category: 'Marketing',
      importance: 'low',
    },
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high': return AlertTriangle;
      case 'medium': return Bell;
      case 'low': return CheckCircle;
      default: return Bell;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Email Preferences</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-100 rounded w-96"></div>
                  </div>
                  <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Preferences</h1>
          <p className="text-muted-foreground mt-2">
            Manage your email notification preferences to control what emails you receive.
          </p>
        </div>
        <Button onClick={savePreferences} disabled={saving}>
          <Settings className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Business Operations */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Business Operations
              </h3>
              <div className="space-y-4">
                {preferenceItems
                  .filter(item => item.category === 'Business Operations')
                  .map(item => {
                    const Icon = item.icon;
                    const ImportanceIcon = getImportanceIcon(item.importance);
                    
                    return (
                      <div key={item.key} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={item.key} className="font-medium cursor-pointer">
                                {item.title}
                              </Label>
                              <ImportanceIcon className={`h-4 w-4 ${getImportanceColor(item.importance)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={item.key}
                          checked={preferences[item.key]}
                          onCheckedChange={(checked) => updatePreference(item.key, checked)}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            <Separator />

            {/* Workflow */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Workflow & Collaboration
              </h3>
              <div className="space-y-4">
                {preferenceItems
                  .filter(item => item.category === 'Workflow')
                  .map(item => {
                    const Icon = item.icon;
                    const ImportanceIcon = getImportanceIcon(item.importance);
                    
                    return (
                      <div key={item.key} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={item.key} className="font-medium cursor-pointer">
                                {item.title}
                              </Label>
                              <ImportanceIcon className={`h-4 w-4 ${getImportanceColor(item.importance)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={item.key}
                          checked={preferences[item.key]}
                          onCheckedChange={(checked) => updatePreference(item.key, checked)}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            <Separator />

            {/* System & Marketing */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System & Marketing
              </h3>
              <div className="space-y-4">
                {preferenceItems
                  .filter(item => item.category === 'System' || item.category === 'Marketing')
                  .map(item => {
                    const Icon = item.icon;
                    const ImportanceIcon = getImportanceIcon(item.importance);
                    
                    return (
                      <div key={item.key} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={item.key} className="font-medium cursor-pointer">
                                {item.title}
                              </Label>
                              <ImportanceIcon className={`h-4 w-4 ${getImportanceColor(item.importance)}`} />
                              {item.category === 'System' && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={item.key}
                          checked={preferences[item.key]}
                          onCheckedChange={(checked) => updatePreference(item.key, checked)}
                          disabled={item.category === 'System'} // System notifications are required
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Important Notes</h4>
                <ul className="text-sm text-blue-800 mt-1 space-y-1">
                  <li>• System notifications cannot be disabled for security and compliance reasons</li>
                  <li>• Changes take effect immediately for new emails</li>
                  <li>• You can update these preferences at any time</li>
                  <li>• Critical security alerts will always be sent regardless of preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}