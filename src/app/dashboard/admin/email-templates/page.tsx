'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data-display/data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Send, 
  Code, 
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  displayName: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: string[];
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testData, setTestData] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    variables: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/email/templates');
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = selectedTemplate 
        ? `/api/admin/email/templates/${selectedTemplate.id}`
        : '/api/admin/email/templates';
      
      const method = selectedTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Template ${selectedTemplate ? 'updated' : 'created'} successfully`);
        setIsEditing(false);
        setSelectedTemplate(null);
        fetchTemplates();
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save template');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (template: EmailTemplate) => {
    if (template.isSystem) {
      toast.error('System templates cannot be deleted');
      return;
    }

    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/admin/email/templates/${template.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Template deleted successfully');
        fetchTemplates();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleTest = async () => {
    if (!selectedTemplate || !testEmail) {
      toast.error('Please select a template and enter test email');
      return;
    }

    try {
      const response = await fetch(`/api/admin/email/templates/${selectedTemplate.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: testEmail,
          templateData: testData,
        }),
      });

      if (response.ok) {
        toast.success('Test email queued successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast.error('Failed to send test email');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      subject: '',
      htmlContent: '',
      textContent: '',
      variables: [],
      isActive: true,
    });
  };

  const editTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      displayName: template.displayName,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent || '',
      variables: template.variables,
      isActive: template.isActive,
    });
    setIsEditing(true);
  };

  const previewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
    
    // Initialize test data with placeholder values
    const testDataInit: Record<string, string> = {};
    template.variables.forEach(variable => {
      testDataInit[variable] = `[${variable}]`;
    });
    setTestData(testDataInit);
  };

  const columns = [
    {
      accessorKey: 'displayName',
      header: 'Template Name',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.displayName}</div>
          <div className="text-sm text-muted-foreground">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }: any) => (
        <div className="max-w-[300px] truncate" title={row.original.subject}>
          {row.original.subject}
        </div>
      ),
    },
    {
      accessorKey: 'variables',
      header: 'Variables',
      cell: ({ row }: any) => (
        <div className="flex flex-wrap gap-1">
          {row.original.variables.slice(0, 3).map((variable: string) => (
            <Badge key={variable} variant="secondary" className="text-xs">
              {variable}
            </Badge>
          ))}
          {row.original.variables.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.variables.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          {row.original.isActive ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
          {row.original.isSystem && (
            <Badge variant="outline">System</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }: any) => (
        <div className="text-sm">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => previewTemplate(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editTemplate(row.original)}
            disabled={row.original.isSystem}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original)}
            disabled={row.original.isSystem}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={templates}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Edit Template' : 'Create Template'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject line"
                  />
                </div>

                <div>
                  <Label htmlFor="htmlContent">HTML Content</Label>
                  <Textarea
                    id="htmlContent"
                    value={formData.htmlContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, htmlContent: e.target.value }))}
                    placeholder="HTML email content"
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="textContent">Plain Text Content (Optional)</Label>
                  <Textarea
                    id="textContent"
                    value={formData.textContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, textContent: e.target.value }))}
                    placeholder="Plain text version"
                    rows={8}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="template_name (lowercase, underscores)"
                    disabled={selectedTemplate?.isSystem}
                  />
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Human readable name"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Template is active</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4">
              <div>
                <Label>Template Variables</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Use variables in your template with double curly braces: {`{{variableName}}`}
                </p>
                <Textarea
                  value={formData.variables.join('\n')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    variables: e.target.value.split('\n').filter(v => v.trim()) 
                  }))}
                  placeholder="Enter one variable per line"
                  rows={8}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedTemplate ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Template: {selectedTemplate?.displayName}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="test">Test Email</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              {selectedTemplate && (
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <strong>Subject:</strong> {selectedTemplate.subject}
                  </div>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedTemplate.htmlContent.replace(
                        /\{\{(\w+)\}\}/g, 
                        (match, variable) => testData[variable] || match
                      )
                    }}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email to send test"
                />
              </div>

              {selectedTemplate && selectedTemplate.variables.length > 0 && (
                <div>
                  <Label>Test Data</Label>
                  <div className="grid gap-2 mt-2">
                    {selectedTemplate.variables.map(variable => (
                      <div key={variable} className="flex items-center gap-2">
                        <Label className="w-32">{variable}:</Label>
                        <Input
                          value={testData[variable] || ''}
                          onChange={(e) => setTestData(prev => ({ 
                            ...prev, 
                            [variable]: e.target.value 
                          }))}
                          placeholder={`Value for ${variable}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handleTest} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}