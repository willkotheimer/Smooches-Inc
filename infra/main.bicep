// =====================================================================
// Smooches — Azure infrastructure (Bicep)
// ---------------------------------------------------------------------
// Provisions exactly what this app needs and nothing else:
//   - App Service (Linux) for the .NET API (SmoochesApp)
//   - Azure SQL server + database (Smooches)
//   - Static Web App for the React/Vite SPA (Smooches.UI)
// No Azure Storage (this app has no file/blob uploads).
//
// Deploy:  az deployment group create -g <RG> -f infra/main.bicep \
//            -p namePrefix=smooches sqlAdminLogin=<u> sqlAdminPassword=<p>
// =====================================================================

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Short, lowercase prefix used to name resources (globally-unique bits get a hash suffix).')
@minLength(3)
@maxLength(11)
param namePrefix string = 'smooches'

@description('Azure SQL administrator login.')
param sqlAdminLogin string

@description('Azure SQL administrator password.')
@secure()
param sqlAdminPassword string

@description('SQL database name (matches the app connection string).')
param sqlDatabaseName string = 'Smooches'

@description('App Service plan SKU. B1 is the cheapest always-on tier; F1 (Free) also works for a demo.')
param appServiceSku string = 'B1'

// --- Optional Entra External ID auth settings (leave blank until auth is wired) ---
@description('Entra authority, e.g. https://<sub>.ciamlogin.com/<tenantId>/v2.0 (blank = auth not enforced).')
param entraAuthority string = ''

@description('Entra API audience, e.g. api://<spaClientId> (blank = auth not enforced).')
param entraAudience string = ''

var suffix = uniqueString(resourceGroup().id)
var apiName = '${namePrefix}-api-${suffix}'
var planName = '${namePrefix}-plan'
var sqlServerName = '${namePrefix}-sql-${suffix}'
var swaName = '${namePrefix}-web'

// ------------------------------- SQL -------------------------------
resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: 'GP_S_Gen5_1' // General Purpose serverless, 1 vCore — scales to zero when idle
    tier: 'GeneralPurpose'
  }
  properties: {
    autoPauseDelay: 60
    minCapacity: json('0.5')
  }
}

// Let other Azure services (the Web App) reach the SQL server.
resource sqlAllowAzure 'Microsoft.Sql/servers/firewallRules@2023-08-01-preview' = {
  parent: sqlServer
  name: 'AllowAllAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// --------------------------- App Service ---------------------------
resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: {
    name: appServiceSku
  }
  kind: 'linux'
  properties: {
    reserved: true // required for Linux
  }
}

var sqlConnectionString = 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Database=${sqlDatabaseName};User ID=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

resource api 'Microsoft.Web/sites@2023-12-01' = {
  name: apiName
  location: location
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|10.0'
      alwaysOn: appServiceSku != 'F1'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'ConnectionStrings__Smooches'
          value: sqlConnectionString
        }
        {
          // The .NET API reads this to allow the SPA origin through CORS in prod.
          name: 'FrontendOrigin'
          value: 'https://${swa.properties.defaultHostname}'
        }
        {
          name: 'Entra__Authority'
          value: entraAuthority
        }
        {
          name: 'Entra__Audience'
          value: entraAudience
        }
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
      ]
    }
  }
}

// --------------------------- Static Web App ---------------------------
resource swa 'Microsoft.Web/staticSites@2023-12-01' = {
  name: swaName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

output apiName string = api.name
output apiUrl string = 'https://${api.properties.defaultHostName}'
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseName string = sqlDatabaseName
output staticWebAppName string = swa.name
output staticWebAppUrl string = 'https://${swa.properties.defaultHostname}'
