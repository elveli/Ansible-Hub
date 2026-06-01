import React from 'react';
import { Home, PlaySquare, Server, Activity, Settings, Terminal, LogOut } from 'lucide-react';

export type TabId = 'dashboard' | 'playbooks' | 'inventory' | 'jobs';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'playbooks', label: 'Playbooks', icon: PlaySquare },
    { id: 'inventory', label: 'Inventory (AWS)', icon: Server },
    { id: 'jobs', label: 'Jobs', icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-red-600 p-2 rounded-lg">
          <Terminal className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-100">Ansible Hub</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-slate-800 text-red-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer rounded-md hover:bg-slate-800 transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </div>
        <div className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 cursor-pointer rounded-md hover:bg-slate-800 transition-colors mt-1">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </div>
      </div>
    </div>
  );
}
