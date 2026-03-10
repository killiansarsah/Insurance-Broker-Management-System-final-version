'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, User, Bot, Paperclip, Smile, Shield, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChatConversation } from '@/types';
import { useChatMessages } from '@/hooks/api/use-chat';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface MessageWindowProps {
    conversation: ChatConversation;
}

export function MessageWindow({ conversation }: MessageWindowProps) {
    const [inputValue, setInputValue] = useState('');
    const [liveMessages, setLiveMessages] = useState<any[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: messagesData } = useChatMessages(conversation.id);
    const currentUserId = useAuthStore((s) => s.user?.id);
    const { joinRoom, sendMessage: socketSendMessage, sendTyping, onNewMessage, onTyping } = useChatSocket();

    // Initial messages from REST, augmented with live socket messages
    const restMessages = messagesData || [];
    const allMessages = [...restMessages, ...liveMessages];

    // Join room via socket when conversation changes
    useEffect(() => {
        joinRoom(conversation.id);
        setLiveMessages([]); // Reset live messages for new room
        setTypingUser(null);
    }, [conversation.id, joinRoom]);

    // Listen for real-time messages
    useEffect(() => {
        const unsub = onNewMessage((msg) => {
            if (msg.roomId === conversation.id) {
                setLiveMessages((prev) => {
                    // Avoid duplicates
                    if (prev.some((m) => m.id === msg.id)) return prev;
                    return [...prev, {
                        id: msg.id,
                        content: msg.content,
                        senderId: msg.senderId,
                        timestamp: msg.createdAt,
                        status: 'SENT',
                        sender: msg.sender,
                    }];
                });
            }
        });
        return unsub;
    }, [conversation.id, onNewMessage]);

    // Listen for typing indicators
    useEffect(() => {
        const unsub = onTyping((data) => {
            if (data.roomId === conversation.id && data.userId !== currentUserId) {
                setTypingUser(data.userName || 'Someone');
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
            }
        });
        return unsub;
    }, [conversation.id, currentUserId, onTyping]);

    // Auto-scroll on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [allMessages.length]);

    // Emit typing indicator on input
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        sendTyping(conversation.id);
    }, [conversation.id, sendTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Send via WebSocket for instant delivery
        socketSendMessage(conversation.id, inputValue.trim());
        setInputValue('');
    };

    return (
        <Card padding="none" className="flex flex-col h-full overflow-hidden bg-background border-surface-200">
            {/* Window Header */}
            <div className="border-b border-surface-100 bg-surface-50/50">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar
                            name={conversation.participantName}
                            size="md"
                            icon={conversation.type === 'ai' ? <Bot size={20} /> : <User size={20} />}
                        />
                        <div>
                            <h3 className="text-sm font-bold text-surface-900">{conversation.participantName}</h3>
                            <p className="text-[10px] text-surface-500 font-medium uppercase tracking-tight">
                                {conversation.participantRole} • {conversation.isOnline ? 'Active Now' : 'Offline'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Linked Resource Banner */}
                {conversation.linkedResourceId && (
                    <div className="px-6 py-2 bg-primary-50 border-t border-primary-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white dark:bg-slate-800 rounded-md border border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400">
                                {conversation.linkedResourceType === 'CLAIM' ? <Shield size={14} /> : <FileText size={14} />}
                            </div>
                            <span className="text-[11px] font-bold text-primary-900 uppercase tracking-tight">
                                Discussing {conversation.linkedResourceType}: {conversation.linkedResourceId}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] font-bold uppercase tracking-wider px-3 border-primary-200 text-primary-700 hover:bg-primary-100"
                            onClick={() => {
                                const path = conversation.linkedResourceType === 'CLAIM' ? 'claims' : 'policies';
                                window.location.href = `/dashboard/${path}/${conversation.linkedResourceId}`;
                            }}
                        >
                            View Case
                        </Button>
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('/grid-light.svg')] bg-repeat"
            >
                {allMessages.map((msg: any) => {
                    const isSelf = msg.senderId === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                isSelf ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-3 shadow-md",
                                isSelf
                                    ? "bg-primary-600 text-white rounded-tr-none shadow-primary-500/10"
                                    : "bg-surface-100 text-surface-900 rounded-tl-none border border-surface-200"
                            )}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <div className={cn(
                                    "mt-1 flex items-center gap-1.5 text-[9px] font-medium opacity-70",
                                    isSelf ? "justify-end" : "justify-start"
                                )}>
                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isSelf && (
                                        <span className="capitalize">{msg.status}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {typingUser && (
                    <div className="flex items-center gap-2 text-xs text-surface-400 animate-pulse">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-surface-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1.5 h-1.5 bg-surface-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 bg-surface-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span>{typingUser} is typing...</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-surface-100 bg-background shadow-2xl shadow-surface-900/10">
                <div className="flex items-center gap-3">
                    <button type="button" className="p-2 text-surface-400 hover:text-primary-600 transition-colors cursor-pointer" aria-label="Attach file">
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={conversation.type === 'ai' ? "Ask Kojo about policies..." : "Type a message..."}
                            className="w-full h-11 pl-4 pr-12 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            aria-label="Message input"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-600 cursor-pointer" aria-label="Insert emoji">
                            <Smile size={18} />
                        </button>
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="h-11 w-11 rounded-xl shadow-lg shadow-primary-500/20 p-0 flex items-center justify-center transition-transform active:scale-95"
                        disabled={!inputValue.trim()}
                        aria-label="Send message"
                    >
                        <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
                    </Button>
                </div>
            </form>
        </Card>
    );
}
