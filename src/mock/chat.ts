import { ChatConversation, ChatMessage, User } from '@/types';

export const MOCK_CHATS: ChatConversation[] = [
    {
        id: 'kojo-ai',
        participantId: 'kojo',
        participantName: 'Kojo AI',
        participantAvatar: undefined,
        participantRole: 'AI Assistant',
        lastMessage: 'How can I help you with NIC regulations today?',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        isOnline: true,
        type: 'ai'
    },
    {
        id: 'conv-1',
        participantId: 'usr-003',
        participantName: 'Esi Donkor',
        participantAvatar: undefined,
        participantRole: 'Senior Broker',
        lastMessage: 'Got the approval for the Ghana Shippers policy.',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 2,
        isOnline: true,
        type: 'direct'
    },
    {
        id: 'conv-2',
        participantId: 'usr-004',
        participantName: 'Kofi Asante',
        participantAvatar: undefined,
        participantRole: 'Broker',
        lastMessage: 'Checking the motor claim on CLM-2023-0001.',
        lastMessageTime: new Date(Date.now() - 86400000 * 10).toISOString(),
        unreadCount: 0,
        isOnline: false,
        type: 'direct',
        linkedResourceId: 'CLM-2023-0001',
        linkedResourceType: 'claim'
    },
    {
        id: 'group-1',
        participantId: 'branch-1',
        participantName: 'Branch Operations',
        participantAvatar: undefined,
        participantRole: 'Group Chat',
        lastMessage: 'Kofi: New fire claim registered.',
        lastMessageTime: new Date(Date.now() - 3600000 * 5).toISOString(),
        unreadCount: 5,
        isOnline: true,
        type: 'group'
    }
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
    'kojo-ai': [
        {
            id: 'm1',
            senderId: 'kojo',
            content: "Hello Kwame! I'm Kojo, your IBMS AI Assistant. I've been trained on NIC Ghana regulations and your brokerage's standard operating procedures.",
            timestamp: new Date(Date.now() - 100000).toISOString(),
            status: 'read'
        },
        {
            id: 'm2',
            senderId: 'kojo',
            content: "How can I help you with policy lookups, regulation queries, or system tasks today?",
            timestamp: new Date(Date.now() - 90000).toISOString(),
            status: 'read'
        }
    ],
    'conv-1': [
        {
            id: 'm3',
            senderId: 'user-2',
            content: "Hi Kwame, did you see the update on the Osei Motor Comprehensive policy?",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'read'
        },
        {
            id: 'm4',
            senderId: '1', // current user
            content: "Looking at it now. Everything seems in order.",
            timestamp: new Date(Date.now() - 7000000).toISOString(),
            status: 'read'
        },
        {
            id: 'm5',
            senderId: 'user-2',
            content: "Perfect. I've already notified the client.",
            timestamp: new Date(Date.now() - 3800000).toISOString(),
            status: 'read'
        },
        {
            id: 'm6',
            senderId: 'user-2',
            content: "Got the approval for the Osei policy.",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'delivered'
        }
    ],
    'group-1': [
        {
            id: 'gm1',
            senderId: 'user-2',
            content: "Team, can we review the monthly targets for our branch?",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'read'
        },
        {
            id: 'gm2',
            senderId: 'user-3',
            content: "Sure Ama. I'm finishing up the fire claim registration first.",
            timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
            status: 'read'
        },
        {
            id: 'gm3',
            senderId: 'user-3',
            content: "New fire claim registered.",
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            status: 'delivered'
        }
    ]
};
