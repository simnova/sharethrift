using './main.bicep'

param appServicePlanName = 'asp-pri-001'
param location = 'eastus2'
param tags = {
  environment: 'dev'
  application: 'sharethrift'
}
param storageAccountName = 'cxadevstfunceastus2'
param maxOldSpaceSizeMB = 3072
param functionWorkerRuntime = 'node'
param linuxFxVersion = 'NODE|22' 
param functionExtensionVersion = '~4' 
param allowedOrigins = [
  'https://sharethrift.com'
] //Specify the frontend endpoints that can access the function app
param keyVaultName = 'sharethrift-keyvault'
param functionAppInstanceName = 'pri'
param applicationPrefix = 'sth'
param env = 'dev'
