import React, { useState } from 'react';
import { MessageModel, UserModel } from '../../types';
import { Avatar } from './Avatar';
import { Check, CheckCheck, Play, Pause, Download, Heart, Smile, Reply, CornerDownRight } from 'lucide-react';

interface ChatBubbleProps {
  message: MessageModel;
  sender?: UserModel;
  isMe: boolean;
  replyToMessage?: MessageModel;
  replyToSenderName?: string;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (message: MessageModel) => void;
  onImageClick?: (url: string) => void;
}

const EMOJI_OPTIONS = ['❤️', '👍', '😂', '😮', '😢', '🔥', '🎉'];

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  sender,
  isMe,
  replyToMessage,
  replyToSenderName,
  onReact,
  onReply,
  onImageClick,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      setTimeout(() => setIsPlayingAudio(false), (message.audioDuration || 5) * 1000);
    }
  };

  return (
    <div className={`flex flex-col mb-3 group ${isMe ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isMe && sender && (
          <Avatar src={sender.avatar} name={sender.name} isAiBot={sender.isAiBot} size="sm" showStatus={false} />
        )}

        <div className="relative group/bubble flex flex-col">
          {/* Reaction Floating Picker */}
          {showEmojiPicker && (
            <div
              className={`absolute z-20 -top-10 bg-white dark:bg-slate-800 shadow-xl rounded-full px-2 py-1 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 ${
                isMe ? 'right-0' : 'left-0'
              }`}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact?.(message.id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="hover:scale-125 transition-transform text-base p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Sender Name if in group & not me */}
          {!isMe && sender && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 px-1">
              {sender.name}
            </span>
          )}

          <div
            className={`relative rounded-2xl px-4 py-2.5 text-sm shadow-2xs ${
              isMe
                ? 'bg-indigo-600 text-white rounded-br-xs dark:bg-indigo-600'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
            }`}
          >
            {/* Reply Preview Header */}
            {replyToMessage && (
              <div
                className={`flex items-center gap-2 p-1.5 px-2.5 mb-2 rounded-lg text-xs ${
                  isMe
                    ? 'bg-indigo-700/60 text-indigo-100 border-l-2 border-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 border-l-2 border-indigo-500'
                }`}
              >
                <CornerDownRight className="w-3.5 h-3.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold block truncate">
                    {replyToSenderName || 'User'}
                  </span>
                  <span className="truncate block opacity-80">
                    {replyToMessage.text || (replyToMessage.type === 'image' ? 'Photo' : 'Voice note')}
                  </span>
                </div>
              </div>
            )}

            {/* Message Body Content */}
            {message.type === 'text' && (
              <p className="whitespace-pre-wrap leading-relaxed break-words">{message.text}</p>
            )}

            {message.type === 'image' && (
              <div className="space-y-1">
                <div
                  className="rounded-xl overflow-hidden cursor-pointer max-w-xs max-h-64 bg-slate-900/10 hover:opacity-95 transition-opacity"
                  onClick={() => message.mediaUrl && onImageClick?.(message.mediaUrl)}
                >
                  <img src={message.mediaUrl} alt="Attached" className="w-full h-full object-cover" />
                </div>
                {message.text && <p className="mt-1.5 whitespace-pre-wrap">{message.text}</p>}
              </div>
            )}

            {message.type === 'audio' && (
              <div className="flex items-center gap-3 py-1 min-w-[200px]">
                <button
                  onClick={toggleAudio}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                    isMe
                      ? 'bg-white text-indigo-600'
                      : 'bg-indigo-600 text-white dark:bg-indigo-500'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-1 h-6">
                    {[30, 60, 40, 80, 50, 90, 70, 30, 80, 100, 40, 60, 90, 50, 30].map((h, idx) => (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-200 ${
                          isPlayingAudio && idx < 8
                            ? isMe
                              ? 'bg-white'
                              : 'bg-indigo-600'
                            : isMe
                            ? 'bg-indigo-300'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                        style={{ height: `${Math.max(20, (h * (isPlayingAudio ? 1 : 0.7)))}%` }}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] mt-0.5 block ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    00:{message.audioDuration ? String(message.audioDuration).padStart(2, '0') : '08'}
                  </span>
                </div>
              </div>
            )}

            {message.type === 'file' && (
              <div
                className={`flex items-center gap-3 p-2 rounded-xl border ${
                  isMe
                    ? 'bg-indigo-700/50 border-indigo-400/30 text-white'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="p-2 rounded-lg bg-indigo-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">{message.fileName || 'Document.pdf'}</p>
                  <p className="text-[10px] opacity-75">{message.fileSize || '2.4 MB'}</p>
                </div>
              </div>
            )}

            {/* Timestamp & Read Status */}
            <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
              <span>{message.timestamp}</span>
              {isMe && (
                <span>
                  {message.status === 'read' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />
                  ) : message.status === 'delivered' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-indigo-300/80" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-indigo-300/60" />
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons (Reactions / Reply) on hover */}
          <div
            className={`opacity-0 group-hover/bubble:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${
              isMe ? '-left-16' : '-right-16'
            }`}
          >
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              title="React"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onReply?.(message)}
              className="p-1.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              title="Reply"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reactions Display Pills */}
          {message.reactions && message.reactions.length > 0 && (
            <div
              className={`flex items-center gap-1 mt-1 px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs shadow-2xs ${
                isMe ? 'self-end' : 'self-start'
              }`}
            >
              {message.reactions.map((r, idx) => (
                <span key={idx}>{r.emoji}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
