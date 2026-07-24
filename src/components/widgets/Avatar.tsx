import React from 'react';
import { UserStatus } from '../../types';
import { Bot, Users } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: UserStatus;
  isGroup?: boolean;
  isAiBot?: boolean;
  showStatus?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  isGroup,
  isAiBot,
  showStatus = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl',
  };

  const statusSizeClasses = {
    sm: 'w-2.5 h-2.5 border-2',
    md: 'w-3.5 h-3.5 border-2',
    lg: 'w-4 h-4 border-2',
    xl: 'w-5 h-5 border-3',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    busy: 'bg-rose-500',
    offline: 'bg-slate-400',
  };

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-medium select-none shadow-xs ${
          isAiBot
            ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white'
            : isGroup
            ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
        }`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : isAiBot ? (
          <Bot className="w-1/2 h-1/2 text-white" />
        ) : isGroup ? (
          <Users className="w-1/2 h-1/2 text-white" />
        ) : (
          <span>{initials || '?'}</span>
        )}
      </div>

      {showStatus && status && !isGroup && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizeClasses[size]} ${
            statusColors[status] || statusColors.offline
          } rounded-full border-white dark:border-slate-900 shadow-xs`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
