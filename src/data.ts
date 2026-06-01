import { Playbook, Instance, Job } from './types';

export const MOCK_PLAYBOOKS: Playbook[] = [
  {
    id: 'pb-1',
    name: 'Deploy Web Application',
    description: 'Deploys the latest Node.js web application to target EC2 instances, configures Nginx, and restarts services.',
    tags: ['web', 'deploy', 'production'],
    lastRun: '2026-06-01T20:15:00Z',
    filename: 'deploy_web.yml',
  },
  {
    id: 'pb-2',
    name: 'Provision AWS Environment',
    description: 'Provisions VPC, subnets, security groups, and EC2 instances via CloudFormation/Ansible modules.',
    tags: ['provisioning', 'aws', 'infrastructure'],
    lastRun: '2026-05-28T14:30:00Z',
    filename: 'provision_aws.yml',
  },
  {
    id: 'pb-3',
    name: 'Security Patching',
    description: 'Applies critical OS security updates and reboots instances in a rolling fashion.',
    tags: ['security', 'maintenance', 'ubuntu'],
    lastRun: '2026-05-30T02:00:00Z',
    filename: 'patch_os.yml',
  },
  {
    id: 'pb-4',
    name: 'Database Backup to S3',
    description: 'Dumps the PostgreSQL database and streams the compressed archive to an S3 bucket.',
    tags: ['database', 'backup', 's3'],
    lastRun: '2026-06-01T22:00:00Z',
    filename: 'db_backup.yml',
  },
];

export const MOCK_INSTANCES: Instance[] = [
  {
    id: 'i-0abcd1234efgh5678',
    name: 'web-server-01',
    type: 't3.medium',
    state: 'running',
    region: 'us-east-1',
    publicIp: '54.123.45.67',
    privateIp: '10.0.1.15',
    tags: { Environment: 'Production', Role: 'WebServer' }
  },
  {
    id: 'i-0abcd1234efgh5679',
    name: 'web-server-02',
    type: 't3.medium',
    state: 'running',
    region: 'us-east-1',
    publicIp: '54.123.45.68',
    privateIp: '10.0.1.16',
    tags: { Environment: 'Production', Role: 'WebServer' }
  },
  {
    id: 'i-0dcba8765efgh5670',
    name: 'db-primary',
    type: 'r5.large',
    state: 'running',
    region: 'us-east-1',
    privateIp: '10.0.2.20',
    tags: { Environment: 'Production', Role: 'Database' }
  },
  {
    id: 'i-0dcba8765efgh5671',
    name: 'worker-node-01',
    type: 'c5.xlarge',
    state: 'stopped',
    region: 'us-east-1',
    privateIp: '10.0.3.50',
    tags: { Environment: 'Staging', Role: 'Worker' }
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1045',
    playbookId: 'pb-4',
    status: 'successful',
    startedAt: '2026-06-01T22:00:00Z',
    finishedAt: '2026-06-01T22:05:23Z',
    duration: 323,
    user: 'system_cron',
    targetCount: 1,
    logs: [
      'PLAY [Database Backup] *********************************************************',
      'TASK [Gathering Facts] *********************************************************',
      'ok: [db-primary]',
      'TASK [Dump PostgreSQL database] ************************************************',
      'changed: [db-primary]',
      'TASK [Upload to S3] ************************************************************',
      'changed: [db-primary]',
      'PLAY RECAP *********************************************************************',
      'db-primary             : ok=3    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   '
    ]
  },
  {
    id: 'job-1044',
    playbookId: 'pb-1',
    status: 'failed',
    startedAt: '2026-06-01T20:10:00Z',
    finishedAt: '2026-06-01T20:15:00Z',
    duration: 300,
    user: 'timo.e.kettunen',
    targetCount: 2,
    logs: [
      'PLAY [Deploy Web Application] **************************************************',
      'TASK [Gathering Facts] *********************************************************',
      'ok: [web-server-01]',
      'ok: [web-server-02]',
      'TASK [Pull latest code from git] ***********************************************',
      'changed: [web-server-01]',
      'fatal: [web-server-02]: FAILED! => {"changed": false, "msg": "Failed to connect to repository"}',
      'PLAY RECAP *********************************************************************',
      'web-server-01          : ok=2    changed=1    unreachable=0    failed=0',
      'web-server-02          : ok=1    changed=0    unreachable=0    failed=1'
    ]
  }
];
