import React, { useState } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PlaybooksView } from './components/PlaybooksView';
import { InventoryView } from './components/InventoryView';
import { JobsView } from './components/JobsView';
import { MOCK_PLAYBOOKS, MOCK_INSTANCES, MOCK_JOBS } from './data';
import { Job } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);

  const handleRunPlaybook = (playbookId: string) => {
    // Simulate a playbook run
    const newJob: Job = {
      id: `job-${Math.floor(Math.random() * 10000)}`,
      playbookId,
      status: 'running',
      startedAt: new Date().toISOString(),
      user: 'timo.e.kettunen',
      logs: [
        `PLAY [${MOCK_PLAYBOOKS.find(p => p.id === playbookId)?.name}] ********************`,
        `TASK [Gathering Facts] *********************************************************`,
      ],
      targetCount: Math.floor(Math.random() * 5) + 1
    };

    setJobs(prev => [newJob, ...prev]);
    setActiveTab('jobs');

    // Simulate logs appearing and job completion
    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === newJob.id) {
          return {
            ...job,
            logs: [...job.logs, `ok: [target-1]`, `ok: [target-2]`]
          };
        }
        return job;
      }));
    }, 2000);

    setTimeout(() => {
      setJobs(prev => prev.map(job => {
        if (job.id === newJob.id) {
          return {
            ...job,
            status: 'successful',
            finishedAt: new Date().toISOString(),
            duration: 5,
            logs: [
              ...job.logs, 
              `TASK [Execute main logic] ******************************************************`,
              `changed: [target-1]`,
              `changed: [target-2]`,
              `PLAY RECAP *********************************************************************`,
              `target-1 : ok=2 changed=1 unreachable=0 failed=0`,
              `target-2 : ok=2 changed=1 unreachable=0 failed=0`
            ]
          };
        }
        return job;
      }));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              jobs={jobs} 
              instances={MOCK_INSTANCES} 
              playbooks={MOCK_PLAYBOOKS} 
            />
          )}
          {activeTab === 'playbooks' && (
            <PlaybooksView 
              playbooks={MOCK_PLAYBOOKS} 
              onRunPlaybook={handleRunPlaybook}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryView instances={MOCK_INSTANCES} />
          )}
          {activeTab === 'jobs' && (
            <JobsView jobs={jobs} playbooks={MOCK_PLAYBOOKS} />
          )}
        </div>
      </main>
    </div>
  );
}

