import React from 'react';
import { UserModel } from '../../types';
import { Avatar } from './Avatar';
import { MessageSquare, Phone, Video } from 'lucide-react';

interface UserTileProps {
  user: UserModel;
  onSelectChat?: (userId: string) => void;
  onStartAudioCall?: (userId: string) => void;
  onStartVideoCall?: (userId: string) => void;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const UserTile: React.FC<UserTileProps> = ({
  user,
  onSelectChat,
  onStartAudioCall,
  onStartVideoCall,
  subtitle,
  actionButton,
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors group">
      <div
        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
        onClick={() => onSelectChat && onSelectChat(user.id)}
      >
        <Avatar
          src={user.avatar}
          name={user.name}
          status={user.status}
          isAiBot={user.isAiBot}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
              {user.name}
            </h4>
            {user.isAiBot && (
              <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                AI
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {subtitle || user.statusMessage || user.bio || (user.status === 'online' ? 'Online' : 'Offline')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 pl-2">
        {actionButton ? (
          actionButton
        ) : (
          <>
            {onSelectChat && (
              <button
                onClick={() => onSelectChat(user.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition-colors"
                title="Message"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            )}
            {onStartAudioCall && !user.isAiBot && (
              <button
                onClick={() => onStartAudioCall(user.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400 transition-colors"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
            )}
            {onStartVideoCall && !user.isAiBot && (
              <button
                onClick={() => onStartVideoCall(user.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
