import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, User, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { dark, toggleDark } = useTheme();

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      {/* Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
          <User size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Profile Settings</h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
            <input
              type="text"
              value={user?.first_name ?? ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Set during registration</p>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50">
          <Sun size={20} className="text-amber-600 dark:text-amber-400" />
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Appearance</h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {dark ? <Moon size={18} className="text-slate-500" /> : <Sun size={18} className="text-slate-500" />}
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{dark ? 'Currently enabled' : 'Currently disabled'}</p>
              </div>
            </div>
            <button
              onClick={toggleDark}
              className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-200 flex items-center"
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${dark ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-3xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Account Management</p>
            <p className="text-xs text-blue-800 dark:text-blue-200">Password changes and advanced account settings will be available in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
