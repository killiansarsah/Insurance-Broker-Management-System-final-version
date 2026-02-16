'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Shield, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('broker');
    const [branch, setBranch] = useState('BR-ACC-01');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        toast.success('Invitation Sent', {
            description: `An invite link has been sent to ${email}`,
            icon: <Mail className="text-success-500" size={18} />
        });

        // Reset
        setEmail('');
        setFirstName('');
        setLastName('');
        setIsLoading(false);
        onClose();
    };

    const footer = (
        <div className="flex justify-center gap-3 w-full">
            <button
                type="button"
                onClick={onClose}
                className="py-3 px-8 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                type="button"
                className="py-3 px-12 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
            >
                Send Invite
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Invite New User"
            description="Send an invitation to join the organization."
            size="xl"
            footer={footer}
            className="overflow-visible"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User size={12} className="text-primary-500" /> First Name
                        </label>
                        <input
                            required
                            placeholder="e.g. Kwame"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <User size={12} className="text-primary-500" /> Last Name
                        </label>
                        <input
                            required
                            placeholder="e.g. Mensah"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Mail size={12} className="text-primary-500" /> Email Address
                    </label>
                    <input
                        required
                        type="email"
                        placeholder="e.g. kwame.mensah@ibms.com.gh"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Shield size={12} className="text-accent-500" /> Organizational Role
                        </label>
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 appearance-none cursor-pointer"
                            >
                                <option value="admin">Admin</option>
                                <option value="branch_manager">Branch Manager</option>
                                <option value="senior_broker">Senior Broker</option>
                                <option value="broker">Broker</option>
                                <option value="data_entry">Data Entry</option>
                                <option value="viewer">Viewer</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Building2 size={12} className="text-accent-500" /> Assigned Branch
                        </label>
                        <div className="relative">
                            <select
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-surface-900 bg-white/50 appearance-none cursor-pointer"
                            >
                                <option value="BR-ACC-01">Accra Main</option>
                                <option value="BR-KUM-01">Kumasi Branch</option>
                                <option value="BR-TAK-01">Takoradi Branch</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
