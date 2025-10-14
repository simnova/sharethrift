using './main.bicep'

param env = 'dev'
param applicationPrefix = 'sth'
param tags = {
  environment: 'dev'
  application: 'sth'
}

//app service plan
param appServicePlanInstanceName = 'pri-001'
param appServicePlanLocation = 'eastus2'
param appServicePlanSku = 'B1'
param appServicePlanOperatingSystem = 'linux'

//function app
param functionAppStorageAccountName = 'cxadevfunceastus2'
param functionAppLocation = 'eastus2'
param functionAppInstanceName = 'pri'
param functionWorkerRuntime = 'node'
param functionExtensionVersion = '~4'
param maxOldSpaceSizeMB = 3072
param linuxFxVersion = 'NODE|22'
param allowedOrigins = [
  'https://sth-fde-bzbjd6edbfhmcnam.z02.azurefd.net'
]
param keyVaultName = 'sharethrift-keyvault'

//storage account
param storageAccountName = 'app'
param storageAccountLocation = 'eastus2'
param storageAccountSku = 'Standard_RAGZRS'
param storageAccountManagementPolicy = {
  enable: false
  deleteAfterNDaysList: []
}
param enableBlobService = true
param containers = [
  {
    name: 'public'
    publicAccess: 'blob'
  }
  {
    name: 'private'
    publicAccess: 'None'
  }
]
param enableQueueService = true
param queues = []
param cors = {
  allowedOrigins: [
    'https://sth-fde-bzbjd6edbfhmcnam.z02.azurefd.net'
  ]
  allowedMethods: [
    'GET'
    'POST'
    'PUT'
    'OPTIONS'
  ]
  allowedHeaders: [
    '*'
  ]
  exposedHeaders: [
    'x-ms-version-id'
  ]
  maxAgeInSeconds: 0
}
param enableTableService = false
param isVersioningEnabled = true
param tables = []


//cosmos
param cosmosMongoDBInstanceName = 'dat'
param cosmosLocation = 'eastus2'
param totalThroughputLimit = 3200
param backupIntervalInMinutes = 240
param backupRetentionIntervalInHours = 96
param maxThroughput = 1000
param runRbacRoleAssignment = false
param enableAnalyticalStorage = true
param rbacMembers = []
