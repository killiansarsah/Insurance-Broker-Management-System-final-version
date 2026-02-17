"use client"

import * as React from "react"
import {
    Plus,
    UserPlus,
    FileText,
    ShieldAlert,
    TrendingUp
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function QuickAddMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="w-10 h-10 flex items-center justify-center text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-primary-200"
                    title="Create New..."
                >
                    <Plus size={22} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={12}>
                <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>New Client</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>New Policy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        <span>File New Claim</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Add Lead</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
