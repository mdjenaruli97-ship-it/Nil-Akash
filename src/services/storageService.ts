import { UserModel, GroupModel, MessageModel, ChatModel, CallModel, WallpaperOption, ThemeMode } from '../types';

export const INITIAL_CURRENT_USER: UserModel = {
  id: 'user_me',
  name: 'Alex Morgan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'online',
  statusMessage: 'Available & Coding 🚀',
  phone: '+1 (555) 019-2834',
  email: 'alex.morgan@example.com',
  bio: 'Software engineer & product creator. Loves UI design and swift messaging.',
};

export const INITIAL_USERS: UserModel[] = [
  INITIAL_CURRENT_USER,
  {
    id: 'user_gemini',
    name: 'Gemini AI Assistant',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Always here to answer & assist ✨',
    bio: 'Official Gemini AI Assistant powered by Google AI',
    isAiBot: true,
  },
  {
    id: 'user_1',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Design sync at 3 PM 🎨',
    lastSeen: 'Just now',
    phone: '+1 (555) 321-9876',
    email: 'sophia.c@example.com',
    bio: 'Product Designer @ Studio Labs',
  },
  {
    id: 'user_2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'away',
    statusMessage: 'In a meeting ☕',
    lastSeen: '10m ago',
    phone: '+1 (555) 456-7890',
    email: 'marcus.v@example.com',
    bio: 'Lead Mobile Architect',
  },
  {
    id: 'user_3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Working remotely from Kyoto 🌸',
    lastSeen: 'Active now',
    phone: '+1 (555) 789-0123',
    email: 'elena.r@example.com',
    bio: 'Full Stack Dev & Traveler',
  },
  {
    id: 'user_4',
    name: 'Liam Miller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    statusMessage: 'Out of office',
    lastSeen: 'Yesterday at 18:40',
    phone: '+1 (555) 234-5678',
    email: 'liam.m@example.com',
    bio: 'DevOps & Cloud Engineer',
  },
];

export const INITIAL_GROUPS: GroupModel[] = [
  {
    id: 'group_1',
    name: 'Core Product Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    description: 'Discussion and sprint planning for the Messenger core features.',
    adminIds: ['user_me', 'user_1'],
    memberIds: ['user_me', 'user_1', 'user_2', 'user_3'],
    createdAt: '2026-01-15',
  },
  {
    id: 'group_2',
    name: 'Design Systems & UI',
    avatar: 'https://images.unsplash.com/photo-1542744094-3a3172720177?w=150&auto=format&fit=crop&q=80',
    description: 'Component libraries, design tokens, and user experience discussions.',
    adminIds: ['user_1'],
    memberIds: ['user_me', 'user_1', 'user_3'],
    createdAt: '2026-02-01',
  },
];

const now = new Date();
const timeMinus = (minutes: number) => new Date(now.getTime() - minutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const INITIAL_MESSAGES: Record<string, MessageModel[]> = {
  chat_user_gemini: [
    {
      id: 'msg_ai_1',
      chatId: 'chat_user_gemini',
      senderId: 'user_gemini',
      text: 'Hello Alex! I am your AI Assistant. Ask me anything, request summaries, or let me generate ideas for your messenger app!',
      type: 'text',
      timestamp: timeMinus(30),
      status: 'read',
    },
  ],
  chat_user_1: [
    {
      id: 'msg_1',
      chatId: 'chat_user_1',
      senderId: 'user_1',
      text: 'Hey Alex! Did you check out the new chat bubble designs for the mobile client?',
      type: 'text',
      timestamp: timeMinus(45),
      status: 'read',
    },
    {
      id: 'msg_2',
      chatId: 'chat_user_1',
      senderId: 'user_me',
      text: 'Yes! The subtle rounded corners and clean typography look incredible.',
      type: 'text',
      timestamp: timeMinus(40),
      status: 'read',
    },
    {
      id: 'msg_3',
      chatId: 'chat_user_1',
      senderId: 'user_1',
      text: 'Awesome. Here is a screenshot of the dark mode UI preview:',
      type: 'text',
      timestamp: timeMinus(35),
      status: 'read',
    },
    {
      id: 'msg_4',
      chatId: 'chat_user_1',
      senderId: 'user_1',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      timestamp: timeMinus(34),
      status: 'read',
      reactions: [{ emoji: '❤️', userId: 'user_me' }],
    },
    {
      id: 'msg_5',
      chatId: 'chat_user_1',
      senderId: 'user_1',
      text: 'Let me know if we can sync on a quick call today!',
      type: 'text',
      timestamp: timeMinus(5),
      status: 'delivered',
    },
  ],
  chat_user_2: [
    {
      id: 'msg_m1',
      chatId: 'chat_user_2',
      senderId: 'user_me',
      text: 'Hey Marcus, are we good for the architecture review meeting?',
      type: 'text',
      timestamp: timeMinus(120),
      status: 'read',
    },
    {
      id: 'msg_m2',
      chatId: 'chat_user_2',
      senderId: 'user_2',
      text: 'Hey! Yes, just wrapping up a pull request. Voice note attached with details.',
      type: 'text',
      timestamp: timeMinus(110),
      status: 'read',
    },
    {
      id: 'msg_m3',
      chatId: 'chat_user_2',
      senderId: 'user_2',
      type: 'audio',
      audioDuration: 14,
      timestamp: timeMinus(109),
      status: 'read',
    },
  ],
  chat_group_1: [
    {
      id: 'msg_g1_1',
      chatId: 'chat_group_1',
      senderId: 'user_3',
      text: 'Team, sprint deployment is successful! All automated tests passed.',
      type: 'text',
      timestamp: timeMinus(60),
      status: 'read',
      reactions: [{ emoji: '🎉', userId: 'user_1' }, { emoji: '🚀', userId: 'user_me' }],
    },
    {
      id: 'msg_g1_2',
      chatId: 'chat_group_1',
      senderId: 'user_1',
      text: 'Great work Elena! Let us review metrics during standup.',
      type: 'text',
      timestamp: timeMinus(50),
      status: 'read',
    },
  ],
};

export const INITIAL_CHATS: ChatModel[] = [
  {
    id: 'chat_user_1',
    type: 'direct',
    targetId: 'user_1',
    unreadCount: 1,
    isPinned: true,
    lastMessageTimestamp: timeMinus(5),
  },
  {
    id: 'chat_user_gemini',
    type: 'direct',
    targetId: 'user_gemini',
    unreadCount: 0,
    isPinned: true,
    lastMessageTimestamp: timeMinus(30),
  },
  {
    id: 'chat_group_1',
    type: 'group',
    targetId: 'group_1',
    unreadCount: 0,
    isPinned: false,
    lastMessageTimestamp: timeMinus(50),
  },
  {
    id: 'chat_user_2',
    type: 'direct',
    targetId: 'user_2',
    unreadCount: 0,
    isPinned: false,
    lastMessageTimestamp: timeMinus(109),
  },
];

export const INITIAL_CALLS: CallModel[] = [
  {
    id: 'call_1',
    callerId: 'user_1',
    receiverId: 'user_me',
    type: 'video',
    status: 'accepted',
    timestamp: 'Today, 09:15 AM',
    duration: 342,
  },
  {
    id: 'call_2',
    callerId: 'user_2',
    receiverId: 'user_me',
    type: 'audio',
    status: 'missed',
    timestamp: 'Yesterday, 04:20 PM',
  },
  {
    id: 'call_3',
    callerId: 'user_me',
    receiverId: 'user_3',
    type: 'audio',
    status: 'accepted',
    timestamp: 'Jul 22, 02:45 PM',
    duration: 185,
  },
];

export const STORAGE_KEYS = {
  CURRENT_USER: 'messenger_current_user',
  USERS: 'messenger_users',
  GROUPS: 'messenger_groups',
  CHATS: 'messenger_chats',
  MESSAGES: 'messenger_messages',
  CALLS: 'messenger_calls',
  SETTINGS_THEME: 'messenger_theme',
  SETTINGS_WALLPAPER: 'messenger_wallpaper',
  SETTINGS_SOUND: 'messenger_sound_enabled',
  SETTINGS_AI_AUTO_REPLY: 'messenger_ai_auto_reply',
};

class StorageService {
  getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota exceeded or disabled
    }
  }

  resetAll() {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
}

export const storageService = new StorageService();
