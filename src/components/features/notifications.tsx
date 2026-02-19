"use client"

import * as React from "react"
import {
    Bell,
    Check,
    Clock
} from "lucide-react"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea exists or will just use div overflow

export function NotificationsPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="w-10 h-10 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors relative outline-none focus:ring-2 focus:ring-primary-200"
                    title="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start" side="right" sideOffset={12}>
                <div className="flex items-center justify-between p-4 border-b border-surface-100">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-4 border-b border-surface-100/50 bg-primary-50/30">
                        <div className="flex gap-3">
                            <div className="rounded-full w-8 h-8 bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                <Clock size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">Policy Renewal Alert</p>
                                <p className="text-xs text-surface-500 mt-0.5">Motor Policy #POL-8832 expires in 7 days.</p>
                                <span className="text-[10px] text-surface-400 mt-1 block">2 hours ago</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-b border-surface-100/50">
                        <div className="flex gap-3">
                            <div className="rounded-full w-8 h-8 bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                <Check size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">Claim Approved</p>
                                <p className="text-xs text-surface-500 mt-0.5">Claim #CLM-921 has been processed.</p>
                                <span className="text-[10px] text-surface-400 mt-1 block">5 hours ago</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex gap-3">
                            <div className="rounded-full w-8 h-8 bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                <Bell size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-surface-900">New Lead Assigned</p>
                                <p className="text-xs text-surface-500 mt-0.5">John Doe (Corporate Fleet) assigned to you.</p>
                                <span className="text-[10px] text-surface-400 mt-1 block">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
