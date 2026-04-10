"use client"

import * as React from "react"
import {
    Bell,
    Check,
    Clock,
    AlertTriangle,
    DollarSign,
    FileText,
    Users,
    Shield,
    Trash2,
} from "lucide-react"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Modal } from "@/components/ui/modal"
import {
    useNotifications,
    useUnreadNotificationCount,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useDeleteNotification,
} from "@/hooks/api/use-notifications"
import { useNotificationSocket } from "@/hooks/use-notification-socket"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

const TYPE_ICONS: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    RENEWAL: { icon: <Clock size={14} />, bg: "bg-blue-100", text: "text-blue-600" },
    CLAIM: { icon: <Shield size={14} />, bg: "bg-orange-100", text: "text-orange-600" },
    COMMISSION: { icon: <DollarSign size={14} />, bg: "bg-green-100", text: "text-green-600" },
    LEAD: { icon: <Users size={14} />, bg: "bg-purple-100", text: "text-purple-600" },
    COMPLIANCE: { icon: <AlertTriangle size={14} />, bg: "bg-amber-100", text: "text-amber-600" },
    FINANCE: { icon: <DollarSign size={14} />, bg: "bg-emerald-100", text: "text-emerald-600" },
    SYSTEM: { icon: <Bell size={14} />, bg: "bg-surface-100", text: "text-surface-600" },
    DOCUMENT: { icon: <FileText size={14} />, bg: "bg-sky-100", text: "text-sky-600" },
    APPROVAL: { icon: <Check size={14} />, bg: "bg-green-100", text: "text-green-600" },
    FOLLOWUP: { icon: <Clock size={14} />, bg: "bg-indigo-100", text: "text-indigo-600" },
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
}

export function NotificationsPopover() {
    const qc = useQueryClient()
    const { data: notificationsData } = useNotifications({ limit: 20 })
    const { data: unreadData } = useUnreadNotificationCount()
    const markRead = useMarkNotificationRead()
    const markAllRead = useMarkAllNotificationsRead()
    const deleteNotification = useDeleteNotification()
    const { onNewNotification } = useNotificationSocket()

    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const notifications = (notificationsData as any)?.items ?? (notificationsData as any)?.data ?? (Array.isArray(notificationsData) ? notificationsData : [])
    const unreadCount = (unreadData as any)?.count ?? 0

    const selectedNotification = React.useMemo(() =>
        notifications.find((n: any) => n.id === selectedId) || null,
        [notifications, selectedId])

    // Listen for real-time notifications
    React.useEffect(() => {
        const unsub = onNewNotification((notification) => {
            // Invalidate queries so the list updates
            qc.invalidateQueries({ queryKey: ['notifications'] })
            qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
            toast.info(notification.title, { description: notification.message })
        })
        return unsub
    }, [onNewNotification, qc])

    return (
        <>
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="flex justify-center items-center w-8 h-8 rounded-full text-gray-500 transition-colors relative outline-none hover:bg-surface-100"
                    title="Notifications"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 animate-pulse">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white dark:bg-slate-800 border border-surface-200 dark:border-slate-700 shadow-xl z-[300]" align="end" side="bottom" sideOffset={12}>
                <div className="flex items-center justify-between p-4 border-b border-surface-100 dark:border-slate-700">
                    <h4 className="font-semibold text-sm">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-2 text-xs font-bold text-primary-600">({unreadCount})</span>
                        )}
                    </h4>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllRead.mutate(undefined as any)}
                            className="text-xs text-primary-600 font-medium cursor-pointer hover:underline"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell size={24} className="mx-auto text-surface-300 mb-2" />
                            <p className="text-sm text-surface-400 font-medium">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((n: any) => {
                            const typeConfig = TYPE_ICONS[n.type] || TYPE_ICONS.SYSTEM
                            return (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-surface-100/50 dark:border-slate-700/50 hover:bg-surface-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer ${!n.read ? 'bg-primary-50/30 dark:bg-primary-900/20' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (!n.read) markRead.mutate(n.id)
                                        setSelectedId(n.id)
                                        setIsModalOpen(true)
                                    }}
                                >
                                    <div className="flex gap-3">
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ${typeConfig.bg} ${typeConfig.text}`}>
                                            {typeConfig.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium text-surface-900 dark:text-white truncate ${!n.read ? 'font-bold' : ''}`}>
                                                    {n.title}
                                                </p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteNotification.mutate(n.id)
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-surface-400 hover:text-red-500 transition-all rounded"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{n.message}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-surface-400">{timeAgo(n.createdAt)}</span>
                                                {!n.read && <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                <div className="px-4 py-2 bg-surface-50 dark:bg-slate-900/50 border-t border-surface-100 dark:border-slate-700">
                    <a
                        href="/dashboard/notifications"
                        className="block w-full text-xs text-center text-primary-600 font-bold hover:text-primary-700 cursor-pointer uppercase tracking-widest py-1"
                    >
                        View All Notifications
                    </a>
                </div>
            </PopoverContent>
        </Popover>

        {selectedNotification && (
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Notification Details"
                size="md"
            >
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 py-2 sm:py-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${(TYPE_ICONS[selectedNotification.type] || TYPE_ICONS.SYSTEM).bg} ${(TYPE_ICONS[selectedNotification.type] || TYPE_ICONS.SYSTEM).text}`}>
                                {React.cloneElement((TYPE_ICONS[selectedNotification.type] || TYPE_ICONS.SYSTEM).icon as React.ReactElement<any>, { size: 24 })}
                            </div>
                            <div>
                                <h2 className="text-[11px] font-black uppercase tracking-[3px] text-surface-500 mb-1">{selectedNotification.type} Notification</h2>
                                <div className="text-sm font-bold text-surface-900 dark:text-white">{formatDate(selectedNotification.createdAt)}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                deleteNotification.mutate(selectedNotification.id)
                                setIsModalOpen(false)
                            }}
                            className="p-2.5 rounded-xl text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                            title="Delete Notification"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <h1 className="text-xl md:text-2xl font-black text-surface-900 dark:text-white tracking-tight mb-6 leading-tight">
                        {selectedNotification.title}
                    </h1>

                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-surface-600 dark:text-slate-300 mb-8">
                        {selectedNotification.message.split('\n').map((line: string, i: number) => (
                            <p key={i} className="mb-4 leading-relaxed text-[15px]">{line}</p>
                        ))}
                    </div>

                    {selectedNotification.link && (
                        <div className="mt-8 pt-6 border-t border-surface-100 dark:border-slate-800 flex justify-end">
                            <a
                                href={selectedNotification.link}
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-shadow shadow-lg w-full sm:w-auto text-center"
                            >
                                Take Action
                            </a>
                        </div>
                    )}
                </div>
            </Modal>
        )}
        </>
    )
}
