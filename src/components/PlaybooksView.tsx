import React from 'react';
import { Playbook } from '../types';
import { PlayCircle, Clock, Tag } from 'lucide-react';

interface PlaybooksViewProps {
  playbooks: Playbook[];
  onRunPlaybook: (playbookId: string) => void;
}

export function PlaybooksView({ playbooks, onRunPlaybook }: PlaybooksViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Playbooks</h1>
        <p className="text-slate-400 mt-1">Manage and execute Ansible automation playbooks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playbooks.map(playbook => (
          <div key={playbook.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-slate-200 leading-tight">{playbook.name}</h3>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 flex-grow">{playbook.description}</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {playbook.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 text-xs text-slate-300">
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{playbook.lastRun ? new Date(playbook.lastRun).toLocaleDateString() : 'Never'}</span>
                </div>
                
                <button 
                  onClick={() => onRunPlaybook(playbook.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-white text-slate-900 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-slate-300 focus:outline-none"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Run</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
