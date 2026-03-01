'use client';

import React from 'react';
import { format, isAfter, startOfToday } from 'date-fns';
import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { mockEvents } from '@/mock/calendar-events';

export function CalendarWidget() {
    const today = startOfToday();
    const upcomingEvents = mockEvents
        .filter(event => isAfter(event.start, today) || format(event.start, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, 4);

    return (
        <div className="bg-[var(--bg-card)] backdrop-blur-[var(--glass-blur)] rounded-[var(--radius-xl)] shadow-[var(--glass-shadow)] border-0 border-[var(--glass-border)] overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[var(--radius-md)] bg-primary-100 text-primary-600 flex items-center justify-center">
                        <Calendar size={18} />
                    </div>
                    <h3 className="font-bold text-surface-900">Upcoming Schedule</h3>
                </div>
                <Link
                    href="/dashboard/calendar"
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                >
                    View All <ChevronRight size={14} />
                </Link>
            </div>

            <div className="flex-1 p-5 space-y-4">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                        <div key={event.id} className="flex gap-4 group cursor-pointer">
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] bg-surface-50 border border-surface-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                <span className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter group-hover:text-primary-400">
                                    {format(event.start, 'MMM')}
                                </span>
                                <span className="text-lg font-bold text-surface-900 leading-tight group-hover:text-primary-600">
                                    {format(event.start, 'd')}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-surface-900 truncate group-hover:text-primary-600 transition-colors">
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        event.type === 'policy' && "bg-blue-500",
                                        event.type === 'meeting' && "bg-amber-500",
                                        event.type === 'claim' && "bg-red-500",
                                        event.type === 'team' && "bg-emerald-500"
                                    )} />
                                    <span className="text-xs text-surface-500 italic">
                                        {format(event.start, 'EEEE')} • {event.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-surface-50 flex items-center justify-center mb-2">
                            <Calendar className="text-surface-300" size={24} />
                        </div>
                        <p className="text-sm text-surface-400 font-medium">No upcoming events</p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-surface-50 border-t border-surface-100">
                <Link href="/dashboard/calendar" className="block w-full py-2 text-xs font-bold text-surface-600 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[var(--radius-md)] hover:bg-[var(--sidebar-hover)] transition-colors shadow-none text-center">
                    Quick Add Event
                </Link>
            </div>
        </div>
    );
}
