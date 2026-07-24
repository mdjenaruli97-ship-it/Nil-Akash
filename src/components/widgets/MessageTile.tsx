import React from 'react';
import { ChatModel, UserModel, GroupModel, MessageModel } from '../../types';
import { Avatar } from './Avatar';
import { Pin, Image as ImageIcon, Mic, FileText } from 'lucide-react';

interface MessageTileProps {
  chat: ChatModel;
  targetUser?: UserModel;
  targetGroup?: GroupModel;
  lastMessage?: MessageModel;
  isSelected?: boolean;
  onClick: () => void;
}

export const MessageTile: React.FC<MessageTileProps> = ({
  chat,
  targetUser,
  targetGroup,
  lastMessage,
  isSelected = false,
  onClick,
}) => {
  const isGroup = chat.type === 'group';
  const title = isGroup ? targetGroup?.name || 'Group' : targetUser?.name || 'User';
  const avatar = isGroup ? targetGroup?.avatar : targetUser?.avatar;
  const status = isGroup ? undefined : targetUser?.status;
  const isAiBot = !isGroup && targetUser?.isAiBot;

  const renderLastMessageContent = () => {
    if (!lastMessage) return <span className="italic">No messages yet</span>;

    if (lastMessage.type === 'image') {
      return (
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> Photo
        </span>
      );
    }
    if (lastMessage.type === 'audio') {
      return (
        <span className="flex items-center gap-1">
          <Mic className="w-3.5 h-3.5 text-emerald-500" /> Voice message ({lastMessage.audioDuration || 10}s)
        </span>
      );
    }
    if (lastMessage.type === 'file') {
      return (
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-amber-500" /> Attachment
        </span>
      );
    }

    return lastMessage.text || '';
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-150 select-none ${
        isSelected
          ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/40'
          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
      }`}
    >
      <Avatar
        src={avatar}
        name={title}
        status={status}
        isGroup={isGroup}
        isAiBot={isAiBot}
        size="lg"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
              {title}
            </h4>
            {isAiBot && (
              <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                AI
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
            {lastMessage?.timestamp || chat.lastMessageTimestamp || ''}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
            {renderLastMessageContent()}
          </p>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {chat.isPinned && (
              <Pin className="w-3.5 h-3.5 text-slate-400 rotate-45" />
            )}
            {chat.unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-indigo-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
