import React, { useState } from 'react';
import { CallModel, UserModel } from '../../types';
import { Avatar } from '../widgets/Avatar';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneCall } from 'lucide-react';

interface CallsScreenProps {
  calls: CallModel[];
  users: UserModel[];
  currentUserId: string;
  onStartAudioCall: (userId: string) => void;
  onStartVideoCall: (userId: string) => void;
}

export const CallsScreen: React.FC<CallsScreenProps> = ({
  calls,
  users,
  currentUserId,
  onStartAudioCall,
  onStartVideoCall,
}) => {
  const [filter, setFilter] = useState<'all' | 'missed'>('all');

  const filteredCalls = calls.filter((call) => {
    if (filter === 'missed') return call.status === 'missed';
    return true;
  });

  const getTargetUser = (call: CallModel) => {
    const targetId = call.callerId === currentUserId ? call.receiverId : call.callerId;
    return users.find((u) => u.id === targetId);
  };

  const renderCallIcon = (call: CallModel) => {
    const isOutgoing = call.callerId === currentUserId;
    if (call.status === 'missed') {
      return <PhoneMissed className="w-4 h-4 text-rose-500" />;
    }
    if (isOutgoing) {
      return <PhoneOutgoing className="w-4 h-4 text-emerald-500" />;
    }
    return <PhoneIncoming className="w-4 h-4 text-blue-500" />;
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Recent Calls
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Voice and video call activity logs
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('missed')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'missed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-500'
            }`}
          >
            Missed
          </button>
        </div>
      </div>

      {/* Calls List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {filteredCalls.map((call) => {
          const user = getTargetUser(call);
          if (!user) return null;

          return (
            <div
              key={call.id}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar} name={user.name} status={user.status} size="md" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {user.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    {renderCallIcon(call)}
                    <span>{call.timestamp}</span>
                    {call.duration ? <span>• {formatDuration(call.duration)}</span> : null}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onStartAudioCall(user.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onStartVideoCall(user.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCalls.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            <PhoneCall className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No call history recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};
