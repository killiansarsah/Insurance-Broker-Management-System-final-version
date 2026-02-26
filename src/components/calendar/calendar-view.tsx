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
    subWeeks,
    subDays
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
        else setCurrentDate(subDays(currentDate, 1));
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
        const monthYear = format(currentDate, 'MMMM yyyy').split(' ');
        const headerText = view === 'month'
            ? null // handled by custom layout below
            : view === 'week'
                ? `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM d, yyyy');

        return (
            <div className="flex flex-col lg:flex-row items-end lg:items-center justify-between mb-8 gap-6 relative z-50">
                {/* Compact Asymmetric Header */}
                <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 w-full lg:w-auto overflow-hidden">
                    <div className="relative group min-w-[300px] h-20 md:h-24 flex items-center">
                        {/* Ghost Background Text */}
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 0.12, x: 0 }}
                            key={monthYear[1]}
                            className="text-5xl md:text-7xl font-black tracking-tighter text-surface-900 uppercase leading-none select-none absolute left-0"
                        >
                            {view === 'month' ? monthYear[1] : format(currentDate, 'yyyy')}
                        </motion.span>
                        {/* Primary Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={currentDate.toString() + "fg"}
                            className="relative z-10"
                        >
                            <h2 className="text-2xl md:text-3xl font-black text-surface-900 tracking-[0.05em] uppercase pl-1 drop-shadow-sm whitespace-nowrap">
                                {view === 'month' ? monthYear[0] : format(currentDate, 'MMMM')}
                            </h2>
                        </motion.div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Compact View Switcher */}
                    <div className="flex bg-white/60 backdrop-blur-xl p-1 rounded-full border border-surface-200/50 shadow-sm">
                        {(['day', 'week', 'month'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={cn(
                                    "relative px-5 py-1.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest z-10",
                                    view === v
                                        ? "text-primary-600"
                                        : "text-surface-400 hover:text-surface-600"
                                )}
                            >
                                {view === v && (
                                    <motion.div
                                        layoutId="activeView"
                                        className="absolute inset-0 bg-white rounded-full shadow-md z-[-1] border border-surface-100"
                                    />
                                )}
                                {v}
                            </button>
                        ))}
                    </div>

                    {/* Minimal Navigation */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prev}
                            className="group flex items-center justify-center w-10 h-10 rounded-full border border-surface-200 bg-white/80 backdrop-blur-sm hover:border-primary-500/50 transition-all active:scale-90 shadow-sm"
                        >
                            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={resetToToday}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-surface-900 text-white rounded-full hover:bg-black transition-all shadow-lg shadow-black/5 active:scale-95"
                        >
                            Today
                        </button>
                        <button
                            onClick={next}
                            className="group flex items-center justify-center w-10 h-10 rounded-full border border-surface-200 bg-white/80 backdrop-blur-sm hover:border-primary-500/50 transition-all active:scale-90 shadow-sm"
                        >
                            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
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

        const daysInMonthView = eachDayOfInterval({ start: startDate, end: endDate });

        const dayCells = daysInMonthView.map((day, i) => {
            const normalizedDay = startOfDay(day);
            const dayEvents = events.filter(e => isSameDay(startOfDay(e.start), normalizedDay));
            const isTodayDay = isToday(day);
            const isSelected = isSameDay(normalizedDay, startOfDay(selectedDate));
            const isOutsideMonth = !isSameMonth(day, currentDate);

            // Get primary event type for color accent
            const primaryType = dayEvents.length > 0 ? dayEvents[0].type : null;

            return (
                <motion.div
                    key={day.toString()}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                        "relative min-h-[100px] p-2 rounded-[var(--radius-xl)] transition-all cursor-pointer group flex flex-col gap-1.5",
                        isOutsideMonth ? "bg-surface-50/10 opacity-20" : "bg-white/40 border-surface-200/50 shadow-sm backdrop-blur-sm",
                        isTodayDay && "border-primary-500/50 bg-primary-500/5 shadow-primary-500/20 ring-1 ring-primary-500/20",
                        isSelected && "ring-2 ring-primary-500 ring-offset-2 z-10",

                        // Liquid Color Accents
                        !isOutsideMonth && primaryType === 'policy' && "bg-blue-500/5 border-blue-500/20",
                        !isOutsideMonth && primaryType === 'meeting' && "bg-amber-500/5 border-amber-500/20",
                        !isOutsideMonth && primaryType === 'claim' && "bg-red-500/5 border-red-500/20",
                        !isOutsideMonth && primaryType === 'team' && "bg-emerald-500/5 border-emerald-500/20",

                        // Default border if no event
                        !isOutsideMonth && !primaryType && "border"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className={cn(
                            "text-xs font-black tracking-tighter w-7 h-7 flex items-center justify-center rounded-lg transition-colors",
                            isTodayDay ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" : "text-surface-900"
                        )}>
                            {format(day, 'd')}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModal(day);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-surface-900 text-white transition-opacity active:scale-90"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    {/* Vibrancy Indicators for multiple events */}
                    {dayEvents.length > 1 && (
                        <div className="absolute top-2 right-10 flex gap-1">
                            {dayEvents.slice(0, 3).map((_, idx) => (
                                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
                            ))}
                        </div>
                    )}

                    <div className="flex-1 space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 3).map(event => (
                            <div
                                key={event.id}
                                className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[9px] font-bold truncate transition-transform hover:scale-105",
                                    event.type === 'policy' && "bg-blue-500 text-white",
                                    event.type === 'meeting' && "bg-amber-500 text-white",
                                    event.type === 'claim' && "bg-red-500 text-white",
                                    event.type === 'team' && "bg-emerald-500 text-white"
                                )}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1 mt-0.5">
                                +{dayEvents.length - 3} More
                            </div>
                        )}
                    </div>

                    {/* Gloss Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-[var(--radius-2xl)]" />
                </motion.div>
            );
        });

        return (
            <div className="relative">
                {/* Background Shadow Glow */}
                <div className="absolute inset-0 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Floating Glass Panes Grid */}
                <div className="grid grid-cols-7 gap-3 mb-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[11px] font-black text-surface-400/60 uppercase tracking-[4px] py-1">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {dayCells}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startDate = startOfWeek(currentDate);
        const days = eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {days.map((day, i) => {
                    const normalizedDay = startOfDay(day);
                    const dayEvents = events.filter(e => isSameDay(startOfDay(e.start), normalizedDay));
                    const isTodayDay = isToday(day);

                    return (
                        <div key={i} className={cn(
                            "flex flex-col min-h-[280px] rounded-[var(--radius-xl)] border transition-all",
                            isTodayDay ? "bg-white border-primary-500 shadow-xl z-10" : "bg-white/40 border-surface-200/50"
                        )}>
                            <div className="p-4 border-b border-surface-100/50 flex flex-col items-center gap-2">
                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{format(day, 'EEE')}</span>
                                <span className={cn(
                                    "text-2xl font-black w-12 h-12 flex items-center justify-center rounded-xl transition-all shadow-sm",
                                    isTodayDay ? "bg-primary-600 text-white shadow-lg" : "text-surface-900 bg-white/50"
                                )}>{format(day, 'd')}</span>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleOpenModal(day)}
                                    className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-5 py-2 rounded-full bg-surface-900 text-white text-[10px] font-black transition-all shadow-lg uppercase tracking-wider"
                                >
                                    <Plus size={14} strokeWidth={3} /> Add
                                </motion.button>
                            </div>

                            <div className="flex-1 p-3 space-y-2 relative z-10 overflow-y-auto custom-scrollbar">
                                {dayEvents.map(event => (
                                    <motion.div
                                        key={event.id}
                                        whileHover={{ scale: 1.02, x: 2 }}
                                        className={cn(
                                            "p-3 rounded-xl border shadow-sm transition-all flex flex-col gap-1.5 relative overflow-hidden group/event",
                                            event.type === 'policy' && "bg-blue-500 text-white border-blue-400",
                                            event.type === 'meeting' && "bg-amber-500 text-white border-amber-400",
                                            event.type === 'claim' && "bg-red-500 text-white border-red-400",
                                            event.type === 'team' && "bg-emerald-500 text-white border-emerald-400"
                                        )}
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-tight leading-tight line-clamp-2">{event.title}</div>
                                        <div className="text-[8px] font-bold opacity-80 flex items-center gap-1.5 uppercase">
                                            <Clock size={10} strokeWidth={3} /> {format(event.start, 'HH:mm')}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const normalizedCurrent = startOfDay(currentDate);
        const dayEvents = events.filter(event => isSameDay(startOfDay(event.start), normalizedCurrent));
        const dateParts = format(currentDate, 'EEEE,d,MMMM').split(',');

        return (
            <div className="bg-white/40 backdrop-blur-xl border border-surface-200/50 rounded-[var(--radius-2xl)] shadow-2xl overflow-hidden min-h-[600px] flex flex-col lg:flex-row relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Compact Focus Pillar */}
                <div className="lg:w-72 border-r border-surface-200/40 p-10 flex flex-col items-center justify-between bg-surface-900 text-white relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-primary-500/20 to-transparent" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 text-center"
                    >
                        <span className="text-[11px] font-black uppercase tracking-[6px] opacity-40 mb-8 block leading-none">{dateParts[0]}</span>
                        <span className="text-8xl font-black tracking-tighter leading-none block mb-3">{dateParts[1]}</span>
                        <span className="text-xl font-black uppercase tracking-[4px] opacity-60 block">{dateParts[2]}</span>
                        <div className="h-0.5 bg-primary-500 w-12 mx-auto my-10 opacity-50" />
                    </motion.div>

                    <button
                        onClick={() => handleOpenModal(currentDate)}
                        className="relative z-10 w-full py-5 rounded-full bg-white text-surface-900 font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-primary-50 transition-all active:scale-95 group text-[11px] tracking-[3px]"
                    >
                        <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                        NEW ACTION
                    </button>

                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
                </div>

                {/* Refined Timeline narrative */}
                <div className="flex-1 p-6 lg:p-10 space-y-8 bg-transparent overflow-y-auto max-h-[800px] custom-scrollbar relative z-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-surface-900 tracking-tighter flex items-center gap-3 uppercase">
                            <Clock className="text-primary-500" size={24} />
                            Daily Focus
                        </h3>
                        <div className="px-4 py-1.5 rounded-full bg-white/60 text-surface-400 text-[10px] font-black uppercase tracking-widest border border-surface-200/50 shadow-sm">
                            {dayEvents.length} Tasks
                        </div>
                    </div>

                    <div className="space-y-6 relative ml-2">
                        {/* Elegant Timeline Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-surface-200/60" />

                        {dayEvents.length > 0 ? (
                            dayEvents.map((event, idx) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-12 group/timeline"
                                >
                                    {/* Timeline Marker */}
                                    <div className={cn(
                                        "absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-surface-50 flex items-center justify-center z-10 transition-transform group-hover/timeline:scale-110 shadow-lg shadow-surface-900/5",
                                        event.type === 'policy' && "bg-blue-500",
                                        event.type === 'meeting' && "bg-amber-500",
                                        event.type === 'claim' && "bg-red-500",
                                        event.type === 'team' && "bg-emerald-500"
                                    )}>
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    </div>

                                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[var(--radius-2xl)] border border-surface-100/80 shadow-sm hover:shadow-xl transition-all group-hover/timeline:-translate-y-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-[10px] font-black text-surface-400 flex items-center gap-2 uppercase tracking-tight">
                                                <Clock size={12} />
                                                {format(event.start, 'HH:mm')} — {format(event.end, 'HH:mm')}
                                            </div>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                event.status === 'upcoming' ? "bg-primary-50 text-primary-600" : "bg-success-50 text-success-600"
                                            )}>{event.status}</span>
                                        </div>
                                        <h4 className="text-sm font-black text-surface-900 uppercase tracking-tight mb-2 leading-tight">{event.title}</h4>
                                        <p className="text-[11px] text-surface-500 font-medium leading-relaxed opacity-80">{event.description || 'No description provided.'}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-96 flex flex-col items-center justify-center bg-surface-50/40 rounded-[var(--radius-2xl)] border border-dashed border-surface-200">
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                >
                                    <CalendarIcon size={64} className="text-surface-200 mb-6" />
                                </motion.div>
                                <p className="text-surface-400 font-bold tracking-widest uppercase text-sm">No events scheduled for this day</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full py-6" style={{ maxWidth: '80rem', margin: '0 auto' }}>
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
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white/40 backdrop-blur-xl rounded-[var(--radius-2xl)] p-8 shadow-2xl border border-surface-200/60 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            <h3 className="text-2xl font-black text-surface-900 mb-8 flex items-center gap-4">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                >
                                    <Clock size={28} className="text-primary-500" />
                                </motion.div>
                                <span className="tracking-tight uppercase">TIMELINE • {format(selectedDate, 'MMM d, yyyy')}</span>
                            </h3>

                            <div className="space-y-4">
                                {events.filter(e => isSameDay(e.start, selectedDate)).length > 0 ? (
                                    events.filter(e => isSameDay(e.start, selectedDate)).map((event, idx) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group relative flex items-center gap-6 p-6 rounded-[var(--radius-xl)] bg-white border border-surface-100 hover:border-primary-500/30 transition-all hover:shadow-xl"
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110",
                                                event.type === 'policy' && "bg-blue-500 text-white",
                                                event.type === 'meeting' && "bg-amber-500 text-white",
                                                event.type === 'claim' && "bg-red-500 text-white",
                                                event.type === 'team' && "bg-emerald-500 text-white"
                                            )}>
                                                <CalendarIcon size={28} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-black text-lg text-surface-900 uppercase tracking-tight">{event.title}</h4>
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                        event.status === 'upcoming' ? "bg-primary-50 text-primary-600 border-primary-100" : "bg-success-50 text-success-600 border-success-100"
                                                    )}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-surface-500 font-medium line-clamp-1">{event.description}</p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-surface-400 uppercase tracking-tighter">
                                                        <Clock size={14} className="text-primary-400" />
                                                        {format(event.start, 'HH:mm')} — {format(event.end, 'HH:mm')}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-surface-50/30 rounded-[var(--radius-2xl)] border border-dashed border-surface-200">
                                        <div className="mb-4 opacity-20">
                                            <CalendarIcon size={48} className="mx-auto" />
                                        </div>
                                        <p className="text-surface-400 font-black uppercase tracking-widest text-xs">No events scheduled</p>
                                        <button
                                            onClick={() => handleOpenModal(selectedDate)}
                                            className="mt-6 px-10 py-3 rounded-full bg-surface-900 text-white font-black text-[10px] hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-95 uppercase tracking-[2px]"
                                        >
                                            + Add First Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-surface-900 rounded-[var(--radius-2xl)] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-white relative overflow-hidden group h-full flex flex-col justify-center">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase leading-tight">Quick<br />Schedule</h3>
                                    <p className="text-white/50 text-xs mb-8 leading-relaxed font-black uppercase tracking-widest">
                                        Create a new event<br />
                                        on your calendar.
                                    </p>
                                    <button
                                        onClick={() => handleOpenModal()}
                                        className="w-full bg-primary-600 text-white font-black py-5 rounded-2xl hover:bg-primary-500 transition-all shadow-2xl active:scale-95 uppercase tracking-[3px] text-xs border border-primary-400/30"
                                    >
                                        New Event
                                    </button>
                                </div>

                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-all" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />
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

