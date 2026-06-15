import React, { useState, useEffect } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PlaybooksView } from './components/PlaybooksView';
import { InventoryView } from './components/InventoryView';
import { JobsView } from './components/JobsView';
import { MOCK_PLAYBOOKS } from './data';
import { Job, Instance } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loadingInstances, setLoadingInstances] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    }
  };

  const fetchInstances = async () => {
    setLoadingInstances(true);
    try {
      const res = await fetch('/api/instances');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch instances');
      }
      setInstances(data);
    } catch (e) {
      console.error('Failed to fetch instances', e);
      // Optional: Handle error UI
    } finally {
      setLoadingInstances(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchInstances();
    
    // Poll for jobs periodically
    const interval = setInterval(() => {
      fetchJobs();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRunPlaybook = async (playbookId: string) => {
    const playbook = MOCK_PLAYBOOKS.find(p => p.id === playbookId);
    if (!playbook) return;

    try {
      const res = await fetch(`/api/playbooks/${playbookId}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: playbook.filename })
      });
      if (res.ok) {
        fetchJobs();
        setActiveTab('jobs');
      } else {
        const errorData = await res.json();
        alert('Failed to start run: ' + errorData.error);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to start run due to network error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              jobs={jobs} 
              instances={instances} 
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
            <InventoryView instances={instances} onSync={fetchInstances} isLoading={loadingInstances} />
          )}
          {activeTab === 'jobs' && (
            <JobsView jobs={jobs} playbooks={MOCK_PLAYBOOKS} />
          )}
        </div>
      </main>
    </div>
  );
}

