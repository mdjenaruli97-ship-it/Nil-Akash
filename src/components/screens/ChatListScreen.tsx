import React, { useState } from 'react';
import { ChatModel, UserModel, GroupModel, MessageModel } from '../../types';
import { MessageTile } from '../widgets/MessageTile';
import { Search, Plus, Sparkles, Filter } from 'lucide-react';

interface ChatListScreenProps {
  chats: ChatModel[];
  users: UserModel[];
  groups: GroupModel[];
  messages: Record<string, MessageModel[]>;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenCreateGroup: () => void;
  onOpenAddContact: () => void;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  chats,
  users,
  groups,
  messages,
  selectedChatId,
  onSelectChat,
  onOpenCreateGroup,
  onOpenAddContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const getTargetUser = (targetId: string) => users.find((u) => u.id === targetId);
  const getTargetGroup = (targetId: string) => groups.find((g) => g.id === targetId);
  const getLastMessage = (chatId: string) => {
    const chatMsgs = messages[chatId];
    return chatMsgs && chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : undefined;
  };

  const filteredChats = chats.filter((chat) => {
    // Filter tab check
    if (filter === 'unread' && chat.unreadCount === 0) return false;
    if (filter === 'groups' && chat.type !== 'group') return false;

    // Search query check
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();

    if (chat.type === 'group') {
      const g = getTargetGroup(chat.targetId);
      return g?.name.toLowerCase().includes(query) || g?.description.toLowerCase().includes(query);
    } else {
      const u = getTargetUser(chat.targetId);
      const lastMsg = getLastMessage(chat.id);
      return (
        u?.name.toLowerCase().includes(query) ||
        u?.statusMessage?.toLowerCase().includes(query) ||
        lastMsg?.text?.toLowerCase().includes(query)
      );
    }
  });

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Top Search & Filter Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages or contacts..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Chats
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('groups')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === 'groups'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Groups
            </button>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onOpenCreateGroup}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
              title="Create Group"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pinnedChats.length > 0 && (
          <div className="mb-3">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 uppercase tracking-wider block mb-1">
              Pinned Conversations
            </span>
            {pinnedChats.map((chat) => (
              <MessageTile
                key={chat.id}
                chat={chat}
                targetUser={getTargetUser(chat.targetId)}
                targetGroup={getTargetGroup(chat.targetId)}
                lastMessage={getLastMessage(chat.id)}
                isSelected={chat.id === selectedChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
        )}

        {regularChats.length > 0 && (
          <div>
            {pinnedChats.length > 0 && (
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-3 uppercase tracking-wider block mb-1 mt-2">
                All Messages
              </span>
            )}
            {regularChats.map((chat) => (
              <MessageTile
                key={chat.id}
                chat={chat}
                targetUser={getTargetUser(chat.targetId)}
                targetGroup={getTargetGroup(chat.targetId)}
                lastMessage={getLastMessage(chat.id)}
                isSelected={chat.id === selectedChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  );
};
