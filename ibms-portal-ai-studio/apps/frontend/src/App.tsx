/**
 * IBMS Portal - Main Application Component
 * 
 * @fileoverview This is the root component of the IBMS (Insurance Broker Management System) portal.
 * It defines the complete application routing structure and wraps the app with necessary providers.
 * 
 * @description
 * The application is built for the Ghanaian insurance market and includes:
 * - Policy management (Motor and Non-Motor)
 * - Claims processing and tracking
 * - Client relationship management (CRM)
 * - Renewals pipeline with 30/60/90-day tracking
 * - Commission calculations with NIC levy (1%) and WHT (5%)
 * - Compliance tracking for NIC regulations
 * - Comprehensive reporting and analytics
 * 
 * @remarks
 * - Uses HashRouter for client-side routing compatibility
 * - All routes are wrapped in the Layout component for consistent UI
 * - YearProvider enables fiscal year context throughout the app
 * - Login page is the default route ("/")
 * - All other routes require authentication (handled by Layout component)
 * 
 * @author IBMS Ghana Development Team
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Policies from './pages/policies/Policies';
import CreatePolicy from './pages/policies/CreatePolicy';
import PolicyDetails from './pages/policies/PolicyDetails';
import EditPolicy from './pages/policies/EditPolicy';
import Quotes from './pages/quotes/Quotes';
import CreateQuote from './pages/quotes/CreateQuote';
import ViewQuote from './pages/quotes/ViewQuote';
import EditQuote from './pages/quotes/EditQuote';
import Clients from './pages/clients/Clients';
import Insurers from './pages/insurers/Insurers';
import Finance from './pages/finance/Finance';
import Reports from './pages/reports/Reports';
import Notifications from './pages/settings/Notifications';
import UserManagement from './pages/settings/UserManagement';
import RolesPermissions from './pages/settings/RolesPermissions';
import AddUser from './pages/settings/AddUser';
import Calendar from './pages/settings/Calendar';
import Tasks from './pages/settings/Tasks';
import Integrations from './pages/settings/Integrations';
import EmailSettings from './pages/settings/EmailSettings';
import PushAlertsSettings from './pages/settings/PushAlertsSettings';
import ChangePasswordSettings from './pages/settings/ChangePasswordSettings';
import LoginHistorySettings from './pages/settings/LoginHistorySettings';
import TwoFactorSettings from './pages/settings/TwoFactorSettings';
import OrganizationSettings from './pages/settings/OrganizationSettings';
import ProfileSettings from './pages/settings/ProfileSettings';
import ThemeSettings from './pages/settings/ThemeSettings';
import LayoutSettings from './pages/settings/LayoutSettings';
import FiscalYearSettings from './pages/settings/FiscalYearSettings';
import Settings from './pages/settings/Settings';
import Claims from './pages/claims/Claims';
import CreateClaim from './pages/claims/CreateClaim';
import ViewClaim from './pages/claims/ViewClaim';
import EditClaim from './pages/claims/EditClaim';
import Accounting from './pages/accounting/Accounting';
import DataOverview from './pages/settings/DataOverview';
import Leads from './pages/leads/Leads';
import ViewLead from './pages/leads/ViewLead';
import EmailTemplates from './pages/email-templates/EmailTemplates';
import AddEmailTemplate from './pages/email-templates/AddEmailTemplate';
import ViewEmailTemplate from './pages/email-templates/ViewEmailTemplate';
import EditEmailTemplate from './pages/email-templates/EditEmailTemplate';
import Renewals from './pages/renewals/Renewals';
import ViewRenewal from './pages/renewals/ViewRenewal';
import EditRenewal from './pages/renewals/EditRenewal';
import Commissions from './pages/commissions/Commissions';
import Compliance from './pages/compliance/Compliance';
import Layout from './components/layout/Layout';
import { YearProvider } from './context/YearContext';

/**
 * Main Application Component
 * 
 * @description
 * Root component that sets up routing and global providers for the IBMS portal.
 * Organizes routes into logical groups:
 * - Authentication (Login)
 * - Core Features (Dashboard, Policies, Claims, Clients)
 * - Business Operations (Renewals, Commissions, Compliance)
 * - Support Features (Leads, Quotes, Email Templates)
 * - Settings & Configuration
 * 
 * @returns {JSX.Element} The complete application with routing and providers
 * 
 * @example
 * // Application is rendered in main.tsx
 * <App />
 */
const App: React.FC = () => {
  return (
    <YearProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Layout title="Dashboard Overview"><Dashboard /></Layout>} />
          
          {/* Policy Routes */}
          <Route path="/policies/motor" element={<Layout title="Motor Portfolio Management"><Policies filterType="Motor" /></Layout>} />
          <Route path="/policies/non-motor" element={<Layout title="Non-Motor (General) Portfolio"><Policies filterType="Non-Motor" /></Layout>} />
          <Route path="/policies/create" element={<Layout title="Create New Policy"><CreatePolicy /></Layout>} />
          <Route path="/policies" element={<Navigate to="/policies/motor" replace />} />
          <Route path="/policies" element={<Navigate to="/policies/motor" replace />} />
          <Route path="/policies/view/:policyId" element={<Layout title="Policy Master Record"><PolicyDetails /></Layout>} />
          <Route path="/policies/edit/:id" element={<Layout title="Edit Policy"><EditPolicy /></Layout>} />

          {/* Quote Routes */}
          <Route path="/quotes" element={<Layout title="Quotation Management"><Quotes /></Layout>} />
          <Route path="/quotes/create" element={<Layout title="Generate Quotation"><CreateQuote /></Layout>} />
          <Route path="/quotes/view/:id" element={<Layout title="Quote Details"><ViewQuote /></Layout>} />
          <Route path="/quotes/edit/:id" element={<Layout title="Update Quotation"><EditQuote /></Layout>} />
          
          {/* Lead Routes */}
          <Route path="/leads" element={<Layout title="Lead Management"><Leads /></Layout>} />
          <Route path="/leads/view/:id" element={<Layout title="Lead Details"><ViewLead /></Layout>} />
          
          {/* Renewals Route */}
          <Route path="/renewals" element={<Layout title="Renewals Pipeline"><Renewals /></Layout>} />
          <Route path="/renewals/view/:id" element={<Layout title="Renewal Details"><ViewRenewal /></Layout>} />
          <Route path="/renewals/edit/:id" element={<Layout title="Edit Renewal Information"><EditRenewal /></Layout>} />
          
          {/* Email Template Routes */}
          <Route path="/email-templates" element={<Layout title="Email Templates"><EmailTemplates /></Layout>} />
          <Route path="/email-templates/add" element={<Layout title="Create Template"><AddEmailTemplate /></Layout>} />
          <Route path="/email-templates/view/:id" element={<Layout title="Template Details"><ViewEmailTemplate /></Layout>} />
          <Route path="/email-templates/edit/:id" element={<Layout title="Edit Template"><EditEmailTemplate /></Layout>} />
          
          <Route path="/clients" element={<Layout title="Client Portfolios"><Clients /></Layout>} />
          <Route path="/claims" element={<Layout title="Claims Management"><Claims /></Layout>} />
          <Route path="/claims/create" element={<Layout title="Register New Claim"><CreateClaim /></Layout>} />
          <Route path="/claims/view/:id" element={<Layout title="Claim Details"><ViewClaim /></Layout>} />
          <Route path="/claims/edit/:id" element={<Layout title="Update Claim Particulars"><EditClaim /></Layout>} />
          <Route path="/insurers" element={<Layout title="Insurer Management"><Insurers /></Layout>} />
          <Route path="/data-overview" element={<Layout title="Master Ledger Archive"><DataOverview /></Layout>} />
          <Route path="/accounting" element={<Layout title="Accounting & Ledgers"><Accounting /></Layout>} />
          <Route path="/finance" element={<Layout title="Finance & Commission"><Finance /></Layout>} />
          <Route path="/commissions" element={<Layout title="Commission Tracking"><Commissions /></Layout>} />
          <Route path="/compliance" element={<Layout title="Compliance Dashboard"><Compliance /></Layout>} />
          <Route path="/reports" element={<Layout title="Analytics & Reports"><Reports /></Layout>} />
          <Route path="/notifications" element={<Layout title="Notifications & Renewals"><Notifications /></Layout>} />
          <Route path="/users" element={<Layout title="User Management"><UserManagement /></Layout>} />
          <Route path="/users/add" element={<Layout title="Add New User"><AddUser /></Layout>} />
          <Route path="/settings/roles" element={<Layout title="Roles & Permissions"><RolesPermissions /></Layout>} />
          <Route path="/calendar" element={<Layout title="Calendar"><Calendar /></Layout>} />
          <Route path="/tasks" element={<Layout title="Daily Task List"><Tasks /></Layout>} />
          <Route path="/integrations" element={<Layout title="Integrations & Imports"><Integrations /></Layout>} />
          
          {/* Settings Sub-Routes */}
          <Route path="/settings/email" element={<Layout title="Email Notifications Configuration"><EmailSettings /></Layout>} />
          <Route path="/settings/push" element={<Layout title="Push Alerts Management"><PushAlertsSettings /></Layout>} />
          <Route path="/settings/password" element={<Layout title="Security: Change Password"><ChangePasswordSettings /></Layout>} />
          <Route path="/settings/login-history" element={<Layout title="Security: Login History"><LoginHistorySettings /></Layout>} />
          <Route path="/settings/2fa" element={<Layout title="Security: Two-Factor Auth"><TwoFactorSettings /></Layout>} />
          <Route path="/settings/organization" element={<Layout title="Organization Profile"><OrganizationSettings /></Layout>} />
          <Route path="/settings/profile" element={<Layout title="Your Personal Profile"><ProfileSettings /></Layout>} />
          <Route path="/settings/theme" element={<Layout title="App Experience: Theme"><ThemeSettings /></Layout>} />
          <Route path="/settings/layout" element={<Layout title="App Experience: Layout"><LayoutSettings /></Layout>} />
          <Route path="/settings/fiscal-year" element={<Layout title="App Experience: Fiscal Year"><FiscalYearSettings /></Layout>} />
          <Route path="/settings" element={<Layout title="System Settings"><Settings /></Layout>} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </YearProvider>
  );
};

export default App;
