using './main.bicep'

param appServicePlanName = 'pri-001'
param location = 'eastus2'
param tags = {
  environment: 'dev'
  application: 'cel'
}
param sku = 'EP1'
param operatingSystem = 'linux' // Options: linux, windows

