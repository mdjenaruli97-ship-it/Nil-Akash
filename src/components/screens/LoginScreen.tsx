import React, { useState } from 'react';
import { UserModel } from '../../types';
import { Avatar } from '../widgets/Avatar';
import { CustomButton } from '../widgets/CustomButton';
import { MessageSquare, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  availableUsers: UserModel[];
  onLogin: (user: UserModel) => void;
  onCreateAccount: (user: UserModel) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  availableUsers,
  onLogin,
  onCreateAccount,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('Hey there! I am using Messenger App');
  const [phone, setPhone] = useState('');

  const humanUsers = availableUsers.filter((u) => !u.isAiBot);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newUser: UserModel = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      status: 'online',
      statusMessage: bio,
      bio,
      phone: phone || '+1 (555) 123-4567',
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    };
    onCreateAccount(newUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glowing Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Messenger</h1>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Real-time Chat, Calls & AI Assistant
          </p>
        </div>

        {!isCreating ? (
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Select Demo User Account
            </h3>
            <div className="space-y-2 mb-6">
              {humanUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} name={user.name} status={user.status} size="md" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-xs text-slate-400">{user.bio || user.statusMessage}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>

            <CustomButton
              variant="outline"
              fullWidth
              onClick={() => setIsCreating(true)}
              className="text-slate-300 border-slate-700 hover:bg-slate-800"
            >
              + Create New Profile
            </CustomButton>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 mb-2">Create Your Chat Profile</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status / Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Available for chat"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <CustomButton variant="ghost" onClick={() => setIsCreating(false)} type="button">
                Back
              </CustomButton>
              <CustomButton variant="primary" type="submit" disabled={!name.trim()}>
                Get Started
              </CustomButton>
            </div>
          </form>
        )}

        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> End-to-end simulated privacy
        </div>
      </div>
    </div>
  );
};
