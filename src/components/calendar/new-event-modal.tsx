'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Tag, AlignLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CalendarEventType } from '@/mock/calendar-events';
import { Modal } from '@/components/ui/modal';

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
    const [participant, setParticipant] = useState(''); // New field for SRS compliance
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Event Title Required', {
                description: 'Please enter a title for your event.',
            });
            return;
        }

        const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            participant, // Include in event object
            description,
            start: new Date(`${date}T${startTime}`),
            end: new Date(`${date}T${endTime}`),
            type,
            status: 'upcoming' as const,
        };

        onSave(newEvent);
        toast.success('Event Created', {
            description: `"${title}" has been added to your calendar.`,
            icon: <CheckCircle2 className="text-success-500" size={18} />,
        });

        // Reset and close
        setTitle('');
        setParticipant('');
        setDescription('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Calendar Event"
            description="Schedule meetings, renewals, or review sessions."
            size="md"
            footer={
                <div className="flex gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 px-4 rounded-[var(--radius-xl)] bg-surface-100 text-surface-700 font-bold hover:bg-surface-200 transition-all active:scale-95 cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSubmit} // Change to onClick since it's outside form
                        type="button"
                        className="flex-[2] py-4 px-4 rounded-[var(--radius-xl)] bg-primary-600 text-white font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95 cursor-pointer"
                    >
                        Book Event
                    </button>
                </div>
            }
        >
            <form id="new-event-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input
                        autoFocus
                        type="text"
                        placeholder="e.g., Client Consultation"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-semibold text-surface-900 shadow-sm placeholder:text-surface-400"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Client / Lead (SRS 5.4)</label>
                    <input
                        type="text"
                        placeholder="Search for client..."
                        value={participant}
                        onChange={(e) => setParticipant(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-surface-700 shadow-sm placeholder:text-surface-400"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <CalendarIcon size={12} /> Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all text-sm font-bold bg-surface-50/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Tag size={12} /> Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as CalendarEventType)}
                            className="w-full px-3 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all text-sm font-bold bg-surface-50/50 appearance-none"
                        >
                            <option value="meeting">Meeting</option>
                            <option value="policy">Policy Renewal</option>
                            <option value="claim">Claim Review</option>
                            <option value="team">Internal Scrum</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock size={12} /> Start Time
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-3 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all text-sm font-bold bg-surface-50/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Clock size={12} /> End Time
                        </label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-3 py-3 rounded-[var(--radius-md)] border border-surface-200 focus:border-primary-500 outline-none transition-all text-sm font-bold bg-surface-50/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <AlignLeft size={12} /> Notes & Description
                    </label>
                    <textarea
                        placeholder="Add any details or consultation notes here..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-3 rounded-[var(--radius-lg)] border border-surface-200 focus:border-primary-500 outline-none transition-all text-sm font-medium resize-none shadow-sm placeholder:text-surface-400"
                    />
                </div>
            </form>
        </Modal>
    );
}
