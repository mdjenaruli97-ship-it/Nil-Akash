export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface UserModel {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  statusMessage?: string;
  lastSeen?: string;
  phone?: string;
  email?: string;
  bio?: string;
  isAiBot?: boolean;
}

export type MessageType = 'text' | 'image' | 'audio' | 'file' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ReactionModel {
  emoji: string;
  userId: string;
}

export interface MessageModel {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  type: MessageType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number; // in seconds
  timestamp: string; // ISO or readable
  status: MessageStatus;
  replyToId?: string;
  reactions?: ReactionModel[];
}

export interface GroupModel {
  id: string;
  name: string;
  avatar: string;
  description: string;
  adminIds: string[];
  memberIds: string[];
  createdAt: string;
}

export type CallType = 'audio' | 'video';
export type CallStatus = 'incoming' | 'outgoing' | 'accepted' | 'missed' | 'ended';

export interface CallModel {
  id: string;
  callerId: string;
  receiverId: string; // user ID or group ID
  type: CallType;
  status: CallStatus;
  timestamp: string;
  duration?: number; // in seconds
}

export interface ChatModel {
  id: string;
  type: 'direct' | 'group';
  targetId: string; // User ID or Group ID
  unreadCount: number;
  isPinned?: boolean;
  draftText?: string;
  lastMessageTimestamp?: string;
}

export type AppTab = 'chats' | 'groups' | 'calls' | 'contacts' | 'profile' | 'settings';
export type ThemeMode = 'light' | 'dark' | 'system';
export type WallpaperOption = 'default' | 'doodle' | 'gradient' | 'dark-slate' | 'soft-emerald';
