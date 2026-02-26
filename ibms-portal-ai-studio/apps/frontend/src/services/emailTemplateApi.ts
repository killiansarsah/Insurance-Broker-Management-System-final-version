// Email Template API Helper
// This file provides email template CRUD operations using localStorage

const getLocalData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setLocalData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getEmailTemplates = async () => {
  const templates = getLocalData('emailTemplates') || [];
  return {
    status: 200,
    data: { result: templates }
  };
};

export const getEmailTemplate = async (id: string) => {
  const templates = getLocalData('emailTemplates') || [];
  const template = templates.find((t: any) => t._id === id);
  if (template) {
    return {
      status: 200,
      data: { emailtemplate: template }
    };
  }
  return { status: 404, data: { message: 'Template not found' } };
};

export const addEmailTemplate = async (data: any) => {
  const templates = getLocalData('emailTemplates') || [];
  const newTemplate = {
    ...data,
    _id: Date.now().toString(),
    createdOn: new Date().toISOString()
  };
  templates.push(newTemplate);
  setLocalData('emailTemplates', templates);
  return { status: 201, data: { message: 'Template created successfully', template: newTemplate } };
};

export const updateEmailTemplate = async (id: string, data: any) => {
  const templates = getLocalData('emailTemplates') || [];
  const index = templates.findIndex((t: any) => t._id === id);
  if (index !== -1) {
    templates[index] = { ...templates[index], ...data, modifiedOn: new Date().toISOString() };
    setLocalData('emailTemplates', templates);
    return { status: 200, data: { message: 'Template updated successfully' } };
  }
  return { status: 404, data: { message: 'Template not found' } };
};

export const deleteEmailTemplate = async (id: string) => {
  const templates = getLocalData('emailTemplates') || [];
  const filtered = templates.filter((t: any) => t._id !== id);
  setLocalData('emailTemplates', filtered);
  return { status: 200, data: { message: 'Template deleted successfully' } };
};

export const deleteManyEmailTemplates = async (ids: string[]) => {
  const templates = getLocalData('emailTemplates') || [];
  const filtered = templates.filter((t: any) => !ids.includes(t._id));
  setLocalData('emailTemplates', filtered);
  return { status: 200, data: { message: `${ids.length} template(s) deleted successfully` } };
};
