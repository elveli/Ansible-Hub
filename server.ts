import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import { spawn, execSync } from 'child_process';
import { randomUUID } from 'crypto';

interface Job {
  id: string;
  playbookId: string;
  status: 'running' | 'successful' | 'failed' | 'pending';
  startedAt: string;
  finishedAt?: string;
  duration?: number;
  user: string;
  logs: string[];
  targetCount: number;
}

const jobs: Job[] = [];

const hasAnsible = (() => {
  try {
    execSync('which ansible-playbook');
    return true;
  } catch (e) {
    return false;
  }
})();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  app.get('/api/instances', async (req, res) => {
    try {
      const region = process.env.AWS_REGION || 'us-east-1';
      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.log('AWS credentials not configured, falling back to mock data.');
        return res.json([
          {
            id: 'i-0abcd1234efgh5678', name: 'web-server-01', type: 't3.medium', state: 'running',
            region: 'us-east-1', publicIp: '54.123.45.67', privateIp: '10.0.1.15',
            tags: { Environment: 'Production', Role: 'WebServer' }
          },
          {
            id: 'i-0abcd1234efgh5679', name: 'web-server-02', type: 't3.medium', state: 'running',
            region: 'us-east-1', publicIp: '54.123.45.68', privateIp: '10.0.1.16',
            tags: { Environment: 'Production', Role: 'WebServer' }
          },
          {
            id: 'i-0dcba8765efgh5670', name: 'db-primary', type: 'r5.large', state: 'running',
            region: 'us-east-1', privateIp: '10.0.2.20',
            tags: { Environment: 'Production', Role: 'Database' }
          },
          {
            id: 'i-0dcba8765efgh5671', name: 'worker-node-01', type: 'c5.xlarge', state: 'stopped',
            region: 'us-east-1', privateIp: '10.0.3.50',
            tags: { Environment: 'Staging', Role: 'Worker' }
          }
        ]);
      }

      const client = new EC2Client({ region });
      const command = new DescribeInstancesCommand({});
      const response = await client.send(command);
      
      const instances = (response.Reservations || []).flatMap(r => r.Instances || []).map(instance => {
        const tags = (instance.Tags || []).reduce((acc: any, tag) => {
          if (tag.Key && tag.Value) acc[tag.Key] = tag.Value;
          return acc;
        }, {});

        return {
          id: instance.InstanceId || 'unknown',
          name: tags.Name || instance.InstanceId || 'unknown',
          type: instance.InstanceType || 'unknown',
          state: instance.State?.Name || 'unknown',
          region: region,
          publicIp: instance.PublicIpAddress,
          privateIp: instance.PrivateIpAddress || 'unknown',
          tags
        };
      });
      res.json(instances);
    } catch (error: any) {
      console.error('Error fetching instances:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch instances' });
    }
  });

  app.post('/api/playbooks/:id/run', (req, res) => {
    const { id } = req.params;
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const jobId = randomUUID();
    const newJob: Job = {
      id: jobId,
      playbookId: id,
      status: 'running',
      startedAt: new Date().toISOString(),
      user: 'admin',
      logs: [`Starting playbook execution for ${filename}...`],
      targetCount: 0
    };
    jobs.push(newJob);
    
    res.json({ id: jobId, message: 'Job started' });

    const playbookPath = path.join(process.cwd(), 'src', 'playbooks', filename);

    if (hasAnsible) {
      const child = spawn('ansible-playbook', [playbookPath], { shell: true });

      child.stdout.on('data', (data) => {
        newJob.logs.push(data.toString());
      });

      child.stderr.on('data', (data) => {
        newJob.logs.push(data.toString());
      });

      child.on('close', (code) => {
        newJob.status = code === 0 ? 'successful' : 'failed';
        newJob.finishedAt = new Date().toISOString();
        newJob.duration = Math.floor((new Date(newJob.finishedAt).getTime() - new Date(newJob.startedAt).getTime()) / 1000);
      });

      child.on('error', (err) => {
        newJob.logs.push(`Error executing ansible: ${err.message}`);
        newJob.status = 'failed';
        newJob.finishedAt = new Date().toISOString();
      });
    } else {
      // Mock execution if ansible-playbook is missing
      newJob.logs.push('WARNING: ansible-playbook command not found in environment.');
      newJob.logs.push(`Simulating execution of ${playbookPath}...`);
      
      let step = 0;
      const steps = [
        `PLAY [${filename}] ************************************************************`,
        `TASK [Gathering Facts] *********************************************************`,
        `ok: [localhost]`,
        `TASK [Executing requested modules] **********************************************`,
        `changed: [localhost]`,
        `PLAY RECAP *********************************************************************`,
        `localhost                  : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   `
      ];

      const interval = setInterval(() => {
        if (step < steps.length) {
          newJob.logs.push(steps[step]);
          step++;
        } else {
          clearInterval(interval);
          newJob.status = 'successful';
          newJob.finishedAt = new Date().toISOString();
          newJob.duration = Math.floor((new Date(newJob.finishedAt).getTime() - new Date(newJob.startedAt).getTime()) / 1000);
          newJob.targetCount = 1;
        }
      }, 1500);
    }
  });

  app.get('/api/jobs', (req, res) => {
    // Return jobs sorted by most recent
    res.json([...jobs].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
