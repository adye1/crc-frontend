targetScope = 'resourceGroup'

param location string = resourceGroup().location
param storageName string

resource site 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true
    supportsHttpsTrafficOnly: true
  }
}

output storageName string = site.name
output siteUrl string = site.properties.primaryEndpoints.web
