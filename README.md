# Ansible Hub

Ansible Hub is a web-based dashboard for simplifying Ansible playbook execution and monitoring on AWS. It provides a visual interface for managing your automation tasks, inventory, and viewing execution logs.

## Features

- **Dashboard:** Provides an overview of your active automation metrics including total playbooks, active instances, running jobs, and a summary of recent activity and AWS inventory.
- **Playbooks:** Easily catalog, view, and run Ansible playbooks. Sample playbooks can be found in the `src/playbooks` directory.
- **Inventory (AWS):** Monitor your AWS EC2 instance inventory dynamically. It provides a clean tabular view of your instances, their states, IPs, and tags.
- **Jobs History:** A comprehensive view to monitor playbooks execution statuses, durations, and detailed standard output logs for debugging and auditing.

## Project Structure

- `src/components/`: React UI components.
  - `DashboardView.tsx`: The main overview of the Ansible statistics.
  - `PlaybooksView.tsx`: Displays the available playbooks.
  - `InventoryView.tsx`: Displays the current AWS EC2 inventory.
  - `JobsView.tsx`: Displays the logs and outcomes of playbook runs.
- `src/playbooks/`: This directory contains example mock Ansible YAML playbooks:
  - `deploy_web.yml`
  - `provision_aws.yml`
  - `patch_os.yml`
  - `db_backup.yml`
- `src/data.ts`: Contains the mock static data that drives the dashboard (Playbooks, Instances, and Jobs data representations).
- `src/types.ts`: Shared TypeScript types for the application entities.

## Architecture Overview

- **Frontend:** React application that provides the visualizations, interactive playbook runner, and inventory views.
- **Backend:** A Node.js (Express) server executing real system automation tasks via `child_process`. It handles streaming Ansible execution logs and syncing live real-time metrics back to the dashboard.
- **AWS Integration:** Directly connected via the AWS SDK (`@aws-sdk/client-ec2`).

## Configuration

To connect the live AWS Inventory service, provide your AWS environment variables in your server configuration (or `.env` file):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`

*(If `ansible-playbook` is not detected in your server's runtime block, the custom Ansible executor will fall back to executing a deterministic simulated playbook task stream.)*

## Execution Workflow (Running Playbooks against AWS)

To successfully leverage the playbooks included in this repository and target your AWS infrastructure, **you must execute them in a specific order.**

### Step 1: Provision Infrastructure (Bootstrapping)
If you do not already have live EC2 instances running, you must provision them first. The deployment and maintenance playbooks (`deploy_web.yml`, `patch_os.yml`, `db_backup.yml`) will fail if their target hosts do not exist.

You can provision your environment using the included Ansible playbook, which interacts with AWS APIs to stand up the network and instances:
```bash
# This runs locally and creates VPCs, Subnets, and EC2 instances in your AWS account
ansible-playbook src/playbooks/provision_aws.yml
```
*(Note: Ensure your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are exported in your terminal environment before running this).*

Once provisioned, the Ansible Hub UI's **AWS Inventory** tab will automatically discover and display these new resources.

### Step 2: Setup your AWS Inventory
To run subsequent playbooks against your newly created EC2 instances, Ansible needs to know how to connect to them. You can manage this by either:
1. **Using an AWS Dynamic Inventory Plugin** (e.g., configuring an `aws_ec2.yml` file) so Ansible queries AWS automatically for running instances based on tags.
2. **Using a Static Inventory File** by retrieving the IP addresses directly from the Ansible Hub UI and placing them in a local `inventory.ini` file:
   ```ini
   [webservers]
   54.123.45.67 # public IP
   54.123.45.68 # public IP

   [db_servers]
   10.0.2.20 ansible_ssh_common_args='...bastion setup...' # private IP
   ```

### Step 3: Configure and Deploy
After your instances are running and your inventory is configured, you can run the configuration playbooks to install software, deploy code, or execute maintenance. 

```bash
# Deploy the web app to EC2 instances labeled under 'webservers' in your inventory
ansible-playbook -i inventory.ini src/playbooks/deploy_web.yml --private-key=/path/to/aws-key.pem -u ubuntu

# Perform database backups on EC2 instances labeled under 'db_servers'
ansible-playbook -i inventory.ini src/playbooks/db_backup.yml --private-key=/path/to/aws-key.pem -u ubuntu

# Run rolling security patches across all inventory instances
ansible-playbook -i inventory.ini src/playbooks/patch_os.yml --private-key=/path/to/aws-key.pem -u ubuntu
```