import React, { useState } from 'react';
import { UserModel } from '../../types';
import { UserTile } from '../widgets/UserTile';
import { CustomButton } from '../widgets/CustomButton';
import { Users, UserPlus, Search } from 'lucide-react';

interface ContactsScreenProps {
  users: UserModel[];
  currentUserId: string;
  onSelectChat: (userId: string) => void;
  onStartAudioCall: (userId: string) => void;
  onStartVideoCall: (userId: string) => void;
  onOpenAddContact: () => void;
}

export const ContactsScreen: React.FC<ContactsScreenProps> = ({
  users,
  currentUserId,
  onSelectChat,
  onStartAudioCall,
  onStartVideoCall,
  onOpenAddContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = users.filter((u) => u.id !== currentUserId);

  const filteredContacts = contacts.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Contacts Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {contacts.length} saved contacts available
          </p>
        </div>
        <CustomButton variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />} onClick={onOpenAddContact}>
          Add Contact
        </CustomButton>
      </div>

      {/* Search Input */}
      <div className="py-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {filteredContacts.map((contact) => (
          <UserTile
            key={contact.id}
            user={contact}
            onSelectChat={onSelectChat}
            onStartAudioCall={onStartAudioCall}
            onStartVideoCall={onStartVideoCall}
          />
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No contacts matching search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
