'use client';

import React, { useState, useMemo } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    isToday,
    startOfDay,
    endOfDay,
    addWeeks,
    subWeeks
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockEvents as initialEvents, CalendarEvent } from '@/mock/calendar-events';
import { toast } from 'sonner';
import { NewEventModal } from './new-event-modal';

export interface CalendarViewHandle {
    openModal: (date?: Date) => void;
}

export const CalendarView = React.forwardRef<CalendarViewHandle, {}>((props, ref) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);

    React.useImperativeHandle(ref, () => ({
        openModal: (date?: Date) => {
            handleOpenModal(date);
        }
    }));


    const next = () => {
        if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
        else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const prev = () => {
        if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
        else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const resetToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const handleOpenModal = (date?: Date) => {
        setModalInitialDate(date);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (newEvent: any) => {
        setEvents([...events, newEvent]);
        setIsModalOpen(false);
    };

    const renderHeader = () => {
        const headerText = view === 'month'
            ? format(currentDate, 'MMMM yyyy')
            : view === 'week'
                ? `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM d, yyyy');

        return (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 px-2 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-[var(--radius-lg)] bg-primary-500/10 text-primary-500">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
                            {headerText}
                        </h2>
                        <p className="text-sm text-surface-500">
                            {view.charAt(0).toUpperCase() + view.slice(1)} View • Manage your schedule
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-surface-100 p-1 rounded-[var(--radius-md)] mr-2 overflow-hidden">
                        {(['month', 'week', 'day'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] transition-all uppercase tracking-wider",
                                    view === v
                                        ? "bg-[var(--bg-card)] backdrop-blur text-primary-600 shadow-sm border border-[var(--glass-border)]"
                                        : "text-surface-500 hover:text-surface-700 hover:bg-[var(--sidebar-hover)]"
                                )}
                            >
                                {v}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            className="p-2 rounded-[var(--radius-md)] hover:bg-surface-100 text-surface-600 transition-colors border border-surface-200 bg-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={resetToToday}
                            className="px-4 py-2 text-sm font-bold hover:bg-surface-100 rounded-[var(--radius-md)] transition-colors border border-surface-200 bg-white"
                        >
                            Today
                        </button>
                        <button
                            onClick={next}
                            className="p-2 rounded-[var(--radius-md)] hover:bg-surface-100 text-surface-600 transition-colors border border-surface-200 bg-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const cloneDay = day;
                const dayEvents = events.filter(event => isSameDay(event.start, cloneDay));

                days.push(
                    <motion.div
                        key={day.toString()}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                            "relative min-h-[130px] p-2 border-r border-b border-[var(--glass-border)] transition-colors group",
                            !isSameMonth(day, monthStart) ? "bg-surface-50/20" : "bg-transparent",
                            isSameDay(day, selectedDate) && "bg-primary-50/20 ring-1 ring-inset ring-primary-500/20",
                            i === 0 && "border-l border-surface-100"
                        )}
                        onClick={() => {
                            setSelectedDate(cloneDay);
                            if (isSameDay(day, selectedDate)) {
                                // Double click mock
                            }
                        }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={cn(
                                "text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                                isToday(day) ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" : "text-surface-700",
                                !isSameMonth(day, monthStart) && !isToday(day) && "text-surface-300"
                            )}>
                                {formattedDate}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenModal(cloneDay);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-primary-100 text-primary-600 hover:bg-primary-200 transition-all"
                            >
                                <Plus size={14} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            {dayEvents.slice(0, 3).map(event => (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "px-2 py-1 text-[10px] font-bold rounded-[var(--radius-sm)] border truncate shadow-xs transition-transform hover:scale-[1.02]",
                                        event.type === 'policy' && "bg-blue-50 text-blue-700 border-blue-100",
                                        event.type === 'meeting' && "bg-amber-50 text-amber-700 border-amber-100",
                                        event.type === 'claim' && "bg-red-50 text-red-700 border-red-100",
                                        event.type === 'team' && "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    )}
                                >
                                    {event.title}
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-[10px] text-surface-400 font-bold pl-1">
                                    + {dayEvents.length - 3} more
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
                day = addDays(day, 1);
            }
        }

        return (
            <div className="border-t border-surface-100 rounded-[var(--radius-lg)] overflow-hidden shadow-xl border-l border-r border-b">
                <div className="grid grid-cols-7 bg-surface-50/80 backdrop-blur-sm border-b border-surface-100 py-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-xs font-black text-surface-400 uppercase tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startDate = startOfWeek(currentDate);
        const days = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(startDate, i);
            const dayEvents = events.filter(event => isSameDay(event.start, day));

            days.push(
                <div key={i} className={cn(
                    "min-h-[500px] border-r border-surface-100 bg-white flex flex-col group",
                    isToday(day) && "bg-primary-50/5"
                )}>
                    <div className={cn(
                        "p-4 text-center border-b border-surface-100 flex flex-col items-center gap-1",
                        isToday(day) && "bg-primary-50/30"
                    )}>
                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{format(day, 'EEE')}</span>
                        <span className={cn(
                            "text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full transition-all",
                            isToday(day) ? "bg-primary-600 text-white shadow-lg" : "text-surface-700"
                        )}>{format(day, 'd')}</span>
                        <button
                            onClick={() => handleOpenModal(day)}
                            className="mt-2 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-[10px] font-bold transition-all border border-primary-200"
                        >
                            <Plus size={12} /> Add
                        </button>
                    </div>
                    <div className="flex-1 p-3 space-y-3">
                        {dayEvents.map(event => (
                            <div key={event.id} className={cn(
                                "p-3 rounded-[var(--radius-lg)] border shadow-sm transition-all hover:shadow-md hover:scale-[1.02]",
                                event.type === 'policy' && "bg-blue-50/50 border-blue-100 text-blue-900",
                                event.type === 'meeting' && "bg-amber-50/50 border-amber-100 text-amber-900",
                                event.type === 'claim' && "bg-red-50/50 border-red-100 text-red-900",
                                event.type === 'team' && "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                            )}>
                                <div className="text-xs font-black truncate">{event.title}</div>
                                <div className="text-[10px] opacity-70 mt-1 flex items-center gap-1">
                                    <Clock size={10} /> {format(event.start, 'HH:mm')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="border border-surface-100 rounded-[var(--radius-lg)] overflow-hidden shadow-2xl flex">
                {days}
            </div>
        );
    };

    const renderDayView = () => {
        const dayEvents = events.filter(event => isSameDay(event.start, currentDate));

        return (
            <div className="bg-[var(--bg-card)] backdrop-blur-[var(--glass-blur)] border-0 border-[var(--glass-border)] rounded-[var(--radius-lg)] shadow-[var(--glass-shadow)] overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                <div className="md:w-64 border-r border-surface-100 p-8 flex flex-col items-center bg-surface-50/30">
                    <span className="text-sm font-black text-surface-400 uppercase tracking-widest mb-2">{format(currentDate, 'EEEE')}</span>
                    <span className={cn(
                        "text-6xl font-black w-24 h-24 flex items-center justify-center rounded-full transition-all",
                        isToday(currentDate) ? "bg-primary-600 text-white shadow-2xl" : "text-surface-900 bg-surface-100"
                    )}>{format(currentDate, 'd')}</span>
                    <div className="mt-8 w-full">
                        <button
                            onClick={() => handleOpenModal(currentDate)}
                            className="w-full py-4 rounded-[var(--radius-xl)] bg-primary-600 text-white font-black flex items-center justify-center gap-3 shadow-xl hover:bg-primary-700 transition-all active:scale-95"
                        >
                            <Plus size={20} /> Create Event
                        </button>
                    </div>
                </div>
                <div className="flex-1 p-8 space-y-6 bg-transparent overflow-y-auto">
                    <h3 className="text-xl font-bold text-surface-900 flex items-center gap-2 mb-4">
                        <Clock className="text-primary-500" size={24} />
                        Daily Schedule • {dayEvents.length} Events
                    </h3>
                    <div className="space-y-4">
                        {dayEvents.length > 0 ? (
                            dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime()).map(event => (
                                <div key={event.id} className={cn(
                                    "p-6 rounded-[var(--radius-xl)] border border-[var(--glass-border)] flex items-center gap-6 group transition-all hover:shadow-[var(--glass-shadow)] bg-[var(--bg-card)]",
                                    event.type === 'policy' && "bg-blue-50/20 border-blue-100 hover:bg-blue-50/50",
                                    event.type === 'meeting' && "bg-amber-50/20 border-amber-100 hover:bg-amber-50/50",
                                    event.type === 'claim' && "bg-red-50/20 border-red-100 hover:bg-red-50/50",
                                    event.type === 'team' && "bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/50"
                                )}>
                                    <div className="text-center min-w-[80px]">
                                        <div className="text-2xl font-black text-surface-900">{format(event.start, 'HH:mm')}</div>
                                        <div className="text-[10px] font-bold text-surface-400 uppercase uppercase tracking-tighter">to {format(event.end, 'HH:mm')}</div>
                                    </div>
                                    <div className="w-px h-12 bg-surface-100" />
                                    <div className="flex-1">
                                        <div className="font-black text-lg text-surface-900">{event.title}</div>
                                        <p className="text-sm text-surface-600 line-clamp-1">{event.description}</p>
                                    </div>
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        event.type === 'policy' && "bg-blue-100 text-blue-700",
                                        event.type === 'meeting' && "bg-amber-100 text-amber-700",
                                        event.type === 'claim' && "bg-red-100 text-red-700",
                                        event.type === 'team' && "bg-emerald-100 text-emerald-700"
                                    )}>
                                        {event.type}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center bg-surface-50/50 rounded-[var(--radius-xl)] border border-dashed border-surface-200">
                                <CalendarIcon size={48} className="text-surface-200 mb-4" />
                                <p className="text-surface-400 font-bold">No events booked for today</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            <div className="bg-[var(--bg-card)] backdrop-blur-[var(--glass-blur)] rounded-[var(--radius-2xl)] p-8 shadow-[var(--glass-shadow)] border border-[var(--glass-border)]">
                {renderHeader()}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={view + currentDate.toString()}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {view === 'month' && renderMonthView()}
                        {view === 'week' && renderWeekView()}
                        {view === 'day' && renderDayView()}
                    </motion.div>
                </AnimatePresence>

                {/* Additional Sidebar Info in Month View */}
                {view === 'month' && (
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[var(--bg-card)] backdrop-blur-[var(--glass-blur)] rounded-[var(--radius-xl)] p-6 shadow-[var(--glass-shadow)] border border-[var(--glass-border)]">
                            <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-primary-500" />
                                Selected Date: {format(selectedDate, 'MMMM d, yyyy')}
                            </h3>
                            <div className="space-y-4">
                                {events.filter(e => isSameDay(e.start, selectedDate)).length > 0 ? (
                                    events.filter(e => isSameDay(e.start, selectedDate)).map(event => (
                                        <div key={event.id} className="group relative flex items-start gap-4 p-4 rounded-[var(--radius-lg)] bg-surface-50 border border-surface-100 hover:border-primary-200 transition-all hover:shadow-md">
                                            <div className={cn(
                                                "w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center shrink-0",
                                                event.type === 'policy' && "bg-blue-100 text-blue-600",
                                                event.type === 'meeting' && "bg-amber-100 text-amber-600",
                                                event.type === 'claim' && "bg-red-100 text-red-600",
                                                event.type === 'team' && "bg-emerald-100 text-emerald-600"
                                            )}>
                                                <CalendarIcon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-bold text-surface-900">{event.title}</h4>
                                                    <span className={cn(
                                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                        event.status === 'upcoming' ? "bg-primary-100 text-primary-700" : "bg-success-100 text-success-700"
                                                    )}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-surface-600 mb-3">{event.description}</p>
                                                <div className="flex flex-wrap gap-4 text-xs text-surface-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {format(event.start, 'HH:mm')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-surface-50/50 rounded-[var(--radius-lg)] border border-dashed border-surface-200">
                                        <p className="text-surface-400 font-bold">No events scheduled for this day</p>
                                        <button
                                            onClick={() => handleOpenModal(selectedDate)}
                                            className="mt-4 px-6 py-2 rounded-full bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-all active:scale-95"
                                        >
                                            + Add First Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[var(--radius-xl)] p-6 shadow-xl text-white relative overflow-hidden h-full">
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Calendar Pro</h3>
                                    <p className="text-primary-100 text-sm mb-6 leading-relaxed font-medium">
                                        Click on any day's "+" icon to quickly book a meeting or renewal reminder.
                                    </p>
                                    <button
                                        onClick={() => handleOpenModal()}
                                        className="w-full bg-white text-primary-600 font-bold py-4 rounded-[var(--radius-xl)] hover:bg-primary-50 transition-colors shadow-2xl active:scale-95"
                                    >
                                        Quick Create Event
                                    </button>
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <NewEventModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                initialDate={modalInitialDate}
            />
        </div>
    );
});

CalendarView.displayName = 'CalendarView';

