
import React from 'react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const settingGroups = [
    {
      title: 'Your Profile',
      description: 'Manage your personal details, job title, location, and account avatar.',
      icon: 'account_circle',
      color: 'blue',
      items: [
        { label: 'Personal Information', path: '/settings/profile' },
        { label: 'Job & Location', path: '/settings/profile' },
      ]
    },
    {
      title: 'Organization Info',
      description: 'Manage corporate identity, office branches, and NIC registration details.',
      icon: 'corporate_fare',
      color: 'indigo',
      items: [
        { label: 'Organization Profile', path: '/settings/organization' },
        { label: 'Branch Management', path: '#' },
      ]
    },
    {
      title: 'Communications',
      description: 'Control how you receive alerts and system-wide notifications.',
      icon: 'notifications_none',
      color: 'emerald',
      items: [
        { label: 'Email Notifications', path: '/settings/email' },
        { label: 'Push Alerts', path: '/settings/push' },
      ]
    },
    {
      title: 'Security',
      description: 'Configure multi-factor authentication and password requirements.',
      icon: 'security',
      color: 'amber',
      items: [
        { label: 'Change Password', path: '/settings/password' },
        { label: 'Login History', path: '/settings/login-history' },
        { label: '2FA Settings', path: '/settings/2fa' },
      ]
    },
    {
      title: 'App Experience',
      description: 'Customize the interface, theme, and dashboard layout.',
      icon: 'palette',
      color: 'purple',
      items: [
        { label: 'Theme Preferences', path: '/settings/theme' },
        { label: 'Dashboard Layout', path: '/settings/layout' },
        { label: 'Fiscal Year Context', path: '/settings/fiscal-year' },
      ]
    },
    {
      title: 'Access Control',
      description: 'Manage system users, roles, and administrative permissions.',
      icon: 'admin_panel_settings',
      color: 'rose',
      items: [
        { label: 'User Management', path: '/users' },
        { label: 'Roles & Permissions', path: '/settings/roles' },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">System Settings</h1>
        <p className="text-slate-500 font-medium text-lg">Central hub for managing your personal workspace and enterprise configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col gap-6 hover:border-primary/30 transition-all group hover-lift cursor-pointer">
            <div className="flex items-start gap-6">
              <div className={`size-14 rounded-2xl flex items-center justify-center bg-${group.color}-50 text-${group.color}-600 dark:bg-${group.color}-900/20 dark:text-${group.color}-400 shrink-0 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-3xl">{group.icon}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{group.title}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{group.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              {group.items.map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group/item"
                >
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-primary transition-colors">{item.label}</span>
                  <span className="material-symbols-outlined text-slate-300 group-hover/item:text-primary transition-colors">chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
