import React from 'react';
import { ThemeMode, WallpaperOption } from '../../types';
import { CustomButton } from '../widgets/CustomButton';
import {
  Settings,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Palette,
  Sparkles,
  RotateCcw,
  Shield,
  Check,
} from 'lucide-react';

interface SettingsScreenProps {
  theme: ThemeMode;
  wallpaper: WallpaperOption;
  soundEnabled: boolean;
  aiAutoReplyEnabled: boolean;
  onUpdateTheme: (theme: ThemeMode) => void;
  onUpdateWallpaper: (wallpaper: WallpaperOption) => void;
  onToggleSound: () => void;
  onToggleAiAutoReply: () => void;
  onResetData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  theme,
  wallpaper,
  soundEnabled,
  aiAutoReplyEnabled,
  onUpdateTheme,
  onUpdateWallpaper,
  onToggleSound,
  onToggleAiAutoReply,
  onResetData,
}) => {
  const wallpapers: { id: WallpaperOption; label: string; desc: string }[] = [
    { id: 'default', label: 'Classic Clean', desc: 'Minimal neutral background' },
    { id: 'doodle', label: 'Pattern Dots', desc: 'Subtle geometric dots' },
    { id: 'gradient', label: 'Soft Aura', desc: 'Vibrant indigo & purple blend' },
    { id: 'dark-slate', label: 'Midnight Slate', desc: 'Deep high contrast dark' },
    { id: 'soft-emerald', label: 'Emerald Tint', desc: 'Calming soft green accent' },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Settings & Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize app theme, wallpapers, notifications, and AI features
          </p>
        </div>

        {/* Theme Settings */}
        <div className="p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" /> Color Theme Mode
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateTheme('light')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <span className="font-bold text-sm block">Light Mode</span>
                <span className="text-[11px] text-slate-400">Bright clean theme</span>
              </div>
            </button>

            <button
              onClick={() => onUpdateTheme('dark')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <span className="font-bold text-sm block">Dark Mode</span>
                <span className="text-[11px] text-slate-400">Eye-friendly contrast</span>
              </div>
            </button>
          </div>
        </div>

        {/* Chat Wallpaper Settings */}
        <div className="p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> Chat Wallpaper
          </h3>
          <div className="space-y-2">
            {wallpapers.map((wp) => (
              <div
                key={wp.id}
                onClick={() => onUpdateWallpaper(wp.id)}
                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  wallpaper === wp.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">{wp.label}</span>
                  <span className="text-xs text-slate-400">{wp.desc}</span>
                </div>
                {wallpaper === wp.id && <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Sound & Notifications */}
        <div className="p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Audio & Notifications
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 block">Sound Effects</span>
                <span className="text-xs text-slate-400">Play audio chime on send & receive</span>
              </div>
            </div>
            <button
              onClick={onToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  soundEnabled ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 block">Gemini AI Smart Assistant</span>
                <span className="text-xs text-slate-400">Enable Gemini bot in chat conversations</span>
              </div>
            </div>
            <button
              onClick={onToggleAiAutoReply}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                aiAutoReplyEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  aiAutoReplyEnabled ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-5 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
          <h3 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Storage & Reset
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Clear all cached messages and restore default seed contacts and conversations.
          </p>
          <CustomButton
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              if (confirm('Are you sure you want to reset all data to initial defaults?')) {
                onResetData();
              }
            }}
          >
            Reset All Messenger Data
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
