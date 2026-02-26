'use client';

import { useState } from 'react';
import { ChatList } from '@/components/chat/chat-list';
import { MessageWindow } from '@/components/chat/message-window';
import { MOCK_CHATS } from '@/mock/chat';
import { Card } from '@/components/ui/card';
import { MessageSquareOff } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const linkedId = searchParams.get('linkedId');
    const linkedType = searchParams.get('linkedType');

    // Find a chat that matches the linked resource
    const initialChat = MOCK_CHATS.find((c) =>
        c.linkedResourceId?.toLowerCase() === linkedId?.toLowerCase() &&
        c.linkedResourceType === linkedType
    ) || MOCK_CHATS[0];

    const [activeChatId, setActiveChatId] = useState<string>(initialChat.id);

    const activeChat = MOCK_CHATS.find((c) => c.id === activeChatId) || MOCK_CHATS[0];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Messages</h1>
                <p className="text-sm text-surface-500 mt-1">Internal team communication and AI assistance.</p>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Conversations Sidebar */}
                <div className="w-80 shrink-0 h-full">
                    <ChatList
                        activeId={activeChatId}
                        onSelect={setActiveChatId}
                    />
                </div>

                {/* Message Window */}
                <div className="flex-1 h-full min-w-0">
                    {activeChat ? (
                        <MessageWindow conversation={activeChat} />
                    ) : (
                        <Card className="h-full flex flex-col items-center justify-center text-center p-12">
                            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4 text-surface-400">
                                <MessageSquareOff size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-surface-900">No conversation selected</h3>
                            <p className="text-sm text-surface-500 mt-1" style={{ maxWidth: '20rem' }}>
                                Select a team member or Kojo AI to start messaging.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
