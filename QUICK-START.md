# Quick Start Deployment Guide

This is a quick reference for deploying the CandleWise application. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites

- Azure subscription
- GitHub account
- Vercel account
- Terraform CLI
- Azure CLI

## Quick Setup

### 1. Azure Setup

Run the setup script to create required Azure resources:

```powershell
# Install required PowerShell modules if not already installed
Install-Module -Name Az -Force -AllowClobber

# Run the setup script
.\scripts\setup-azure.ps1 -SubscriptionId "your-subscription-id"
```

### 2. GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

**Required Azure Secrets:**

- `AZURE_CREDENTIALS` - Service Principal JSON (from setup script output)
- `AZURE_SUBSCRIPTION_ID` - Your Azure subscription ID
- `TERRAFORM_STATE_RG` - Terraform state resource group name
- `TERRAFORM_STATE_SA` - Terraform state storage account name
- `TERRAFORM_STATE_CONTAINER` - `terraform-state`

**Required Vercel Secrets:**

- `VERCEL_TOKEN` - Your Vercel access token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### 3. Terraform Backend

Update `infra/backend.tf` with the storage account name from the setup script output.

### 4. Deploy

Push to the `main` branch to trigger automatic deployment of both frontend and backend.

## Architecture

- **Frontend**: Next.js → Vercel
- **Backend**: ASP.NET Core 8 → Azure App Service (F1)
- **Infrastructure**: Terraform
- **CI/CD**: GitHub Actions

## Monitoring

- **Backend**: Application Insights dashboard in Azure portal
- **Frontend**: Vercel Analytics dashboard
- **Health Check**: `https://your-backend-url.azurewebsites.net/health`

## Support

For issues or questions, see the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide.
