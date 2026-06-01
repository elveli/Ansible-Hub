import React from 'react';
import { Job, Playbook } from '../types';
import { CheckCircle2, XCircle, Clock, Loader2, Search, TerminalSquare } from 'lucide-react';

interface JobsViewProps {
  jobs: Job[];
  playbooks: Playbook[];
}

export function JobsView({ jobs, playbooks }: JobsViewProps) {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const getPlaybookName = (id: string) => {
    return playbooks.find(p => p.id === id)?.name || id;
  };

  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'successful': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border";
    switch (status) {
      case 'successful': return `${base} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`;
      case 'failed': return `${base} bg-red-500/10 text-red-400 border-red-500/20`;
      case 'running': return `${base} bg-blue-500/10 text-blue-400 border-blue-500/20`;
      default: return `${base} bg-slate-800 text-slate-400 border-slate-700`;
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      {/* Jobs List */}
      <div className={`flex-col space-y-4 ${selectedJob ? 'hidden lg:flex w-1/3' : 'flex w-full'}`}>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Jobs History</h1>
          <p className="text-slate-400 mt-1">Recent automation runs and their status.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-md py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedJob?.id === job.id 
                  ? 'bg-slate-800 border-slate-600' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(job.status)}
                  <span className="font-medium text-slate-200 truncate">{getPlaybookName(job.playbookId)}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">{job.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <span>{new Date(job.startedAt).toLocaleString()}</span>
                  <span>{job.duration ? `${job.duration}s` : '--'}</span>
                </div>
                <span className={getStatusBadge(job.status)}>{job.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Job Details / Logs */}
      {selectedJob ? (
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
              <h2 className="text-lg font-semibold text-slate-200 flex items-center space-x-2">
                {getStatusIcon(selectedJob.status)}
                <span>{getPlaybookName(selectedJob.playbookId)}</span>
              </h2>
              <div className="text-sm text-slate-400 mt-1 flex space-x-4">
                <span>Started: {new Date(selectedJob.startedAt).toLocaleString()}</span>
                <span>User: {selectedJob.user}</span>
                <span>Targets: {selectedJob.targetCount}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedJob(null)}
              className="lg:hidden px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm hover:bg-slate-700"
            >
              Close
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-[#0d1117] font-mono text-sm">
            <div className="flex items-center space-x-2 text-slate-500 mb-4 pb-2 border-b border-slate-800/50">
              <TerminalSquare className="w-4 h-4" />
              <span>Standard Out</span>
            </div>
            {selectedJob.logs.map((log, i) => {
              let logColor = "text-slate-300";
              if (log.includes("PLAY [") || log.includes("TASK [")) logColor = "text-cyan-400 font-bold";
              else if (log.includes("ok: [")) logColor = "text-emerald-400";
              else if (log.includes("changed: [")) logColor = "text-amber-400";
              else if (log.includes("fatal: [") || log.includes("FAILED!")) logColor = "text-red-400";
              else if (log.includes("PLAY RECAP")) logColor = "text-fuchsia-400 font-bold";

              return (
                <div key={i} className={`whitespace-pre-wrap leading-relaxed ${logColor}`}>
                  {log}
                </div>
              );
            })}
            {selectedJob.status === 'running' && (
              <div className="flex items-center space-x-2 text-slate-500 mt-4 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Waiting for output...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
          <div className="text-center text-slate-500">
            <TerminalSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Select a job to view detailed execution logs</p>
          </div>
        </div>
      )}
    </div>
  );
}
