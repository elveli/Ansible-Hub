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

## Using Playbooks Locally

You can leverage the `.yml` playbook files included in this repository directly from your command line using the standard `ansible-playbook` CLI tool. Ensure you are in the root of the project:

```bash
# Execute the AWS provisioning playbook (runs locally)
ansible-playbook src/playbooks/provision_aws.yml

# Execute the web application deployment against a distinct inventory
ansible-playbook -i ./my_inventory.ini src/playbooks/deploy_web.yml
```

Ensure your SSH keys, `ansible.cfg`, and target hosts are appropriately configured before executing playbooks against remote machines.

## Deploying AWS Resources (Bootstrapping)

If you plan to run playbooks that target remote EC2 servers (such as `deploy_web.yml`, `db_backup.yml`, or `patch_os.yml`), you must have live AWS EC2 instances running within your environment first. You have two options to deploy this initial infrastructure:

1. **Using the Included Ansible Playbook:** First run the included `provision_aws.yml` locally. It uses `ec2` modules to spin up default VPC configurations, subnets, and EC2 instances:
   ```bash
   ansible-playbook src/playbooks/provision_aws.yml
   ```
2. **Using External Tools:** You can deploy your AWS instances manually via the AWS Management Console, or through Infrastructure-as-Code tools like Terraform or AWS CDK. 

Once your resources exist in AWS, the Ansible Hub UI's **AWS Inventory** tab will automatically discover and display them (via dynamic `DescribeInstances` API calls), provided your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are configured.