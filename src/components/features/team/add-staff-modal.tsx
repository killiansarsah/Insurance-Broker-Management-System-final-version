'use client';

import { useState } from 'react';
import { User, UserRole } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomSelect } from '@/components/ui/select-custom';
import { Mail, Phone, Building2, Briefcase } from 'lucide-react';

interface AddStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (staff: User) => void;
}

const roleOptions = [
    { label: 'Broker', value: 'broker' },
    { label: 'Senior Broker', value: 'senior_broker' },
    { label: 'Branch Manager', value: 'branch_manager' },
    { label: 'Secretary', value: 'secretary' },
    { label: 'Data Entry', value: 'data_entry' },
];

const branchOptions = [
    { label: 'Accra Office', value: 'BR-ACC-01' },
    { label: 'Kumasi Office', value: 'BR-KUM-01' },
];

export function AddStaffModal({ isOpen, onClose, onAdd }: AddStaffModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'broker' as UserRole,
        branchId: 'BR-ACC-01',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            id: `usr-${Math.floor(Math.random() * 1000)}`,
            isActive: true,
            createdAt: new Date().toISOString(),
        });
        onClose();
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'broker',
            branchId: 'BR-ACC-01',
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Register New Staff Member"
            description="Onboard a new member to the IBMS fleet. Complete all fields below to grant system access."
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8 py-2">
                {/* Section: Personal Information */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                            <span className="text-[10px] font-black">1</span>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-surface-700">Personal Information</h3>
                        <div className="flex-1 h-px bg-surface-200/50 ml-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">First Name</label>
                            <Input
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                placeholder="e.g. Kwame"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">Last Name</label>
                            <Input
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                placeholder="e.g. Asante"
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Contact Details */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <span className="text-[10px] font-black">2</span>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-surface-700">Contact Details</h3>
                        <div className="flex-1 h-px bg-surface-200/50 ml-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                                <Input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="kwame@ibms.com.gh"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                                <Input
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+233 24 000 0000"
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Role & Assignment */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <span className="text-[10px] font-black">3</span>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-surface-700">Role & Assignment</h3>
                        <div className="flex-1 h-px bg-surface-200/50 ml-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">Assigned Role</label>
                            <CustomSelect
                                options={roleOptions}
                                value={formData.role}
                                onChange={(val) => setFormData(prev => ({ ...prev, role: val as UserRole }))}
                                className="w-full"
                                icon={<Briefcase size={14} />}
                            />
                        </div>
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] font-black uppercase tracking-widest text-surface-500 block ml-1">Branch Office</label>
                            <CustomSelect
                                options={branchOptions}
                                value={formData.branchId}
                                onChange={(val) => setFormData(prev => ({ ...prev, branchId: val }))}
                                className="w-full"
                                icon={<Building2 size={14} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-between border-t border-surface-200/30">
                    <p className="text-[10px] text-surface-400 font-medium">All fields are mandatory for system access.</p>
                    <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose}>Discard</Button>
                        <Button type="submit" className="bg-primary-900 text-white px-10 shadow-lg hover:shadow-xl hover:bg-primary-800 transition-all">Confirm &amp; Onboard</Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
