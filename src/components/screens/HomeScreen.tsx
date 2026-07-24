import React, { useState, useEffect } from 'react';
import {
  AppTab,
  UserModel,
  GroupModel,
  MessageModel,
  ChatModel,
  CallModel,
  WallpaperOption,
  ThemeMode,
  CallType,
} from '../../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_USERS,
  INITIAL_GROUPS,
  INITIAL_MESSAGES,
  INITIAL_CHATS,
  INITIAL_CALLS,
  STORAGE_KEYS,
  storageService,
} from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { Avatar } from '../widgets/Avatar';
import { CallOverlay } from '../widgets/CallOverlay';
import { CreateGroupModal } from '../widgets/CreateGroupModal';
import { AddContactModal } from '../widgets/AddContactModal';
import { MediaViewerModal } from '../widgets/MediaViewerModal';

import { ChatListScreen } from './ChatListScreen';
import { ChatScreen } from './ChatScreen';
import { GroupsScreen } from './GroupsScreen';
import { CallsScreen } from './CallsScreen';
import { ContactsScreen } from './ContactsScreen';
import { ProfileScreen } from './ProfileScreen';
import { SettingsScreen } from './SettingsScreen';
import { LoginScreen } from './LoginScreen';

import {
  MessageSquare,
  Users,
  Phone,
  User,
  Settings,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  Bot,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  // Persistence state hooks
  const [currentUser, setCurrentUser] = useState<UserModel | null>(() =>
    storageService.getItem(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER)
  );

  const [users, setUsers] = useState<UserModel[]>(() =>
    storageService.getItem(STORAGE_KEYS.USERS, INITIAL_USERS)
  );

  const [groups, setGroups] = useState<GroupModel[]>(() =>
    storageService.getItem(STORAGE_KEYS.GROUPS, INITIAL_GROUPS)
  );

  const [chats, setChats] = useState<ChatModel[]>(() =>
    storageService.getItem(STORAGE_KEYS.CHATS, INITIAL_CHATS)
  );

  const [messages, setMessages] = useState<Record<string, MessageModel[]>>(() =>
    storageService.getItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES)
  );

  const [calls, setCalls] = useState<CallModel[]>(() =>
    storageService.getItem(STORAGE_KEYS.CALLS, INITIAL_CALLS)
  );

  const [theme, setTheme] = useState<ThemeMode>(() =>
    storageService.getItem(STORAGE_KEYS.SETTINGS_THEME, 'light')
  );

  const [wallpaper, setWallpaper] = useState<WallpaperOption>(() =>
    storageService.getItem(STORAGE_KEYS.SETTINGS_WALLPAPER, 'default')
  );

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    storageService.getItem(STORAGE_KEYS.SETTINGS_SOUND, true)
  );

  const [aiAutoReply, setAiAutoReply] = useState<boolean>(() =>
    storageService.getItem(STORAGE_KEYS.SETTINGS_AI_AUTO_REPLY, true)
  );

  // Active view states
  const [activeTab, setActiveTab] = useState<AppTab>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('chat_user_1');

  // Modals & Overlay states
  const [activeCall, setActiveCall] = useState<{ targetUser: UserModel; type: CallType } | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Mobile navigation helper
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Sync dark theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.setItem(STORAGE_KEYS.SETTINGS_THEME, theme);
  }, [theme]);

  // Save changes to storage
  useEffect(() => {
    if (currentUser) storageService.setItem(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => storageService.setItem(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.GROUPS, groups), [groups]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.CHATS, chats), [chats]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.MESSAGES, messages), [messages]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.CALLS, calls), [calls]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.SETTINGS_WALLPAPER, wallpaper), [wallpaper]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.SETTINGS_SOUND, soundEnabled), [soundEnabled]);
  useEffect(() => storageService.setItem(STORAGE_KEYS.SETTINGS_AI_AUTO_REPLY, aiAutoReply), [aiAutoReply]);

  // Total unread calculation
  const totalUnreadCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  // Handlers
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowMobileChat(true);

    // Clear unread count for selected chat
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleStartChatWithUser = (targetUserId: string) => {
    let existingChat = chats.find(
      (c) => c.type === 'direct' && c.targetId === targetUserId
    );

    if (!existingChat) {
      const newChatId = `chat_${targetUserId}`;
      existingChat = {
        id: newChatId,
        type: 'direct',
        targetId: targetUserId,
        unreadCount: 0,
        lastMessageTimestamp: 'Just now',
      };
      setChats((prev) => [existingChat!, ...prev]);
    }

    setActiveTab('chats');
    handleSelectChat(existingChat.id);
  };

  const handleStartGroupChat = (groupId: string) => {
    let existingChat = chats.find(
      (c) => c.type === 'group' && c.targetId === groupId
    );

    if (!existingChat) {
      const newChatId = `chat_group_${groupId}`;
      existingChat = {
        id: newChatId,
        type: 'group',
        targetId: groupId,
        unreadCount: 0,
        lastMessageTimestamp: 'Just now',
      };
      setChats((prev) => [existingChat!, ...prev]);
    }

    setActiveTab('chats');
    handleSelectChat(existingChat.id);
  };

  const handleSendMessage = (
    text: string,
    type: 'text' | 'image' | 'audio' | 'file' = 'text',
    mediaUrl?: string,
    audioDuration?: number,
    replyToId?: string
  ) => {
    if (!selectedChatId || !currentUser) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: MessageModel = {
      id: `msg_${Date.now()}`,
      chatId: selectedChatId,
      senderId: currentUser.id,
      text,
      type,
      mediaUrl,
      audioDuration,
      timestamp: timeStr,
      status: 'sent',
      replyToId,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }));

    // Update chat last timestamp
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessageTimestamp: timeStr } : c))
    );

    const currentChatObj = chats.find((c) => c.id === selectedChatId);

    // AI Bot auto-response trigger
    if (currentChatObj?.targetId === 'user_gemini' && aiAutoReply) {
      setTimeout(async () => {
        try {
          const chatMsgs = messages[selectedChatId] || [];
          const recentHistory = chatMsgs.slice(-4).map((m) => ({
            sender: m.senderId === currentUser.id ? currentUser.name : 'Gemini AI Assistant',
            text: m.text || '',
          }));

          const res = await fetch('/api/ai-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: text,
              history: recentHistory,
              userName: currentUser.name,
            }),
          });
          const data = await res.json();

          const aiReplyMsg: MessageModel = {
            id: `msg_ai_${Date.now()}`,
            chatId: selectedChatId,
            senderId: 'user_gemini',
            text: data.reply || "I'm standing by to help you with anything!",
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          };

          setMessages((prev) => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), aiReplyMsg],
          }));

          if (soundEnabled) soundService.playReceiveSound();
        } catch {
          // Fallback
        }
      }, 1000);
    }
  };

  const handleReactMessage = (messageId: string, emoji: string) => {
    if (!selectedChatId || !currentUser) return;

    setMessages((prev) => {
      const chatMsgs = prev[selectedChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id === messageId) {
          const reactions = m.reactions || [];
          const existing = reactions.find((r) => r.userId === currentUser.id);
          const newReactions = existing
            ? reactions.map((r) => (r.userId === currentUser.id ? { emoji, userId: currentUser.id } : r))
            : [...reactions, { emoji, userId: currentUser.id }];
          return { ...m, reactions: newReactions };
        }
        return m;
      });
      return { ...prev, [selectedChatId]: updated };
    });
  };

  const handleStartAudioCall = (targetUserId: string) => {
    const target = users.find((u) => u.id === targetUserId);
    if (target) {
      setActiveCall({ targetUser: target, type: 'audio' });
      if (soundEnabled) soundService.startRingtone();
    }
  };

  const handleStartVideoCall = (targetUserId: string) => {
    const target = users.find((u) => u.id === targetUserId);
    if (target) {
      setActiveCall({ targetUser: target, type: 'video' });
      if (soundEnabled) soundService.startRingtone();
    }
  };

  const handleEndCall = (durationSecs: number) => {
    if (activeCall && currentUser) {
      soundService.stopRingtone();
      const newCall: CallModel = {
        id: `call_${Date.now()}`,
        callerId: currentUser.id,
        receiverId: activeCall.targetUser.id,
        type: activeCall.type,
        status: 'accepted',
        timestamp: 'Just now',
        duration: durationSecs,
      };
      setCalls((prev) => [newCall, ...prev]);
    }
    setActiveCall(null);
  };

  const handleTogglePin = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleCreateGroup = (name: string, description: string, memberIds: string[]) => {
    const newGroup: GroupModel = {
      id: `group_${Date.now()}`,
      name,
      avatar: `https://images.unsplash.com/photo-${1522071820081 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      description,
      adminIds: [currentUser?.id || 'user_me'],
      memberIds: [currentUser?.id || 'user_me', ...memberIds],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGroups((prev) => [newGroup, ...prev]);
    setShowCreateGroupModal(false);
    handleStartGroupChat(newGroup.id);
  };

  const handleAddContact = (c: { name: string; phone: string; email: string; bio: string }) => {
    const newContact: UserModel = {
      id: `user_${Date.now()}`,
      name: c.name,
      avatar: `https://images.unsplash.com/photo-${1500648767791 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      status: 'online',
      statusMessage: c.bio || 'New contact',
      phone: c.phone,
      email: c.email,
      bio: c.bio,
    };

    setUsers((prev) => [...prev, newContact]);
    setShowAddContactModal(false);
    handleStartChatWithUser(newContact.id);
  };

  const handleResetData = () => {
    storageService.resetAll();
    setCurrentUser(INITIAL_CURRENT_USER);
    setUsers(INITIAL_USERS);
    setGroups(INITIAL_GROUPS);
    setChats(INITIAL_CHATS);
    setMessages(INITIAL_MESSAGES);
    setCalls(INITIAL_CALLS);
  };

  if (!currentUser) {
    return (
      <LoginScreen
        availableUsers={users}
        onLogin={(u) => setCurrentUser(u)}
        onCreateAccount={(u) => {
          setUsers((prev) => [...prev, u]);
          setCurrentUser(u);
        }}
      />
    );
  }

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const activeTargetUser = selectedChat?.type === 'direct' ? users.find((u) => u.id === selectedChat.targetId) : undefined;
  const activeTargetGroup = selectedChat?.type === 'group' ? groups.find((g) => g.id === selectedChat.targetId) : undefined;
  const activeMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 select-none">
      {/* Sidebar Navigation */}
      <aside className="w-16 md:w-20 bg-slate-900 text-white flex flex-col items-center justify-between py-5 z-20 flex-shrink-0 shadow-xl">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* App Brand Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2 w-full px-2">
            {[
              { id: 'chats', label: 'Chats', icon: MessageSquare, badge: totalUnreadCount },
              { id: 'groups', label: 'Groups', icon: Users },
              { id: 'calls', label: 'Calls', icon: Phone },
              { id: 'contacts', label: 'Contacts', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AppTab);
                    setShowMobileChat(false);
                  }}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium mt-1 hidden md:block">{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions Profile & Settings */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setShowMobileChat(false);
            }}
            className={`p-3 rounded-2xl transition-colors ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div
            onClick={() => {
              setActiveTab('profile');
              setShowMobileChat(false);
            }}
            className="cursor-pointer transition-transform hover:scale-105 mt-1"
            title="My Profile"
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} status={currentUser.status} size="md" />
          </div>
        </div>
      </aside>

      {/* Main Content Split Panels */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left List View Panel */}
        <div
          className={`${
            showMobileChat ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 lg:w-96 h-full flex-col flex-shrink-0 z-10`}
        >
          {activeTab === 'chats' && (
            <ChatListScreen
              chats={chats}
              users={users}
              groups={groups}
              messages={messages}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onOpenCreateGroup={() => setShowCreateGroupModal(true)}
              onOpenAddContact={() => setShowAddContactModal(true)}
            />
          )}

          {activeTab === 'groups' && (
            <GroupsScreen
              groups={groups}
              users={users}
              onSelectGroupChat={handleStartGroupChat}
              onOpenCreateGroup={() => setShowCreateGroupModal(true)}
            />
          )}

          {activeTab === 'calls' && (
            <CallsScreen
              calls={calls}
              users={users}
              currentUserId={currentUser.id}
              onStartAudioCall={handleStartAudioCall}
              onStartVideoCall={handleStartVideoCall}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsScreen
              users={users}
              currentUserId={currentUser.id}
              onSelectChat={handleStartChatWithUser}
              onStartAudioCall={handleStartAudioCall}
              onStartVideoCall={handleStartVideoCall}
              onOpenAddContact={() => setShowAddContactModal(true)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              currentUser={currentUser}
              onUpdateProfile={(updated) => setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null))}
              onSwitchUser={() => setCurrentUser(null)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              theme={theme}
              wallpaper={wallpaper}
              soundEnabled={soundEnabled}
              aiAutoReplyEnabled={aiAutoReply}
              onUpdateTheme={setTheme}
              onUpdateWallpaper={setWallpaper}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              onToggleAiAutoReply={() => setAiAutoReply(!aiAutoReply)}
              onResetData={handleResetData}
            />
          )}
        </div>

        {/* Right Active Chat / View Canvas */}
        <div
          className={`${
            !showMobileChat ? 'hidden md:flex' : 'flex'
          } flex-1 h-full flex-col relative bg-slate-50 dark:bg-slate-950`}
        >
          {selectedChat ? (
            <ChatScreen
              chat={selectedChat}
              currentUser={currentUser}
              targetUser={activeTargetUser}
              targetGroup={activeTargetGroup}
              messages={activeMessages}
              wallpaper={wallpaper}
              onSendMessage={handleSendMessage}
              onReactMessage={handleReactMessage}
              onStartAudioCall={handleStartAudioCall}
              onStartVideoCall={handleStartVideoCall}
              onTogglePin={handleTogglePin}
              onImageClick={(url) => setPreviewImageUrl(url)}
              onBackMobile={() => setShowMobileChat(false)}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-indigo-500 opacity-80" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Your Messages</h3>
              <p className="text-xs max-w-sm mt-1">
                Select a conversation from the list or start a new chat with your contacts.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Call Overlay Modal */}
      {activeCall && (
        <CallOverlay
          targetUser={activeCall.targetUser}
          callType={activeCall.type}
          onEndCall={handleEndCall}
        />
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          availableUsers={users.filter((u) => u.id !== currentUser.id && !u.isAiBot)}
          onClose={() => setShowCreateGroupModal(false)}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <AddContactModal
          onClose={() => setShowAddContactModal(false)}
          onAddContact={handleAddContact}
        />
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && (
        <MediaViewerModal
          imageUrl={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />
      )}
    </div>
  );
};
