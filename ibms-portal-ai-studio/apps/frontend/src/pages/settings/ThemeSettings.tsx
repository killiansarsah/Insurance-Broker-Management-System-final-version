
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ThemeSettings: React.FC = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme) setCurrentTheme(savedTheme);
  }, []);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      // System choice logic
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const themes = [
    { 
      id: 'light', 
      label: 'Light Mode', 
      desc: 'Optimized for day-time clarity and clean white aesthetics.',
      icon: 'light_mode', 
      previewColor: 'bg-slate-50 border-slate-200'
    },
    { 
      id: 'dark', 
      label: 'Dark Mode', 
      desc: 'Easier on the eyes in low light. Sleek enterprise dark design.',
      icon: 'dark_mode', 
      previewColor: 'bg-slate-900 border-slate-800'
    },
    { 
      id: 'system', 
      label: 'System Default', 
      desc: 'Automatically syncs with your device’s operating system settings.',
      icon: 'settings_brightness', 
      previewColor: 'bg-gradient-to-br from-slate-50 to-slate-900 border-slate-300'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Theme Preferences</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Personalize how the IBMS Portal appears on your screen.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <button 
            key={theme.id}
            onClick={() => applyTheme(theme.id as any)}
            className={`flex flex-col text-left rounded-3xl border-4 transition-all overflow-hidden group hover:scale-[1.02] ${
              currentTheme === theme.id 
              ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
              : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <div className={`h-32 w-full p-4 flex items-center justify-center border-b ${theme.previewColor}`}>
               <span className={`material-symbols-outlined text-4xl ${currentTheme === theme.id ? 'text-primary' : 'text-slate-400'}`}>
                {theme.icon}
               </span>
            </div>
            <div className="p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{theme.label}</span>
                {currentTheme === theme.id && (
                  <span className="material-symbols-outlined text-primary text-[20px] icon-fill">check_circle</span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {theme.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-primary/5 dark:bg-slate-900/50 rounded-3xl border border-primary/20 p-8 flex items-start gap-6">
        <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl">visibility</span>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-black text-primary uppercase tracking-tight">Accessibility Tip</h4>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Dark Mode is highly recommended for late-night audits to reduce digital eye strain. Your settings are saved locally and will be remembered on this device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
