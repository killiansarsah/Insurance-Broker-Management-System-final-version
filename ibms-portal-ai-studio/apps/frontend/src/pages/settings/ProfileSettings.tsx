
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile from localStorage or use defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      firstName: 'James',
      lastName: 'Mensah',
      email: 'james.mensah@ibms-brokers.africa',
      phone: '+233 (0) 24 555 6789',
      jobTitle: 'Senior Broker Manager',
      location: 'Accra HQ',
      avatar: ''
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));
    
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfile({ ...profile, avatar: '' });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/settings')}
            className="size-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Your Profile</h1>
            <p className="text-slate-500 font-medium text-lg mt-1">Personal identity and system role configuration.</p>
          </div>
        </div>
        <button 
          form="profile-form"
          type="submit"
          disabled={isSaving}
          className={`h-12 px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
        >
          {isSaving ? <span className="animate-spin material-symbols-outlined text-lg">sync</span> : <span className="material-symbols-outlined text-lg">save</span>}
          {isSaving ? 'Saving...' : 'Update Profile'}
        </button>
      </div>

      <form id="profile-form" onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Photo Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="size-36 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner font-black text-3xl text-primary">
              {profile.avatar ? (
                <img src={profile.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
              )}
            </div>
            <button 
              type="button" 
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">edit</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Photo</h3>
            <p className="text-sm font-medium text-slate-500 max-w-sm">
              Upload a professional portrait. This will be visible on internal task lists and broker reports.
            </p>
            <div className="flex gap-3 justify-center md:justify-start mt-2">
              <button 
                type="button" 
                onClick={triggerFileInput}
                className="text-[10px] font-black uppercase tracking-widest text-primary px-4 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                Change Photo
              </button>
              <button 
                type="button" 
                onClick={handleRemovePhoto}
                disabled={!profile.avatar}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${
                  profile.avatar 
                    ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20' 
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Personal Information</h3>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <input 
                type="email"
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Professional Context</h3>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                value={profile.jobTitle}
                onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Branch / Location</label>
              <input 
                className="h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm"
                value={profile.location}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                required
              />
            </div>
          </div>
        </div>
      </form>

      {/* Success Notification */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[200] animate-fadeIn">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <span className="material-symbols-outlined font-black text-emerald-500">check_circle</span>
            <p className="text-sm font-black uppercase tracking-widest">Profile Saved</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
