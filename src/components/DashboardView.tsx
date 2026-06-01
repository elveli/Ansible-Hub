import React from 'react';
import { Activity, CheckCircle2, Server, XCircle } from 'lucide-react';
import { Job, Instance, Playbook } from '../types';

interface DashboardViewProps {
  jobs: Job[];
  instances: Instance[];
  playbooks: Playbook[];
}

export function DashboardView({ jobs, instances, playbooks }: DashboardViewProps) {
  const successfulJobs = jobs.filter(j => j.status === 'successful').length;
  const failedJobs = jobs.filter(j => j.status === 'failed').length;
  const runningJobs = jobs.filter(j => j.status === 'running').length;
  
  const runningInstances = instances.filter(i => i.state === 'running').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-slate-400 mt-1">Ansible automation status and infrastructure metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Playbooks</p>
            <p className="text-3xl font-bold text-slate-100 mt-1">{playbooks.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Active Instances</p>
            <p className="text-3xl font-bold text-slate-100 mt-1">{runningInstances} <span className="text-sm text-slate-500 font-normal">/ {instances.length}</span></p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Server className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Running Jobs</p>
            <p className="text-3xl font-bold text-slate-100 mt-1">{runningJobs}</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Failed Jobs</p>
            <p className="text-3xl font-bold text-slate-100 mt-1">{failedJobs}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {jobs.slice(0, 5).map(job => (
              <div key={job.id} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {job.status === 'successful' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {job.status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
                  {job.status === 'running' && <Activity className="w-5 h-5 text-blue-500 animate-pulse" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Playbook executed: <span className="text-slate-400">{playbooks.find(p => p.id === job.playbookId)?.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(job.startedAt).toLocaleString()} by {job.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
           <h2 className="text-lg font-semibold text-slate-200 mb-4">Inventory Summary (AWS)</h2>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">us-east-1</span>
                <span className="text-sm font-medium text-slate-200">{instances.filter(i => i.region === 'us-east-1').length} instances</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">us-west-2</span>
                <span className="text-sm font-medium text-slate-200">{instances.filter(i => i.region === 'us-west-2').length} instances</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
