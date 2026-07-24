import React from 'react';
import { GroupModel, UserModel } from '../../types';
import { Avatar } from '../widgets/Avatar';
import { CustomButton } from '../widgets/CustomButton';
import { Users, Plus, MessageSquare, Shield, Calendar } from 'lucide-react';

interface GroupsScreenProps {
  groups: GroupModel[];
  users: UserModel[];
  onSelectGroupChat: (groupId: string) => void;
  onOpenCreateGroup: () => void;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({
  groups,
  users,
  onSelectGroupChat,
  onOpenCreateGroup,
}) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Group Channels
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Collaborate, share files, and hold group chats
          </p>
        </div>
        <CustomButton variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={onOpenCreateGroup}>
          New Group
        </CustomButton>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {groups.map((group) => {
          const members = users.filter((u) => group.memberIds.includes(u.id));
          return (
            <div
              key={group.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={group.avatar} name={group.name} isGroup size="lg" showStatus={false} />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm">
                      {group.description || 'No description set.'}
                    </p>
                  </div>
                </div>

                <CustomButton
                  variant="outline"
                  size="sm"
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                  onClick={() => onSelectGroupChat(group.id)}
                >
                  Chat
                </CustomButton>
              </div>

              {/* Members Avatar Pile */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {members.map((m) => (
                      <Avatar key={m.id} src={m.avatar} name={m.name} size="sm" showStatus={false} className="border-2 border-white dark:border-slate-900" />
                    ))}
                  </div>
                  <span>{members.length} Members</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> Created {group.createdAt}
                </div>
              </div>
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No groups found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
