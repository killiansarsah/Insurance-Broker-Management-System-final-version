'use client';

import { useRef, useCallback, useState } from 'react';
import { useProfileStore } from '@/stores/profile-store';
import Image from 'next/image';
import { toast } from 'sonner';

export function SettingsProfile() {
    const {
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        location,
        avatarUrl,
        updateProfile,
    } = useProfileStore();

    const [localFirstName, setLocalFirstName] = useState(firstName);
    const [localLastName, setLocalLastName] = useState(lastName);
    const [localEmail, setLocalEmail] = useState(email);
    const [localPhone, setLocalPhone] = useState(phone);
    const [localJobTitle, setLocalJobTitle] = useState(jobTitle || '');
    const [localLocation, setLocalLocation] = useState(location || '');

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('File Too Large', { description: 'Please select an image under 5MB.' }); return; }
        if (!file.type.startsWith('image/')) { toast.error('Invalid File Type', { description: 'Please select an image file (PNG, JPG, etc.).' }); return; }
        const url = URL.createObjectURL(file);
        updateProfile({ avatarUrl: url });
    }, [updateProfile]);

    const handleSave = () => {
        setIsSaving(true);
        updateProfile({
            firstName: localFirstName,
            lastName: localLastName,
            email: localEmail,
            phone: localPhone,
            jobTitle: localJobTitle,
            location: localLocation,
        });
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Save Button Header */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`h-12 px-10 rounded-xl bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                >
                    {isSaving ? <span className="animate-spin material-symbols-outlined text-lg">sync</span> : <span className="material-symbols-outlined text-lg">save</span>}
                    {isSaving ? 'Saving...' : 'Update Profile'}
                </button>
            </div>

            {/* Photo Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                    <div className="size-36 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden shadow-inner p-1 relative">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt="Profile" width={144} height={144} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <span className="material-symbols-outlined text-6xl text-slate-300">person</span>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 size-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                </div>
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Photo</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1" style={{ maxWidth: '20rem' }}>Upload a professional headshot. Recommended size: 400x400px.</p>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 h-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                            Change Photo
                        </button>
                        <button className="px-6 h-10 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors">
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            {/* Personal Info Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Personal Information</h3>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileInput label="First Name" value={localFirstName} onChange={setLocalFirstName} />
                    <ProfileInput label="Last Name" value={localLastName} onChange={setLocalLastName} />
                    <ProfileInput label="Work Email Address" value={localEmail} onChange={setLocalEmail} type="email" />
                    <ProfileInput label="Phone Number" value={localPhone} onChange={setLocalPhone} />
                </div>
            </div>

            {/* Professional Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Professional Context</h3>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileInput label="Job Title" value={localJobTitle} onChange={setLocalJobTitle} />
                    <ProfileInput label="Assigned Branch / Location" value={localLocation} onChange={setLocalLocation} />
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 right-10 z-[200] animate-fade-in">
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
                        <span className="material-symbols-outlined font-black text-emerald-500">check_circle</span>
                        <p className="text-sm font-black uppercase tracking-widest">Profile Saved</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProfileInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string; }) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-14 px-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 dark:text-white"
            />
        </div>
    );
}
