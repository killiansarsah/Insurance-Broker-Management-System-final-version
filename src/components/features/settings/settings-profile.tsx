'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useProfileStore } from '@/stores/profile-store';
import { useAuthStore } from '@/stores/auth-store';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/api/use-settings';
import Image from 'next/image';
import { toast } from 'sonner';

export function SettingsProfile() {
    const { avatarUrl, updateProfile: updateStore } = useProfileStore();
    const { data: profile } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const uploadAvatarMutation = useUploadAvatar();
    const authUser = useAuthStore((s) => s.user);

    const [localFirstName, setLocalFirstName] = useState('');
    const [localLastName, setLocalLastName] = useState('');
    const [localEmail, setLocalEmail] = useState('');
    const [localPhone, setLocalPhone] = useState('');
    const [localJobTitle, setLocalJobTitle] = useState('');
    const [localLocation, setLocalLocation] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Populate local state from API data
    useEffect(() => {
        if (profile) {
            setLocalFirstName(profile.firstName || '');
            setLocalLastName(profile.lastName || '');
            setLocalEmail(profile.email || '');
            setLocalPhone((profile.phone as string) || '');
            setLocalJobTitle((profile.role as string)?.replace(/_/g, ' ') || 'None Assigned');
            setLocalLocation(((profile as any).branch?.name as string) || 'Main Branch');
            // Hydrate avatar from backend if available
            if (profile.avatarUrl) {
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
                const fullUrl = (profile.avatarUrl as string).startsWith('http')
                    ? (profile.avatarUrl as string)
                    : `${backendBase}${profile.avatarUrl}`;
                updateStore({ avatarUrl: fullUrl });
            } else {
                updateStore({ avatarUrl: null });
            }
        }
    }, [profile, updateStore]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('File Too Large', { description: 'Please select an image under 5MB.' }); return; }
        if (!file.type.startsWith('image/')) { toast.error('Invalid File Type', { description: 'Please select an image file (PNG, JPG, etc.).' }); return; }

        uploadAvatarMutation.mutate(file, {
            onSuccess: (data: any) => {
                const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
                const fullUrl = `${backendBase}${data.avatarUrl}`;
                updateStore({ avatarUrl: fullUrl });
                const currentUser = useAuthStore.getState().user;
                if (currentUser) {
                    useAuthStore.setState({ user: { ...currentUser, avatarUrl: fullUrl } });
                }
                toast.success('Photo Updated', { description: 'Your profile photo has been uploaded.' });
            },
            onError: () => {
                toast.error('Upload Failed', { description: 'Could not upload photo. Please try again.' });
            },
        });
    }, [updateStore, uploadAvatarMutation]);

    const handleSave = () => {
        setIsSaving(true);
        updateProfileMutation.mutate(
            {
                firstName: localFirstName,
                lastName: localLastName,
                phone: localPhone,
            },
            {
                onSuccess: () => {
                    updateStore({
                        firstName: localFirstName,
                        lastName: localLastName,
                        phone: localPhone,
                        jobTitle: localJobTitle,
                        location: localLocation,
                    });
                    // Update auth store so the header/nav reflects the new name
                    if (authUser) {
                        useAuthStore.setState({
                            user: { ...authUser, firstName: localFirstName, lastName: localLastName },
                        });
                    }
                    setIsSaving(false);
                    toast.success('Profile Saved', { description: 'Your profile has been updated successfully.' });
                },
                onError: () => {
                    setIsSaving(false);
                    toast.error('Save Failed', { description: 'Could not update your profile. Please try again.' });
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Save Button Header */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`h-12 px-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
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
                            <Image 
                                src={avatarUrl.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001'}${avatarUrl}` : avatarUrl} 
                                alt="Profile" 
                                width={144} 
                                height={144} 
                                unoptimized={true}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
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
                        className="absolute bottom-1 right-1 size-11 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                    >
                        <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                </div>
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Profile Photo</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1 max-w-xs">Upload a professional headshot. Recommended size: 400x400px.</p>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 h-10 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                            Change Photo
                        </button>
                        <button onClick={() => {
                            updateProfileMutation.mutate({ avatarUrl: '' }, {
                                onSuccess: () => {
                                    updateStore({ avatarUrl: null });
                                    const currentUser = useAuthStore.getState().user;
                                    if (currentUser) {
                                        useAuthStore.setState({ user: { ...currentUser, avatarUrl: undefined } });
                                    }
                                    toast.success('Photo Removed', { description: 'Your profile photo has been removed.' });
                                },
                            });
                        }} className="px-6 h-10 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors cursor-pointer">
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
                    <ProfileInput label="Work Email Address" value={localEmail} onChange={() => {}} type="email" disabled={true} />
                    <ProfileInput label="Phone Number" value={localPhone} onChange={setLocalPhone} />
                </div>
            </div>

            {/* Professional Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Professional Context</h3>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileInput label="Job Title" value={localJobTitle} onChange={() => {}} disabled={true} />
                    <ProfileInput label="Assigned Branch / Location" value={localLocation} onChange={() => {}} disabled={true} />
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

function ProfileInput({ label, value, onChange, type = "text", disabled = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean }) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`h-14 px-5 bg-slate-50 dark:bg-slate-800 border ${disabled ? 'border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-70' : 'border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary-500/10'} rounded-2xl text-sm font-bold outline-none transition-all dark:text-white`}
            />
        </div>
    );
}
