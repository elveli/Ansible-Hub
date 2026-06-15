import React from 'react';
import { Instance } from '../types';
import { Cloud, Server, Power, PowerOff, RefreshCw } from 'lucide-react';

interface InventoryViewProps {
  instances: Instance[];
  onSync: () => void;
  isLoading: boolean;
}

export function InventoryView({ instances, onSync, isLoading }: InventoryViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AWS Inventory</h1>
          <p className="text-slate-400 mt-1">Dynamic inventory fetched from AWS EC2.</p>
        </div>
        <button 
          onClick={onSync}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-sm font-medium rounded-md transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Inventory</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[300px]">
        {instances.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full p-12 text-slate-500">
            No instances found. Ensure AWS credentials are set and instances exist in the region.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Instance Name</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Region</th>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {instances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Server className="w-4 h-4 text-slate-500" />
                        <div>
                          <div className="font-medium text-slate-200">{instance.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{instance.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-xs font-mono">
                        <Cloud className="w-3 h-3 text-slate-400" />
                        <span>{instance.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        instance.state === 'running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {instance.state === 'running' ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                        <span className="capitalize">{instance.state}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{instance.region}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-slate-300 font-mono text-xs">{instance.privateIp} <span className="text-slate-500 text-[10px] uppercase">priv</span></span>
                        {instance.publicIp && (
                          <span className="text-slate-300 font-mono text-xs">{instance.publicIp} <span className="text-slate-500 text-[10px] uppercase">pub</span></span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(instance.tags).map(([key, value]) => (
                          <span key={key} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-700">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
