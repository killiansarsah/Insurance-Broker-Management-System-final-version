"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import {
    Search,
    X,
    Users,
    FileText,
    Shield,
    TrendingUp,
    Calendar,
    Settings,
    BarChart2,
    CreditCard,
    Bell,
    RefreshCw,
    DollarSign,
    Briefcase,
    ClipboardList,
    MessageSquare,
    ArrowRight,
    Clock,
} from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const navItems = [
    { icon: BarChart2,     label: "Dashboard",         href: "/dashboard",                    shortcut: "" },
    { icon: Users,         label: "Clients",           href: "/dashboard/clients",            shortcut: "" },
    { icon: FileText,      label: "Policies",          href: "/dashboard/policies",           shortcut: "" },
    { icon: Shield,        label: "Claims",            href: "/dashboard/claims",             shortcut: "" },
    { icon: RefreshCw,     label: "Renewals",          href: "/dashboard/renewals",           shortcut: "" },
    { icon: TrendingUp,    label: "Leads",             href: "/dashboard/leads",              shortcut: "" },
    { icon: DollarSign,    label: "Commissions",       href: "/dashboard/commissions",        shortcut: "" },
    { icon: CreditCard,    label: "Premium Financing", href: "/dashboard/premium-financing",  shortcut: "" },
    { icon: ClipboardList, label: "Tasks",             href: "/dashboard/tasks",              shortcut: "" },
    { icon: MessageSquare, label: "Chat",              href: "/dashboard/chat",               shortcut: "" },
    { icon: Calendar,      label: "Calendar",          href: "/dashboard/calendar",           shortcut: "" },
    { icon: Bell,          label: "Notifications",     href: "/dashboard/notifications",      shortcut: "" },
    { icon: Briefcase,     label: "Approvals",         href: "/dashboard/approvals",          shortcut: "" },
    { icon: BarChart2,     label: "Reports",           href: "/dashboard/reports",            shortcut: "" },
    { icon: Settings,      label: "Settings",          href: "/dashboard/settings",           shortcut: "⌘," },
]

const recentItems = [
    { icon: Users,    label: "Kwame Nkrumah",        sub: "Client",         href: "/dashboard/clients" },
    { icon: FileText, label: "POL-2026-001",          sub: "Motor Policy",   href: "/dashboard/policies" },
    { icon: Shield,   label: "CLM-9923",              sub: "Active Claim",   href: "/dashboard/claims" },
    { icon: FileText, label: "QT-2026-0156",          sub: "Pending Quote",  href: "/dashboard/quotes" },
]

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => { setMounted(true) }, [])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onOpenChange(!open)
            }
            if (e.key === "Escape" && open) {
                onOpenChange(false)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, onOpenChange])

    const handleSelect = (href: string) => {
        onOpenChange(false)
        router.push(href)
    }

    if (!mounted || !open) return null

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />

            {/* Panel */}
            <div className="relative w-full max-w-2xl mx-4 rounded-2xl border border-surface-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                <Command className="bg-transparent">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-slate-700">
                        <Search className="h-5 w-5 text-surface-400 dark:text-slate-500 shrink-0" />
                        <CommandInput
                            placeholder="Search clients, policies, claims, or navigate..."
                            className="flex-1 h-auto border-0 bg-transparent p-0 text-base text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0 shadow-none"
                        />
                        <button
                            onClick={() => onOpenChange(false)}
                            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-surface-100 dark:bg-slate-800 text-surface-500 dark:text-slate-400 hover:bg-surface-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <CommandList className="max-h-[420px] overflow-y-auto px-2 py-2">
                        <CommandEmpty>
                            <div className="flex flex-col items-center gap-2 py-8 text-surface-400 dark:text-slate-500">
                                <Search className="h-8 w-8 opacity-40" />
                                <p className="text-sm">No results found</p>
                            </div>
                        </CommandEmpty>

                        {/* Recent */}
                        <CommandGroup heading="Recent">
                            {recentItems.map((item) => (
                                <CommandItem
                                    key={item.href + item.label}
                                    onSelect={() => handleSelect(item.href)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer text-surface-700 dark:text-slate-300 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-slate-800 data-[selected=true]:text-primary-700 dark:data-[selected=true]:text-white"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-100 dark:bg-slate-800 shrink-0">
                                        <Clock className="h-4 w-4 text-surface-400 dark:text-slate-500" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium truncate">{item.label}</span>
                                        <span className="text-xs text-surface-400 dark:text-slate-500">{item.sub}</span>
                                    </div>
                                    <ArrowRight className="ml-auto h-3.5 w-3.5 opacity-0 group-data-[selected=true]:opacity-100 text-primary-500 shrink-0" />
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator className="my-1" />

                        {/* Navigate */}
                        <CommandGroup heading="Navigate">
                            {navItems.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    onSelect={() => handleSelect(item.href)}
                                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer text-surface-700 dark:text-slate-300 data-[selected=true]:bg-primary-50 dark:data-[selected=true]:bg-slate-800 data-[selected=true]:text-primary-700 dark:data-[selected=true]:text-white"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-100 dark:bg-slate-800 shrink-0">
                                        <item.icon className="h-4 w-4 text-primary-500" />
                                    </div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                    {item.shortcut && (
                                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    {/* Footer */}
                    <div className="flex items-center gap-4 px-4 py-2.5 border-t border-surface-200 dark:border-slate-700 bg-surface-50 dark:bg-slate-800/50">
                        <span className="flex items-center gap-1 text-xs text-surface-400 dark:text-slate-500">
                            <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-slate-700 font-mono text-[10px]">↑↓</kbd> navigate
                        </span>
                        <span className="flex items-center gap-1 text-xs text-surface-400 dark:text-slate-500">
                            <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-slate-700 font-mono text-[10px]">↵</kbd> open
                        </span>
                        <span className="flex items-center gap-1 text-xs text-surface-400 dark:text-slate-500">
                            <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-slate-700 font-mono text-[10px]">Esc</kbd> close
                        </span>
                        <span className="ml-auto flex items-center gap-1 text-xs text-surface-400 dark:text-slate-500">
                            <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-slate-700 font-mono text-[10px]">⌘K</kbd> to open
                        </span>
                    </div>
                </Command>
            </div>
        </div>,
        document.body
    )
}
