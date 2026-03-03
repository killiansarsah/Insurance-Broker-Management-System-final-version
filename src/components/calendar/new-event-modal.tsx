'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Tag, AlignLeft, CheckCircle2, MapPin, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarEventType, CalendarEventPriority } from '@/mock/calendar-events';
import { Modal } from '@/components/ui/modal';
import { CustomSelect } from '@/components/ui/select-custom';

interface NewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: any) => void;
    initialDate?: Date;
}

export function NewEventModal({ isOpen, onClose, onSave, initialDate }: NewEventModalProps) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [type, setType] = useState<CalendarEventType>('meeting');
    const [participant, setParticipant] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [priority, setPriority] = useState<CalendarEventPriority>('medium');

    // Sync date field and reset form whenever modal opens or initialDate changes
    useEffect(() => {
        if (isOpen) {
            setDate(initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
            setTitle('');
            setParticipant('');
            setDescription('');
            setStartTime('09:00');
            setEndTime('10:00');
            setType('meeting');
            setLocation('');
            setPriority('medium');
        }
    }, [isOpen, initialDate]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!title.trim()) {
            toast.error('Event Title Required', {
                description: 'Please enter a title for your event.',
            });
            return;
        }

        if (endTime <= startTime) {
            toast.error('Invalid Time Range', {
                description: 'End time must be after start time.',
            });
            return;
        }

        // Ensure times are properly parsed as local time to avoid timezone offsets
        const startDateTime = new Date(`${date}T${startTime}:00`);
        const endDateTime = new Date(`${date}T${endTime}:00`);

        const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            participant,
            description,
            start: startDateTime,
            end: endDateTime,
            type,
            priority,
            status: 'upcoming' as const,
            ...(location.trim() && { location: location.trim() }),
        };

        onSave(newEvent);
        toast.success('Event Created', {
            description: `"${title}" has been added to your calendar.`,
            icon: <CheckCircle2 className="text-success-500" size={18} />,
        });

        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Calendar Event"
            description="Schedule meetings, renewals, or review sessions."
            size="xl"
            footer={
                <div className="flex items-center gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 sm:flex-none py-3 px-6 rounded-[var(--radius-2xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer text-sm"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="flex-1 sm:flex-none py-3 px-8 rounded-[var(--radius-2xl)] bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer text-sm"
                    >
                        Book Event
                    </button>
                </div>
            }
        >
            <form id="new-event-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Event Title</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g., Client Consultation"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Client / Lead (SRS 5.4)</label>
                        <input
                            type="text"
                            placeholder="Search for client..."
                            value={participant}
                            onChange={(e) => setParticipant(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <CalendarIcon size={12} className="text-primary-500" /> Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm font-bold text-surface-900 bg-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Tag size={12} className="text-primary-500" /> Event Type
                        </label>
                        <CustomSelect
                            options={[
                                { label: 'Meeting', value: 'meeting' },
                                { label: 'Policy Renewal', value: 'policy' },
                                { label: 'Claim Review', value: 'claim' },
                                { label: 'Internal Scrum', value: 'team' },
                                { label: 'Compliance Deadline', value: 'compliance' },
                                { label: 'Payment Follow-up', value: 'payment' },
                            ]}
                            value={type}
                            onChange={(v) => setType(v as CalendarEventType)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MapPin size={12} className="text-primary-500" /> Location
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., NIC Office, Zoom, Client Site"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 shadow-sm placeholder:text-surface-400 bg-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <AlertTriangle size={12} className="text-warning-500" /> Priority
                        </label>
                        <CustomSelect
                            options={[
                                { label: 'Low', value: 'low' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'High', value: 'high' },
                                { label: 'Urgent', value: 'urgent' },
                            ]}
                            value={priority}
                            onChange={(v) => setPriority(v as CalendarEventPriority)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock size={12} className="text-accent-500" /> Start Time
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm font-bold text-surface-900 bg-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock size={12} className="text-accent-500" /> End Time
                        </label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm font-bold text-surface-900 bg-white/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AlignLeft size={12} className="text-surface-400" /> Notes & Description
                    </label>
                    <textarea
                        placeholder="Add any details or consultation notes here..."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-sm font-medium text-surface-700 bg-white/50 shadow-sm placeholder:text-surface-400 resize-none"
                    />
                </div>
            </form>
        </Modal>
    );
}
