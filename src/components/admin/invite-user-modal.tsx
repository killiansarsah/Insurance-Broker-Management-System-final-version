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
        <div className="flex gap-3 w-full">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
                Cancel
            </Button>
            <Button
                variant="primary"
                className="flex-[2]"
                onClick={handleSubmit}
                isLoading={isLoading}
                leftIcon={<Mail size={18} />}
            >
                Send Invite
            </Button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Invite New User"
            description="Send an invitation to join the organization."
            size="md"
            footer={footer}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <User size={12} /> First Name
                        </label>
                        <Input
                            required
                            placeholder="e.g. Kwame"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <User size={12} /> Last Name
                        </label>
                        <Input
                            required
                            placeholder="e.g. Mensah"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                        <Mail size={12} /> Email Address
                    </label>
                    <Input
                        required
                        type="email"
                        placeholder="e.g. kwame.mensah@ibms.com.gh"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <Shield size={12} /> Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm bg-white"
                        >
                            <option value="admin">Admin</option>
                            <option value="branch_manager">Branch Manager</option>
                            <option value="senior_broker">Senior Broker</option>
                            <option value="broker">Broker</option>
                            <option value="data_entry">Data Entry</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-2">
                            <Building2 size={12} /> Branch
                        </label>
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all font-medium text-sm bg-white"
                        >
                            <option value="BR-ACC-01">Accra Main</option>
                            <option value="BR-KUM-01">Kumasi Branch</option>
                            <option value="BR-TAK-01">Takoradi Branch</option>
                        </select>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
