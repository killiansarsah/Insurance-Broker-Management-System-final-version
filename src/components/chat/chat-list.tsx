'use client';

import { Search, User, Bot, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChatConversation } from '@/types';
import { MOCK_CHATS } from '@/mock/chat';

interface ChatListProps {
    activeId: string;
    onSelect: (id: string) => void;
}

export function ChatList({ activeId, onSelect }: ChatListProps) {
    return (
        <Card padding="none" className="flex flex-col h-full bg-surface-50/30 border-surface-200 overflow-hidden">
            {/* Search Area */}
            <div className="p-4 border-b border-surface-200 bg-background">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        className="w-full h-10 pl-9 pr-4 text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                {/* Section Header */}
                <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Team communication</p>

                {MOCK_CHATS.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => onSelect(chat.id)}
                        className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group",
                            activeId === chat.id
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                                : "hover:bg-white hover:shadow-md text-surface-900 border border-transparent hover:border-surface-200"
                        )}
                    >
                        <div className="relative shrink-0">
                            <Avatar
                                name={chat.participantName}
                                size="md"
                                className={chat.type === 'ai' ? (activeId === chat.id ? 'bg-white text-primary-600' : 'bg-primary-500 text-white') : undefined}
                                icon={chat.type === 'ai' ? <Bot size={20} /> : <User size={20} />}
                            />
                            {chat.isOnline && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success-500 border-2 border-background rounded-full" />
                            )}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm truncate">{chat.participantName}</span>
                                <span className={cn(
                                    "text-[9px] font-medium opacity-60",
                                    activeId === chat.id ? "text-white" : "text-surface-500"
                                )}>
                                    {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <p className={cn(
                                    "text-xs truncate font-medium",
                                    activeId === chat.id ? "text-primary-50" : "text-surface-500"
                                )}>
                                    {chat.lastMessage}
                                </p>
                                {chat.unreadCount > 0 && activeId !== chat.id && (
                                    <Badge variant="primary" className="h-4 min-w-[16px] px-1 justify-center text-[9px] font-bold">
                                        {chat.unreadCount}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* User Profile Mini Tab */}
            <div className="p-4 border-t border-surface-200 bg-background">
                <div className="flex items-center gap-3">
                    <Avatar name="Kwame Asante" size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-surface-900 truncate">Kwame Asante</p>
                        <div className="flex items-center gap-1.5">
                            <Circle size={8} className="fill-success-500 text-success-500" />
                            <span className="text-[10px] text-surface-500 font-bold uppercase tracking-tighter">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
