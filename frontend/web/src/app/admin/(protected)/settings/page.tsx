'use client';

import { useState } from 'react';
import { Settings, Shield, Bell } from 'lucide-react';
import GeneralSettings from '@/src/components/admin/settings/GeneralSettings';
import SecuritySettings from '@/src/components/admin/settings/SecuritySettings';
import NotificationSettings from '@/src/components/admin/settings/NotificationSettings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="flex flex-col gap-8 pt-2 pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your store preferences and account settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation for Settings */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white rounded-[20px] shadow-sm border border-gray-100 p-2">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-md shadow-black/10'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </div>
      </div>
    </div>
  );
}
