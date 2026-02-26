
/**
 * IBMS Portal - Header Component
 * 
 * @fileoverview Main header/navigation bar component that appears at the top of every page.
 * Provides global navigation controls, search, notifications, and user profile access.
 * 
 * @description
 * The Header component includes:
 * - Page title display with fiscal year indicator
 * - Global search functionality with debouncing
 * - Notification center with unread count and priority indicators
 * - User profile dropdown with quick settings access
 * - Theme toggle (light/dark mode)
 * - Mobile menu trigger
 * 
 * @remarks
 * - Sticky positioned at top with high z-index (50)
 * - Integrates with YearContext for fiscal year display
 * - Uses localStorage for user profile persistence
 * - Implements click-outside detection for dropdowns
 * - Search debounces at 600ms to prevent excessive operations
 * - Notifications support priority levels (High/Medium/Low)
 * 
 * @author IBMS Ghana Development Team
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useYear } from '../../context/YearContext';
import Avatar from '../ui/Avatar';

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** Page title to display in the header */
  title: string;
  /** Callback function to toggle mobile sidebar menu */
  onMenuClick: () => void;
}

/**
 * Header Component
 * 
 * @description
 * Top navigation bar with search, notifications, and user profile.
 * Features:
 * - Responsive design (mobile hamburger menu, desktop full layout)
 * - Real-time notification system with unread badges
 * - User profile with avatar and quick actions
 * - Global search with loading indicator
 * - Fiscal year context integration
 * 
 * @param {HeaderProps} props - Component props
 * @returns {JSX.Element} The header navigation bar
 * 
 * @example
 * <Header 
 *   title="Dashboard Overview" 
 *   onMenuClick={() => setMobileMenuOpen(true)} 
 * />
 */
const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { selectedYear } = useYear();
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Search Debounce State
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, type: 'Renewal', title: 'POL-8821 (Motor) expiring in 3 days', time: '1h ago', priority: 'High', unread: true, icon: 'timelapse', color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
    { id: 2, type: 'Claim', title: 'Police Report missing for CLM-9921', time: '3h ago', priority: 'High', unread: true, icon: 'upload_file', color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
    { id: 3, type: 'Payment', title: 'Premium received: GH₵ 12,400 (Kofi Mensah)', time: '5h ago', priority: 'Low', unread: true, icon: 'payments', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 4, type: 'Compliance', title: 'Quarterly NIC Levy report due tomorrow', time: '6h ago', priority: 'High', unread: true, icon: 'warning', color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
    { id: 5, type: 'Quote', title: 'New quote request for Imperial General', time: '8h ago', priority: 'Medium', unread: true, icon: 'request_quote', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { id: 6, type: 'Claim', title: 'CLM-1022 (Fire) status: Offer Issued', time: '10h ago', priority: 'Medium', unread: true, icon: 'check_circle', color: 'text-primary bg-primary/10' },
    { id: 7, type: 'Lead', title: 'New hot lead: Ama Asante (Life)', time: '12h ago', priority: 'Medium', unread: false, icon: 'person_add', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { id: 8, type: 'System', title: 'Monthly performance report generated', time: '1d ago', priority: 'Low', unread: false, icon: 'analytics', color: 'text-primary bg-primary/10' },
    { id: 9, type: 'Renewal', title: 'Follow-up needed for Akua Owusu (Home)', time: '1d ago', priority: 'Medium', unread: false, icon: 'event_repeat', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
    { id: 10, type: 'Payment', title: 'Pending WHT refund verified by GRA', time: '2d ago', priority: 'Low', unread: false, icon: 'verified', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 11, type: 'Quote', title: 'Quote #4492 rejected by client (price)', time: '2d ago', priority: 'Low', unread: false, icon: 'cancel', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
    { id: 12, type: 'Compliance', title: 'Anti-Money Laundering certification renewal', time: '3d ago', priority: 'High', unread: false, icon: 'gavel', color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
    { id: 13, type: 'Support', title: 'Ticket #2991 resolved by IT Support', time: '4d ago', priority: 'Low', unread: false, icon: 'contact_support', color: 'text-primary bg-primary/10' },
    { id: 14, type: 'System', title: 'Database optimization completed', time: '5d ago', priority: 'Low', unread: false, icon: 'database', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
    { id: 15, type: 'Claim', title: 'New claim registered: CLM-1035 (Motor)', time: '1w ago', priority: 'Medium', unread: false, icon: 'add_box', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  ]);

  const markAsRead = (id: number) => {
    setRecentAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, unread: false } : alert
    ));
  };

  const markAllAsRead = () => {
    setRecentAlerts(prev => prev.map(alert => ({ ...alert, unread: false })));
  };

  const unreadCount = recentAlerts.filter(a => a.unread).length;

  // Profile state
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      firstName: 'James',
      lastName: 'Mensah',
      email: 'james.m@ibms.africa',
      jobTitle: 'Manager',
      avatar: ''
    };
  });

  useEffect(() => {
    // Listen for profile updates
    const handleProfileUpdate = (event: any) => {
      setUserProfile(event.detail);
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (!localSearchTerm) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const handler = setTimeout(() => {
      setIsSearching(false);
    }, 600);
    return () => clearTimeout(handler);
  }, [localSearchTerm]);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-4 sticky top-0 z-50 shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex flex-col">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight">{title}</h2>
          <div className="flex items-center gap-1.5 lg:hidden">
             <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">FY {selectedYear}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 flex-1 justify-center">
        {/* Centered Search Input */}
        <div className="hidden xl:flex flex-col min-w-[280px] max-w-[500px] h-10">
          <div className={`flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800 border transition-all ${isSearching ? 'border-primary/50' : 'border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'}`}>
            <div className="text-slate-500 flex items-center justify-center pl-3">
              {isSearching ? (
                <span className="animate-spin material-symbols-outlined text-[18px] text-primary">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">search</span>
              )}
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-500 px-3 text-sm focus:ring-0" 
              placeholder="Search policies, clients, claims..." 
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn z-[100]">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-br from-slate-50/80 to-transparent dark:from-slate-800/30 dark:to-transparent">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                  {recentAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      onClick={() => markAsRead(alert.id)}
                      className="p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-all cursor-pointer group"
                    >
                      <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${alert.color} group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-xl">{alert.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{alert.type}</span>
                          <span className="text-[9px] font-bold text-slate-400">{alert.time}</span>
                        </div>
                        <h4 className={`text-xs font-black truncate ${alert.unread ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{alert.title}</h4>
                      </div>
                      {alert.unread && (
                        <div className="size-2 rounded-full bg-primary shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {/* User Profile Pill */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all group"
            >
              {userProfile.avatar ? (
                <div className="size-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-800">
                  <img src={userProfile.avatar} alt={`${userProfile.firstName} ${userProfile.lastName}`} className="w-full h-full object-cover" />
                </div>
              ) : (
                <Avatar name={`${userProfile.firstName} ${userProfile.lastName}`} size="sm" />
              )}
              <div className="hidden sm:flex flex-col items-start overflow-hidden">
                <span className="text-slate-900 dark:text-white text-[11px] font-black truncate uppercase leading-none mb-0.5">
                  {userProfile.firstName.charAt(0)}. {userProfile.lastName.charAt(0)}.
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase truncate leading-none">
                  {userProfile.jobTitle || 'Manager'}
                </span>
              </div>
              <span className={`material-symbols-outlined text-slate-400 text-lg transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn z-[100] p-2">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                   <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{userProfile.email}</p>
                </div>
                <Link to="/settings/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 group/item transition-colors">
                  <span className="material-symbols-outlined text-xl text-slate-400 group-hover/item:text-primary transition-colors">account_circle</span>
                  <span className="text-xs font-black uppercase tracking-widest group-hover/item:text-slate-900 dark:group-hover/item:text-white">Profile</span>
                </Link>
                <Link to="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 group/item transition-colors">
                  <span className="material-symbols-outlined text-xl text-slate-400 group-hover/item:text-primary transition-colors">settings</span>
                  <span className="text-xs font-black uppercase tracking-widest group-hover/item:text-slate-900 dark:group-hover/item:text-white">Account</span>
                </Link>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <button 
                  onClick={() => navigate('/')}
                  className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 group/item transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
