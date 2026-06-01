export type JobStatus = 'running' | 'successful' | 'failed' | 'pending';

export interface Playbook {
  id: string;
  name: string;
  description: string;
  tags: string[];
  lastRun?: string;
  filename: string;
}

export interface Instance {
  id: string;
  name: string;
  type: string;
  state: 'running' | 'stopped' | 'terminated';
  region: string;
  publicIp?: string;
  privateIp: string;
  tags: Record<string, string>;
}

export interface Job {
  id: string;
  playbookId: string;
  status: JobStatus;
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  user: string;
  logs: string[];
  targetCount: number;
}
