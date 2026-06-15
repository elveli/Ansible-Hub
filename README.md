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

## Future Enhancements
- Integration with an actual backend API for real-time AWS EC2 data fetching.
- Connecting playbook execution directly to Ansible commands using a node backend.
