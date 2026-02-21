'use client';

import { useState } from 'react';
import { User } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CustomSelect } from '@/components/ui/select-custom';
import { Shield, UserPlus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface DelegationModalProps {
    isOpen: boolean;
    onClose: () => void;
    staffMember: User | null;
    allStaff: User[];
    onSave: (staffId: string, backupId: string | null) => void;
}

export function DelegationModal({ isOpen, onClose, staffMember, allStaff, onSave }: DelegationModalProps) {
    const [selectedBackupId, setSelectedBackupId] = useState<string | null>(staffMember?.delegatedTo || null);

    if (!staffMember) return null;

    const availableBackups = allStaff
        .filter(u => u.id !== staffMember.id && u.isActive)
        .map(u => ({
            label: `${u.firstName} ${u.lastName} (${u.role.replace('_', ' ')})`,
            value: u.id
        }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Delegation & Backup"
            description={`Assign a backup person to handle tasks for ${staffMember.firstName} ${staffMember.lastName}`}
            size="md"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onSave(staffMember.id, selectedBackupId);
                            onClose();
                        }}
                        className="bg-primary-600 hover:bg-primary-700"
                    >
                        Save Delegation
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 py-2">
                <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0">
                        {staffMember.firstName[0]}{staffMember.lastName[0]}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Active Staff Member</p>
                        <p className="text-sm font-bold text-surface-900">{staffMember.firstName} {staffMember.lastName}</p>
                        <p className="text-xs text-surface-500 uppercase font-medium">{staffMember.role.replace('_', ' ')} • {staffMember.branchId}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">
                        Select Backup Proxy
                    </label>
                    <CustomSelect
                        placeholder="Choose a colleague..."
                        options={availableBackups}
                        value={selectedBackupId}
                        onChange={(val) => setSelectedBackupId(val != null ? String(val) : null)}
                        className="w-full"
                        icon={<UserPlus size={14} />}
                        clearable
                    />
                </div>

                {selectedBackupId && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl shadow-lg ring-4 ring-emerald-500/5"
                    >
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg animate-pulse">
                                <Check size={20} strokeWidth={3} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-emerald-900 uppercase tracking-widest leading-none mb-1">Backup Proxy Authorized</p>
                                <p className="text-[11px] font-bold text-emerald-700/80 leading-relaxed italic">
                                    &quot;Continuity is key. This colleague will now oversee all pending tasks and alerts for this account.&quot;
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!selectedBackupId && (
                    <div className="p-4 bg-amber-500/5 border border-amber-200/50 rounded-2xl flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-amber-900 uppercase tracking-widest leading-none mb-1">No Active Delegation</p>
                            <p className="text-[11px] font-bold text-amber-700/80 leading-relaxed">
                                Currenly, no one is covering for this staff member. Any tasks assigned to them will remain in their queue.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
