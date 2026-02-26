import axios from 'axios';

// Mock API service using localStorage for frontend-only implementation
// This simulates the backend API calls from InsuranceProCRM

const API_BASE_URL = 'http://localhost:5000/api'; // Not used in mock mode
const MOCK_MODE = true; // Set to true for frontend-only mode

// Helper to get data from localStorage
const getLocalData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper to save data to localStorage
const setLocalData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize sample data if not exists
const initializeSampleData = () => {
  if (!localStorage.getItem('calendar_meetings')) {
    const sampleMeetings = [
      {
        _id: '1',
        subject: 'Client Meeting - Policy Review',
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 90000000).toISOString(),
        duration: '1 hour',
        location: 'Conference Room A',
        note: 'Review annual policy renewals',
        backgroundColor: '#4caf50',
        textColor: '#ffffff',
        status: 'Planned',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' }
      },
      {
        _id: '2',
        subject: 'Team Standup',
        startDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        endDate: new Date(Date.now() + 174600000).toISOString(),
        duration: '30 minutes',
        location: 'Virtual',
        note: 'Weekly team sync',
        backgroundColor: '#2196f3',
        textColor: '#ffffff',
        status: 'Planned',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' }
      },
      {
        _id: '3',
        subject: 'Quarterly Business Review',
        startDate: new Date(Date.now() + 604800000).toISOString(), // 1 week
        endDate: new Date(Date.now() + 608400000).toISOString(),
        duration: '2 hours',
        location: 'Board Room',
        note: 'Q1 2026 performance review',
        backgroundColor: '#9c27b0',
        textColor: '#ffffff',
        status: 'Scheduled',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' }
      }
    ];
    setLocalData('calendar_meetings', sampleMeetings);
  }

  if (!localStorage.getItem('calendar_tasks')) {
    const sampleTasks = [
      {
        _id: '1',
        subject: 'Follow up with new leads',
        startDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        endDate: new Date(Date.now() + 262800000).toISOString(),
        note: 'Contact leads from last week',
        backgroundColor: '#ff9800',
        textColor: '#ffffff',
        status: 'Not Started',
        priority: 'High',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' }
      },
      {
        _id: '2',
        subject: 'Update CRM database',
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 90000000).toISOString(),
        note: 'Import new client data',
        backgroundColor: '#f44336',
        textColor: '#ffffff',
        status: 'In Progress',
        priority: 'Medium',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' }
      },
      {
        _id: '3',
        subject: 'Prepare monthly report',
        startDate: new Date(Date.now() + 432000000).toISOString(),
        endDate: new Date(Date.now() + 435600000).toISOString(),
        note: 'Sales and revenue analysis',
        backgroundColor: '#3f51b5',
        textColor: '#ffffff',
        status: 'Not Started',
        priority: 'Low',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' }
      }
    ];
    setLocalData('calendar_tasks', sampleTasks);
  }

  if (!localStorage.getItem('emails')) {
    const sampleEmails = [
      {
        _id: '1',
        subject: 'Policy Renewal Reminder',
        sender: 'admin@ibms.africa',
        receiver: 'client@example.com',
        body: 'Dear Client, Your insurance policy is due for renewal on January 15, 2026. Please contact us to discuss renewal options.',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: '2',
        subject: 'Welcome to IBMS Portal',
        sender: 'noreply@ibms.africa',
        receiver: 'newclient@example.com',
        body: 'Welcome to IBMS Portal! We are excited to have you on board. Your account has been successfully created.',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        _id: '3',
        subject: 'Claim Status Update',
        sender: 'claims@ibms.africa',
        receiver: 'client2@example.com',
        body: 'Your claim #CLM-2026-001 has been approved. The payment will be processed within 5 business days.',
        createdBy: { _id: 'user1', firstName: 'James', lastName: 'Miller' },
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    setLocalData('emails', sampleEmails);
  }

  if (!localStorage.getItem('leads')) {
    const sampleLeads = [
      {
        _id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        phoneNumber: '+1234567890',
        emailAddress: 'sarah.johnson@example.com',
        address: '123 Main Street, Accra',
        leadSource: 'Website',
        leadStatus: 'New',
        leadScore: 4,
        typeOfInsurance: 'Motor',
        desiredCoverageAmount: 50000,
        leadPriority: 'High',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: '2',
        firstName: 'Michael',
        lastName: 'Osei',
        phoneNumber: '+233244567890',
        emailAddress: 'michael.osei@example.com',
        address: '45 Independence Avenue, Kumasi',
        leadSource: 'Referral',
        leadStatus: 'Contacted',
        leadScore: 3.5,
        typeOfInsurance: 'Life',
        desiredCoverageAmount: 100000,
        leadPriority: 'Medium',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        _id: '3',
        firstName: 'Abena',
        lastName: 'Mensah',
        phoneNumber: '+233201234567',
        emailAddress: 'abena.mensah@example.com',
        address: '78 Castle Road, Cape Coast',
        leadSource: 'Social Media',
        leadStatus: 'Qualified',
        leadScore: 5,
        typeOfInsurance: 'Health',
        desiredCoverageAmount: 75000,
        leadPriority: 'High',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        _id: '4',
        firstName: 'Kwame',
        lastName: 'Agyeman',
        phoneNumber: '+233209876543',
        emailAddress: 'kwame.agyeman@example.com',
        address: '12 Ring Road, Tema',
        leadSource: 'Phone Call',
        leadStatus: 'In Progress',
        leadScore: 4.5,
        typeOfInsurance: 'Property',
        desiredCoverageAmount: 200000,
        leadPriority: 'High',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 345600000).toISOString()
      },
      {
        _id: '5',
        firstName: 'Ama',
        lastName: 'Boateng',
        phoneNumber: '+233245678901',
        emailAddress: 'ama.boateng@example.com',
        address: '56 Oxford Street, Accra',
        leadSource: 'Walk-in',
        leadStatus: 'Closed/Won',
        leadScore: 5,
        typeOfInsurance: 'Motor',
        desiredCoverageAmount: 60000,
        leadPriority: 'Medium',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 432000000).toISOString()
      },
      {
        _id: '6',
        firstName: 'Kofi',
        lastName: 'Asante',
        phoneNumber: '+233208765432',
        emailAddress: 'kofi.asante@example.com',
        address: '89 Liberation Road, Takoradi',
        leadSource: 'Advertisement',
        leadStatus: 'Closed/Lost',
        leadScore: 2,
        typeOfInsurance: 'Travel',
        desiredCoverageAmount: 15000,
        leadPriority: 'Low',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 518400000).toISOString()
      },
      {
        _id: '7',
        firstName: 'Efua',
        lastName: 'Owusu',
        phoneNumber: '+233241122334',
        emailAddress: 'efua.owusu@example.com',
        address: '34 Airport Road, Accra',
        leadSource: 'Website',
        leadStatus: 'New',
        leadScore: 3,
        typeOfInsurance: 'Business',
        desiredCoverageAmount: 150000,
        leadPriority: 'Medium',
        assignedAgent: 'user1',
        createdBy: 'user1',
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ];
    setLocalData('leads', sampleLeads);
  }

  // Initialize email templates
  if (!localStorage.getItem('emailTemplates')) {
    const sampleTemplates = [
      {
        _id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to IBMS - Your Insurance Partner',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h1 style="color: #667eea;">Welcome to IBMS!</h1><p>Dear {{clientName}},</p><p>Thank you for choosing IBMS as your insurance partner. We are committed to providing you with the best insurance solutions tailored to your needs.</p><p>Our team is here to assist you every step of the way.</p><p>Best regards,<br>The IBMS Team</p></div>',
        design: '',
        createdBy: 'user1',
        createdOn: new Date(Date.now() - 2592000000).toISOString()
      },
      {
        _id: '2',
        name: 'Policy Renewal Reminder',
        subject: 'Your Policy is Due for Renewal',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #667eea;">Policy Renewal Notice</h2><p>Dear {{clientName}},</p><p>This is a friendly reminder that your policy <strong>{{policyNumber}}</strong> is due for renewal on <strong>{{renewalDate}}</strong>.</p><p>To ensure continuous coverage, please contact us at your earliest convenience to discuss renewal options.</p><p>Policy Details:</p><ul><li>Policy Number: {{policyNumber}}</li><li>Coverage Type: {{coverageType}}</li><li>Renewal Date: {{renewalDate}}</li></ul><p>Best regards,<br>IBMS Renewals Team</p></div>',
        design: '',
        createdBy: 'user1',
        createdOn: new Date(Date.now() - 1728000000).toISOString()
      },
      {
        _id: '3',
        name: 'Claim Status Update',
        subject: 'Update on Your Claim {{claimNumber}}',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #667eea;">Claim Status Update</h2><p>Dear {{clientName}},</p><p>We are writing to update you on the status of your claim <strong>{{claimNumber}}</strong>.</p><p><strong>Current Status:</strong> {{claimStatus}}</p><p>{{statusMessage}}</p><p>If you have any questions, please don\'t hesitate to contact our claims department.</p><p>Sincerely,<br>IBMS Claims Team</p></div>',
        design: '',
        createdBy: 'user1',
        createdOn: new Date(Date.now() - 864000000).toISOString()
      },
      {
        _id: '4',
        name: 'Quote Ready',
        subject: 'Your Insurance Quote is Ready',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #667eea;">Your Quote is Ready!</h2><p>Dear {{clientName}},</p><p>Thank you for your interest in our insurance products. We have prepared a customized quote based on your requirements.</p><p><strong>Quote Summary:</strong></p><ul><li>Coverage Type: {{coverageType}}</li><li>Premium: {{premium}}</li><li>Coverage Amount: {{coverageAmount}}</li><li>Valid Until: {{validUntil}}</li></ul><p>Please review the attached quote document for complete details.</p><p>To proceed with this quote or discuss any modifications, please contact us.</p><p>Best regards,<br>IBMS Sales Team</p></div>',
        design: '',
        createdBy: 'user1',
        createdOn: new Date(Date.now() - 432000000).toISOString()
      },
      {
        _id: '5',
        name: 'Policy Issued Confirmation',
        subject: 'Your Policy Has Been Issued - {{policyNumber}}',
        html: '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #667eea;">Policy Issued Successfully</h2><p>Dear {{clientName}},</p><p>Congratulations! Your insurance policy has been successfully issued.</p><p><strong>Policy Details:</strong></p><ul><li>Policy Number: {{policyNumber}}</li><li>Coverage Type: {{coverageType}}</li><li>Effective Date: {{effectiveDate}}</li><li>Expiry Date: {{expiryDate}}</li><li>Premium: {{premium}}</li></ul><p>Your policy documents are attached to this email. Please review them carefully and keep them in a safe place.</p><p>Thank you for choosing IBMS!</p><p>Best regards,<br>IBMS Policy Services</p></div>',
        design: '',
        createdBy: 'user1',
        createdOn: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    setLocalData('emailTemplates', sampleTemplates);
  }
};

// Initialize on load
initializeSampleData();

// Mock API functions
export const apiget = async (endpoint: string) => {
  if (!MOCK_MODE) {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response;
  }

  // Mock responses based on endpoint
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

  if (endpoint.includes('meeting/list')) {
    const meetings = getLocalData('calendar_meetings');
    return {
      status: 200,
      data: { result: meetings }
    };
  }

  if (endpoint.includes('task/list')) {
    const tasks = getLocalData('calendar_tasks');
    return {
      status: 200,
      data: { result: tasks }
    };
  }

  if (endpoint.includes('email/list')) {
    const emails = getLocalData('emails');
    return {
      status: 200,
      data: { result: emails }
    };
  }

  if (endpoint.includes('calendar/google/status')) {
    return {
      status: 200,
      data: { connected: false, success: true }
    };
  }

  if (endpoint.includes('calendar/google/events')) {
    return {
      status: 200,
      data: { success: false, connected: false, events: [] }
    };
  }

  if (endpoint.includes('lead/list')) {
    const leads = getLocalData('leads');
    return {
      status: 200,
      data: { result: leads }
    };
  }

  if (endpoint.includes('lead/view/')) {
    const id = endpoint.split('/').pop();
    const leads = getLocalData('leads');
    const lead = leads.find((l: any) => l._id === id);
    if (lead) {
      return {
        status: 200,
        data: { lead }
      };
    }
    return { status: 404, data: { message: 'Lead not found' } };
  }

  return { status: 404, data: { message: 'Endpoint not found' } };
};

export const apipost = async (endpoint: string, data: any) => {
  if (!MOCK_MODE) {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
    return response;
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  if (endpoint.includes('meeting/add')) {
    const meetings = getLocalData('calendar_meetings');
    const newMeeting = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    meetings.push(newMeeting);
    setLocalData('calendar_meetings', meetings);
    return {
      status: 201,
      data: { result: newMeeting, message: 'Meeting created successfully' }
    };
  }

  if (endpoint.includes('task/add')) {
    const tasks = getLocalData('calendar_tasks');
    const newTask = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    setLocalData('calendar_tasks', tasks);
    return {
      status: 201,
      data: { result: newTask, message: 'Task created successfully' }
    };
  }

  if (endpoint.includes('lead/add')) {
    const leads = getLocalData('leads');
    const newLead = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    leads.push(newLead);
    setLocalData('leads', leads);
    return {
      status: 201,
      data: { result: newLead, message: 'Lead added successfully' }
    };
  }

  if (endpoint.includes('lead/convert/')) {
    const id = endpoint.split('/').pop();
    const leads = getLocalData('leads');
    const leadIndex = leads.findIndex((l: any) => l._id === id);
    if (leadIndex !== -1) {
      const lead = leads[leadIndex];
      leads[leadIndex] = { ...lead, leadStatus: 'Closed/Won', modifiedAt: new Date().toISOString() };
      setLocalData('leads', leads);
      return {
        status: 200,
        data: { contactId: `contact_${id}`, message: 'Lead converted to client successfully' }
      };
    }
    return { status: 404, data: { message: 'Lead not found' } };
  }

  return { status: 404, data: { message: 'Endpoint not found' } };
};

export const apiput = async (endpoint: string, data: any) => {
  if (!MOCK_MODE) {
    const response = await axios.put(`${API_BASE_URL}/${endpoint}`, data);
    return response;
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  if (endpoint.includes('meeting/edit/')) {
    const id = endpoint.split('/').pop();
    const meetings = getLocalData('calendar_meetings');
    const index = meetings.findIndex((m: any) => m._id === id);
    if (index !== -1) {
      meetings[index] = { ...meetings[index], ...data };
      setLocalData('calendar_meetings', meetings);
      return {
        status: 200,
        data: { result: meetings[index], message: 'Meeting updated successfully' }
      };
    }
  }

  if (endpoint.includes('task/edit/')) {
    const id = endpoint.split('/').pop();
    const tasks = getLocalData('calendar_tasks');
    const index = tasks.findIndex((t: any) => t._id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data };
      setLocalData('calendar_tasks', tasks);
      return {
        status: 200,
        data: { result: tasks[index], message: 'Task updated successfully' }
      };
    }
  }

  if (endpoint.includes('lead/edit/')) {
    const id = endpoint.split('/').pop();
    const leads = getLocalData('leads');
    const index = leads.findIndex((l: any) => l._id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...data, modifiedAt: new Date().toISOString() };
      setLocalData('leads', leads);
      return {
        status: 200,
        data: { result: leads[index], message: 'Lead updated successfully' }
      };
    }
  }

  return { status: 404, data: { message: 'Item not found' } };
};

export const apidelete = async (endpoint: string) => {
  if (!MOCK_MODE) {
    const response = await axios.delete(`${API_BASE_URL}/${endpoint}`);
    return response;
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  if (endpoint.includes('meeting/delete/')) {
    const id = endpoint.split('/').pop();
    const meetings = getLocalData('calendar_meetings');
    const filtered = meetings.filter((m: any) => m._id !== id);
    setLocalData('calendar_meetings', filtered);
    return {
      status: 200,
      data: { message: 'Meeting deleted successfully' }
    };
  }

  if (endpoint.includes('task/delete/')) {
    const id = endpoint.split('/').pop();
    const tasks = getLocalData('calendar_tasks');
    const filtered = tasks.filter((t: any) => t._id !== id);
    setLocalData('calendar_tasks', filtered);
    return {
      status: 200,
      data: { message: 'Task deleted successfully' }
    };
  }

  if (endpoint.includes('email/delete/')) {
    const id = endpoint.split('/').pop();
    const emails = getLocalData('emails');
    const filtered = emails.filter((e: any) => e._id !== id);
    setLocalData('emails', filtered);
    return {
      status: 200,
      data: { message: 'Email deleted successfully' }
    };
  }

  if (endpoint.includes('lead/delete/')) {
    const id = endpoint.split('/').pop();
    const leads = getLocalData('leads');
    const filtered = leads.filter((l: any) => l._id !== id);
    setLocalData('leads', filtered);
    return {
      status: 200,
      data: { message: 'Lead deleted successfully' }
    };
  }

  return { status: 404, data: { message: 'Item not found' } };
};

// Bulk delete function
export const deleteManyApi = async (endpoint: string, ids: string[]) => {
  if (!MOCK_MODE) {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, { ids });
    return response;
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  if (endpoint.includes('meeting/deletemany')) {
    const meetings = getLocalData('calendar_meetings');
    const filtered = meetings.filter((m: any) => !ids.includes(m._id));
    setLocalData('calendar_meetings', filtered);
    return {
      status: 200,
      data: { message: `${ids.length} meetings deleted successfully` }
    };
  }

  if (endpoint.includes('task/deletemany')) {
    const tasks = getLocalData('calendar_tasks');
    const filtered = tasks.filter((t: any) => !ids.includes(t._id));
    setLocalData('calendar_tasks', filtered);
    return {
      status: 200,
      data: { message: `${ids.length} tasks deleted successfully` }
    };
  }

  if (endpoint.includes('email/deletemany')) {
    const emails = getLocalData('emails');
    const filtered = emails.filter((e: any) => !ids.includes(e._id));
    setLocalData('emails', filtered);
    return {
      status: 200,
      data: { message: `${ids.length} emails deleted successfully` }
    };
  }

  if (endpoint.includes('lead/deletemany')) {
    const leads = getLocalData('leads');
    const filtered = leads.filter((l: any) => !ids.includes(l._id));
    setLocalData('leads', filtered);
    return {
      status: 200,
      data: { message: `${ids.length} leads deleted successfully` }
    };
  }

  return { status: 404, data: { message: 'Endpoint not found' } };
};
