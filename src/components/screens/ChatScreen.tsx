import React, { useState, useRef, useEffect } from 'react';
import { ChatModel, UserModel, GroupModel, MessageModel, WallpaperOption } from '../../types';
import { ChatBubble } from '../widgets/ChatBubble';
import { Avatar } from '../widgets/Avatar';
import { soundService } from '../../services/soundService';
import {
  Send,
  Phone,
  Video,
  Mic,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Sparkles,
  MoreVertical,
  X,
  Pin,
  Bot,
  Square,
  ArrowLeft,
} from 'lucide-react';

interface ChatScreenProps {
  chat: ChatModel;
  currentUser: UserModel;
  targetUser?: UserModel;
  targetGroup?: GroupModel;
  messages: MessageModel[];
  wallpaper?: WallpaperOption;
  onSendMessage: (text: string, type?: 'text' | 'image' | 'audio' | 'file', mediaUrl?: string, audioDuration?: number, replyToId?: string) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  onStartAudioCall: (targetId: string) => void;
  onStartVideoCall: (targetId: string) => void;
  onTogglePin: (chatId: string) => void;
  onImageClick: (url: string) => void;
  onBackMobile?: () => void;
}

const EMOJIS = ['😊', '😂', '🔥', '❤️', '👍', '🎉', '🙌', '✨', '🚀', '💯', '🙏', '😎'];

export const ChatScreen: React.FC<ChatScreenProps> = ({
  chat,
  currentUser,
  targetUser,
  targetGroup,
  messages,
  wallpaper = 'default',
  onSendMessage,
  onReactMessage,
  onStartAudioCall,
  onStartVideoCall,
  onTogglePin,
  onImageClick,
  onBackMobile,
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<MessageModel | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const isGroup = chat.type === 'group';
  const chatTitle = isGroup ? targetGroup?.name || 'Group' : targetUser?.name || 'User';
  const chatAvatar = isGroup ? targetGroup?.avatar : targetUser?.avatar;
  const isAiBot = !isGroup && targetUser?.isAiBot;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio recording timer
  useEffect(() => {
    if (isRecordingAudio) {
      setRecordingTimer(0);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [isRecordingAudio]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), 'text', undefined, undefined, replyingTo?.id);
    setInputText('');
    setReplyingTo(null);
    soundService.playSendSound();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStopAndSendVoice = () => {
    setIsRecordingAudio(false);
    const duration = Math.max(2, recordingTimer);
    onSendMessage('Voice Note', 'audio', undefined, duration, replyingTo?.id);
    setReplyingTo(null);
    soundService.playSendSound();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const isImg = file.type.startsWith('image/');
      onSendMessage(
        isImg ? '' : file.name,
        isImg ? 'image' : 'file',
        result,
        undefined,
        replyingTo?.id
      );
      soundService.playSendSound();
    };
    reader.readAsDataURL(file);
  };

  const handleRequestAiSuggestion = async () => {
    setIsAiGenerating(true);
    try {
      const recentHistory = messages.slice(-5).map((m) => ({
        sender: m.senderId === currentUser.id ? currentUser.name : chatTitle,
        text: m.text || '',
      }));

      const res = await fetch('/api/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Suggest a polite and helpful reply to: "${messages[messages.length - 1]?.text || 'Hello'}"`,
          history: recentHistory,
          userName: currentUser.name,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setInputText(data.reply);
      }
    } catch {
      setInputText('Sounds like a plan! Let me know when you are ready.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const wallpaperClasses: Record<WallpaperOption, string> = {
    default: 'bg-slate-50 dark:bg-slate-950',
    doodle: 'bg-slate-100 dark:bg-slate-900 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]',
    gradient: 'bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-900',
    'dark-slate': 'bg-slate-900 text-white',
    'soft-emerald': 'bg-emerald-50/40 dark:bg-emerald-950/20',
  };

  return (
    <div className={`h-full flex flex-col ${wallpaperClasses[wallpaper]} relative overflow-hidden`}>
      {/* Top Navigation Bar */}
      <div className="p-3.5 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Avatar
            src={chatAvatar}
            name={chatTitle}
            status={isGroup ? undefined : targetUser?.status}
            isGroup={isGroup}
            isAiBot={isAiBot}
            size="md"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                {chatTitle}
              </h3>
              {isAiBot && (
                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                  AI Assistant
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {isGroup
                ? `${targetGroup?.memberIds.length || 0} members`
                : targetUser?.statusMessage || (targetUser?.status === 'online' ? 'Online' : 'Offline')}
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-1">
          {!isAiBot && (
            <>
              <button
                onClick={() => onStartAudioCall(chat.targetId)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onStartVideoCall(chat.targetId)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => onTogglePin(chat.id)}
            className={`p-2 rounded-xl transition-colors ${
              chat.isPinned
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Pin Chat"
          >
            <Pin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const sender = isMe ? currentUser : targetUser;
          const replyToMsg = msg.replyToId ? messages.find((m) => m.id === msg.replyToId) : undefined;

          return (
            <ChatBubble
              key={msg.id}
              message={msg}
              sender={sender}
              isMe={isMe}
              replyToMessage={replyToMsg}
              replyToSenderName={replyToMsg?.senderId === currentUser.id ? currentUser.name : chatTitle}
              onReact={onReactMessage}
              onReply={(m) => setReplyingTo(m)}
              onImageClick={onImageClick}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Context Banner */}
      {replyingTo && (
        <div className="px-4 py-2 bg-indigo-50 dark:bg-slate-800/90 border-t border-indigo-200 dark:border-slate-700 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Replying to:</span>
            <span className="truncate text-slate-700 dark:text-slate-300">
              {replyingTo.text || (replyingTo.type === 'image' ? 'Photo' : 'Voice Note')}
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-20 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 grid grid-cols-6 gap-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
                setShowEmojiPicker(false);
              }}
              className="text-xl p-1 hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Controls Bar */}
      <div className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 z-10">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />

        {isRecordingAudio ? (
          <div className="flex items-center justify-between gap-3 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                Recording Audio: 00:{String(recordingTimer).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecordingAudio(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleStopAndSendVoice}
                className="p-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Square className="w-3.5 h-3.5 fill-current" /> Send Voice
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Add Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Attach Image or File"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleRequestAiSuggestion}
                disabled={isAiGenerating}
                className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50"
                title="AI Smart Suggestion"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAiBot ? "Ask Gemini AI Assistant..." : "Type a message..."}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />

            {inputText.trim() ? (
              <button
                onClick={handleSend}
                className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsRecordingAudio(true)}
                className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                title="Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
