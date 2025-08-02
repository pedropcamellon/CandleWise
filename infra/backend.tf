# backend.tf - Terraform state configuration

terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "candlewisetfstate"
    container_name       = "tfstate"
    key                  = "candlewise-dev.tfstate"
  }
}