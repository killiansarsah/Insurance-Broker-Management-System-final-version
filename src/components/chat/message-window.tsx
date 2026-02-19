'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Paperclip, Smile, Shield, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChatConversation, ChatMessage } from '@/types';
import { MOCK_MESSAGES } from '@/mock/chat';

interface MessageWindowProps {
    conversation: ChatConversation;
}

export function MessageWindow({ conversation }: MessageWindowProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(MOCK_MESSAGES[conversation.id] || []);
    }, [conversation.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            content: inputValue,
            senderId: '1', // current user
            timestamp: new Date().toISOString(),
            status: 'sent'
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Mock AI response if speaking to Kojo
        if (conversation.type === 'ai') {
            setTimeout(() => {
                const aiResponse: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    content: "I'm processing that for you. As your IBMS assistant, I recommend checking Section 12 of the NIC guidelines regarding this specific policy type.",
                    senderId: 'kojo',
                    timestamp: new Date().toISOString(),
                    status: 'read'
                };
                setMessages(prev => [...prev, aiResponse]);
            }, 1000);
        }
    };

    return (
        <Card padding="none" className="flex flex-col h-full overflow-hidden bg-white border-surface-200">
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
                            <div className="p-1 bg-white rounded-md border border-primary-200 text-primary-600">
                                {conversation.linkedResourceType === 'claim' ? <Shield size={14} /> : <FileText size={14} />}
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
                                const path = conversation.linkedResourceType === 'claim' ? 'claims' : 'policies';
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
                {messages.map((msg) => {
                    const isSelf = msg.senderId === '1';
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
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-surface-100 bg-white shadow-2xl shadow-surface-900/10">
                <div className="flex items-center gap-3">
                    <button type="button" className="p-2 text-surface-400 hover:text-primary-600 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={conversation.type === 'ai' ? "Ask Kojo about policies..." : "Type a message..."}
                            className="w-full h-11 pl-4 pr-12 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary-600">
                            <Smile size={18} />
                        </button>
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="h-11 w-11 rounded-xl shadow-lg shadow-primary-500/20 p-0 flex items-center justify-center transition-transform active:scale-95"
                        disabled={!inputValue.trim()}
                    >
                        <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
                    </Button>
                </div>
            </form>
        </Card>
    );
}
