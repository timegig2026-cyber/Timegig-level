import React from 'react';
import { 
  Settings, 
  LogOut,
  Bell,
  Globe
} from 'lucide-react';

interface SettingsViewProps {
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  apiIngressEnabled: boolean;
  onToggleApiIngress: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  onClose, 
  notificationsEnabled, 
  onToggleNotifications,
  apiIngressEnabled,
  onToggleApiIngress
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Settings className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 p-2"
        >
          Done
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono px-2">Account Preferences</h3>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            {/* Notification Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${notificationsEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">Message Notifications</p>
                  <p className="text-[10px] text-slate-500 font-medium">Receive alerts for new incoming messages</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={onToggleNotifications}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* API Ingress Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${apiIngressEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900">API Ingress</p>
                  <p className="text-[10px] text-slate-500 font-medium">Allow external services to sync with your profile</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={onToggleApiIngress}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  apiIngressEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    apiIngressEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono px-2">Danger Zone</h3>
          <button className="w-full p-4 bg-white border border-red-100 rounded-2xl flex items-center justify-between group hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <LogOut className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-red-600">Log Out</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
