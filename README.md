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
