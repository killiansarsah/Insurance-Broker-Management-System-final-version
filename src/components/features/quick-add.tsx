"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import {
    Plus,
    X,
    UserPlus,
    FileText,
    ShieldAlert,
    TrendingUp,
    Tag,
    CheckSquare,
    Upload,
    DollarSign,
} from "lucide-react"

const actions = [
    {
        icon: UserPlus,
        label: "New Client",
        description: "Add a customer profile",
        href: "/dashboard/clients",
        color: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
        ring: "hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800",
    },
    {
        icon: FileText,
        label: "New Policy",
        description: "Issue a new policy",
        href: "/dashboard/policies",
        color: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
        ring: "hover:ring-2 hover:ring-violet-200 dark:hover:ring-violet-800",
    },
    {
        icon: ShieldAlert,
        label: "File Claim",
        description: "Open a new claim",
        href: "/dashboard/claims",
        color: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
        ring: "hover:ring-2 hover:ring-red-200 dark:hover:ring-red-800",
    },
    {
        icon: TrendingUp,
        label: "Add Lead",
        description: "Track a prospect",
        href: "/dashboard/leads",
        color: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
        ring: "hover:ring-2 hover:ring-emerald-200 dark:hover:ring-emerald-800",
    },
    {
        icon: Tag,
        label: "New Quote",
        description: "Generate a quote",
        href: "/dashboard/quotes",
        color: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
        ring: "hover:ring-2 hover:ring-amber-200 dark:hover:ring-amber-800",
    },
    {
        icon: CheckSquare,
        label: "New Task",
        description: "Assign or log a task",
        href: "/dashboard/tasks",
        color: "bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400",
        ring: "hover:ring-2 hover:ring-sky-200 dark:hover:ring-sky-800",
    },
    {
        icon: Upload,
        label: "Upload Doc",
        description: "Attach a document",
        href: "/dashboard/documents",
        color: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
        ring: "hover:ring-2 hover:ring-orange-200 dark:hover:ring-orange-800",
    },
    {
        icon: DollarSign,
        label: "Finance Entry",
        description: "Log income or expense",
        href: "/dashboard/finance",
        color: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400",
        ring: "hover:ring-2 hover:ring-teal-200 dark:hover:ring-teal-800",
    },
]

export function QuickAddMenu() {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const [originStyle, setOriginStyle] = React.useState<React.CSSProperties>({})
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)

    const PANEL_LEFT = 56
    const PANEL_TOP = 68

    React.useEffect(() => { setMounted(true) }, [])

    const handleToggle = () => {
        if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            const originX = (rect.left + rect.width / 2) - PANEL_LEFT
            const originY = (rect.top + rect.height / 2) - PANEL_TOP
            setOriginStyle({ transformOrigin: `${originX}px ${originY}px` })
        }
        setOpen(v => !v)
    }

    // Close on outside click
    React.useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    // Close on Escape
    React.useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [open])

    const panelStyle: React.CSSProperties = {
        position: "fixed",
        left: PANEL_LEFT,
        top: PANEL_TOP,
        ...originStyle,
        animation: "quickAddExpand 0.6s cubic-bezier(0.34, 1.45, 0.64, 1) forwards",
    }

    return (
        <>
            <button
                ref={triggerRef}
                onClick={handleToggle}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-primary-300
                    ${open
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900 rotate-45"
                        : "text-primary-600 bg-primary-50 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900"
                    }`}
                title="Quick Create"
                aria-label="Quick Create menu"
            >
                <Plus size={20} className="transition-transform duration-200" />
            </button>

            {mounted && open && createPortal(
                <>
                    {/* Keyframe injection */}
                    <style>{`
                        @keyframes quickAddExpand {
                            0%   { opacity: 0; transform: scale(0.08); }
                            60%  { opacity: 1; }
                            100% { opacity: 1; transform: scale(1); }
                        }
                    `}</style>

                    <div
                        ref={panelRef}
                        style={panelStyle}
                        className="z-[300] w-72 rounded-2xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/80"
                    >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-surface-100 dark:border-slate-800">
                        <div>
                            <p className="text-sm font-semibold text-surface-900 dark:text-white">Quick Create</p>
                            <p className="text-xs text-surface-400 dark:text-slate-500 mt-0.5">Jump-start a new record</p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-2 p-3">
                        {actions.map((action) => (
                            <button
                                key={action.href}
                                onClick={() => { setOpen(false); router.push(action.href) }}
                                className={`flex flex-col items-start gap-2 rounded-xl p-3 border border-transparent bg-surface-50 dark:bg-slate-800 transition-all duration-150 cursor-pointer text-left group ${action.ring}`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color} transition-transform duration-150 group-hover:scale-110`}>
                                    <action.icon size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-surface-900 dark:text-white leading-tight">{action.label}</p>
                                    <p className="text-[10px] text-surface-400 dark:text-slate-500 mt-0.5 leading-tight">{action.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-3 pt-1">
                        <p className="text-[10px] text-surface-300 dark:text-slate-600 text-center">
                            Press <kbd className="px-1 py-0.5 rounded bg-surface-100 dark:bg-slate-800 font-mono text-[9px] text-surface-500 dark:text-slate-400">Esc</kbd> to close
                        </p>
                    </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}
