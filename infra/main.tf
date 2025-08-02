# CandleWise Backend Infrastructure
# This file provisions Azure App Service F1 plan for the ASP.NET Core backend

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "candlewise" {
  name     = "rg-candlewise-${var.environment}"
  location = var.location

  tags = {
    environment = var.environment
    project     = "candlewise"
    managed-by  = "terraform"
  }
}

# App Service Plan (F1 Free Tier)
resource "azurerm_service_plan" "candlewise" {
  name                = "asp-candlewise-${var.environment}"
  resource_group_name = azurerm_resource_group.candlewise.name
  location            = azurerm_resource_group.candlewise.location
  os_type             = "Linux"
  sku_name            = "F1"

  tags = {
    environment = var.environment
    project     = "candlewise"
    managed-by  = "terraform"
  }
}

# App Service for Backend API
resource "azurerm_linux_web_app" "candlewise_backend" {
  name                = "app-candlewise-backend-${var.environment}"
  resource_group_name = azurerm_resource_group.candlewise.name
  location            = azurerm_service_plan.candlewise.location
  service_plan_id     = azurerm_service_plan.candlewise.id

  site_config {
    always_on                         = false # F1 plan doesn't support always_on
    container_registry_use_managed_identity = false
    
    application_stack {
      dotnet_version = "8.0"
    }

    # Enable CORS for frontend communication
    cors {
      allowed_origins     = var.frontend_urls
      support_credentials = true
    }
  }

  app_settings = {
    "ASPNETCORE_ENVIRONMENT" = var.environment
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    # Add your application-specific settings here
    # "API_KEY" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.api_key.id})"
  }

  # Enable Application Insights if needed
  # identity {
  #   type = "SystemAssigned"
  # }

  tags = {
    environment = var.environment
    project     = "candlewise"
    managed-by  = "terraform"
  }
}

# Application Insights
resource "azurerm_log_analytics_workspace" "candlewise" {
  name                = "log-candlewise-${var.environment}"
  location            = azurerm_resource_group.candlewise.location
  resource_group_name = azurerm_resource_group.candlewise.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags = {
    environment = var.environment
    project     = "candlewise"
    managed-by  = "terraform"
  }
}

resource "azurerm_application_insights" "candlewise" {
  name                = "appi-candlewise-${var.environment}"
  location            = azurerm_resource_group.candlewise.location
  resource_group_name = azurerm_resource_group.candlewise.name
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.candlewise.id

  tags = {
    environment = var.environment
    project     = "candlewise"
    managed-by  = "terraform"
  }
}

# Optional: Key Vault for secrets (if you have sensitive data)
# resource "azurerm_key_vault" "candlewise" {
#   name                = "kv-candlewise-${var.environment}-${random_string.suffix.result}"
#   location            = azurerm_resource_group.candlewise.location
#   resource_group_name = azurerm_resource_group.candlewise.name
#   tenant_id           = data.azurerm_client_config.current.tenant_id
#   sku_name            = "standard"
#
#   access_policy {
#     tenant_id = data.azurerm_client_config.current.tenant_id
#     object_id = azurerm_linux_web_app.candlewise_backend.identity[0].principal_id
#
#     secret_permissions = [
#       "Get",
#       "List"
#     ]
#   }
#
#   tags = {
#     environment = var.environment
#     project     = "candlewise"
#     managed-by  = "terraform"
#   }
# }

# data "azurerm_client_config" "current" {}

# resource "random_string" "suffix" {
#   length  = 6
#   special = false
#   upper   = false
# }
