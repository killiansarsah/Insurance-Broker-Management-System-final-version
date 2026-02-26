
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path?: string;
  icon: string;
  label: string;
  isGroup?: boolean;
  items?: MenuItem[];
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // State for collapsible sections (all expanded by default)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'MANAGE': true,
    'FINANCIALS': true,
    'TOOLS': true,
    'SETTINGS': true,
  });

  // State for nested item groups (like Policies)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'policies': false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const menuSections: MenuSection[] = [
    {
      section: 'MANAGE',
      items: [
        { path: '/leads', icon: 'person_search', label: 'Leads' },
        { path: '/quotes', icon: 'request_quote', label: 'Quotes' },
        { 
          icon: 'description', 
          label: 'Policies',
          isGroup: true,
          items: [
            { path: '/policies/motor', icon: 'directions_car', label: 'Motor' },
            { path: '/policies/non-motor', icon: 'business', label: 'Non-Motor' },
          ]
        },
        { path: '/claims', icon: 'warning', label: 'Claims' },
        { path: '/renewals', icon: 'autorenew', label: 'Renewals' },
        { path: '/clients', icon: 'group', label: 'Clients' },
        { path: '/insurers', icon: 'domain', label: 'Insurers' },
        { path: '/data-overview', icon: 'table_chart', label: 'Data Overview' },
      ]
    },
    {
      section: 'FINANCIALS',
      items: [
        { path: '/commissions', icon: 'payments', label: 'Commissions' },
        { path: '/accounting', icon: 'receipt_long', label: 'Accounting' },
        { path: '/finance', icon: 'monitoring', label: 'Finance Overview' },
        { path: '/reports', icon: 'bar_chart', label: 'Reports' },
      ]
    },
    {
      section: 'TOOLS',
      items: [
        { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
        { path: '/tasks', icon: 'task_alt', label: 'Tasks' },
        { path: '/email-templates', icon: 'email', label: 'Email Templates' },
        { path: '/integrations', icon: 'extension', label: 'Integrations' },
      ]
    },
    {
      section: 'SETTINGS',
      items: [
        { path: '/compliance', icon: 'verified', label: 'Compliance' },
        { path: '/settings', icon: 'settings', label: 'General Settings' },
      ]
    }
  ];

  const renderNestedItem = (item: MenuItem, parentKey: string) => {
    if (item.isGroup && item.items) {
      const groupId = item.label.toLowerCase().replace(/\s+/g, '-');
      // Special handling for Policies group to include view/edit/create routes
      const isPoliciesGroup = item.label === 'Policies';
      const isPolicyRoute = location.pathname.startsWith('/policies');
      
      const hasActiveChild = item.items.some(subItem => subItem.path && isActive(subItem.path)) || (isPoliciesGroup && isPolicyRoute);
      const isExpanded = expandedGroups[groupId] || hasActiveChild;

      return (
        <div key={groupId}>
          {/* Group Header */}
          <button
            onClick={() => toggleGroup(groupId)}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
              transition-all duration-200 group relative
              ${hasActiveChild 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              } hover-lift
            `}
          >
            {hasActiveChild && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
            <span className={`material-symbols-outlined text-[20px] ${hasActiveChild ? 'icon-fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
            <span className={`material-symbols-outlined text-[16px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Sub-items */}
          {isExpanded && (
            <div className="ml-4 mt-1 flex flex-col gap-1 relative">
              {/* Vertical tree line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>
              
              {item.items.map((subItem, subIndex) => {
                const isLast = subIndex === item.items!.length - 1;
                return (
                  <div key={subItem.path} className="relative">
                    {/* Horizontal tree connector */}
                    <div className="absolute left-2 top-1/2 w-3 h-px bg-slate-200 dark:bg-slate-700"></div>
                    
                    {/* End cap for last item */}
                    {isLast && (
                      <div className="absolute left-2 top-1/2 bottom-0 w-px bg-white dark:bg-slate-900"></div>
                    )}
                    
                    <Link
                      to={subItem.path!}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 pl-7 pr-4 py-2 rounded-xl
                        transition-all duration-200 group relative
                        ${isActive(subItem.path!) 
                          ? 'bg-primary/10 text-primary font-semibold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                        } hover-lift
                      `}
                    >
                      {isActive(subItem.path!) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                      )}
                      <span className={`material-symbols-outlined text-[18px] ${isActive(subItem.path!) ? 'icon-fill' : ''}`}>
                        {subItem.icon}
                      </span>
                      <span className="text-sm font-medium">{subItem.label}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Regular item
    return (
      <Link
        key={item.path}
        to={item.path!}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-4 py-2.5 rounded-xl
          transition-all duration-200 group relative
          ${isActive(item.path!) 
            ? 'bg-primary/10 text-primary font-semibold' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
          } hover-lift
        `}
      >
        {isActive(item.path!) && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
        )}
        <span className={`material-symbols-outlined text-[20px] ${isActive(item.path!) ? 'icon-fill' : ''}`}>
          {item.icon}
        </span>
        <span className="text-sm font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden transition-opacity" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[280px] bg-white dark:bg-slate-900 
        border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center size-12 shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl">shield_person</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">IBMS Ghana</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Insurance Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-4 py-6 gap-1 overflow-y-auto">
          {/* Dashboard - Always visible */}
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl mb-2
              transition-all duration-200 group relative
              ${isActive('/dashboard') 
                ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              } hover-lift
            `}
          >
            {isActive('/dashboard') && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
            )}
            <span className={`material-symbols-outlined text-[20px] ${isActive('/dashboard') ? 'icon-fill' : ''}`}>
              home
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          {/* Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={section.section}>
              {/* Section Label - Clickable with collapse/expand */}
              <button
                onClick={() => toggleSection(section.section)}
                className="w-full px-4 py-3 mt-4 mb-1 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-lg transition-colors group"
              >
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  {section.section}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className={`material-symbols-outlined text-[16px] text-slate-400 dark:text-slate-500 transition-transform ${expandedSections[section.section] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Section Items - Collapsible */}
              {expandedSections[section.section] && (
                <div className="flex flex-col gap-1 animate-fadeIn">
                  {section.items.map((item, index) => renderNestedItem(item, `${section.section}-${index}`))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
