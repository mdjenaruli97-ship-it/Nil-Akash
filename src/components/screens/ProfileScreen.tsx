import React, { useState } from 'react';
import { UserModel, UserStatus } from '../../types';
import { Avatar } from '../widgets/Avatar';
import { CustomButton } from '../widgets/CustomButton';
import { User, Phone, Mail, FileText, Check, LogOut, Camera } from 'lucide-react';

interface ProfileScreenProps {
  currentUser: UserModel;
  onUpdateProfile: (updated: Partial<UserModel>) => void;
  onSwitchUser: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onUpdateProfile,
  onSwitchUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [statusMessage, setStatusMessage] = useState(currentUser.statusMessage || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [status, setStatus] = useState<UserStatus>(currentUser.status);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      statusMessage: statusMessage.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
      status,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="relative inline-block mb-3">
            <Avatar src={avatar} name={name} size="xl" status={status} />
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="text"
                className="hidden"
                onClick={() => {
                  const url = prompt('Enter image URL for avatar:', avatar);
                  if (url) setAvatar(url);
                }}
              />
            </label>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{email}</p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 bg-slate-50/50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Personal Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Status Message
            </label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="e.g. In a meeting, Coding..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Online Status Availability
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['online', 'away', 'busy', 'offline'] as UserStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    status === st
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Bio / About Me
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <CustomButton variant="outline" type="button" icon={<LogOut className="w-4 h-4" />} onClick={onSwitchUser}>
              Switch Account
            </CustomButton>
            <CustomButton variant="primary" type="submit">
              Save Changes
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};
