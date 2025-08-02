# Output values from the Terraform deployment

output "resource_group_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.candlewise.name
}

output "app_service_name" {
  description = "Name of the App Service"
  value       = azurerm_linux_web_app.candlewise_backend.name
}

output "app_service_hostname" {
  description = "Hostname of the App Service"
  value       = azurerm_linux_web_app.candlewise_backend.default_hostname
}

output "app_service_url" {
  description = "Full URL of the App Service"
  value       = "https://${azurerm_linux_web_app.candlewise_backend.default_hostname}"
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.candlewise.instrumentation_key
  sensitive   = true
}

output "application_insights_connection_string" {
  description = "Application Insights connection string"
  value       = azurerm_application_insights.candlewise.connection_string
  sensitive   = true
}
