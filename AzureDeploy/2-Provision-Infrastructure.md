# 2 — Provision Infrastructure (Bicep)

[← 1 Prerequisites](1-Prerequisites.md) · [Index](README.md) · Next: [3 — SQL Database](3-SQL-Database.md)

## Goal
Create the resource group and register providers, then let [`infra/main.bicep`](../infra/main.bicep)
create everything else. The GitHub Actions workflow runs the Bicep for you on push to `main`; the
steps below are the one-time foundation (and how to run Bicep by hand if you want to provision first).

## One-time foundation (CLI)
```bash
az account set --subscription <SUBSCRIPTION_ID>
az group create -n smooches-rg -l <REGION>          # e.g. eastus2

# Register only the providers we use (no Microsoft.Storage — we have no uploads):
az provider register --namespace Microsoft.Web      # App Service + Static Web Apps
az provider register --namespace Microsoft.Sql      # Azure SQL
az provider show -n Microsoft.Web --query registrationState -o tsv   # -> Registered
az provider show -n Microsoft.Sql --query registrationState -o tsv
```
Registration is async ("Registering" → "Registered", ~1–2 min) and is per-subscription, once.

## What the Bicep creates
[`infra/main.bicep`](../infra/main.bicep) declares:
- **App Service plan** (Linux, `B1` by default) + **Web App** for the .NET API
  (`DOTNETCORE|10.0`), with app settings: `ConnectionStrings__Smooches`, `FrontendOrigin`
  (the SPA URL, for CORS), and `Entra__Authority`/`Entra__Audience` (blank until auth is wired).
- **Azure SQL server + database** `Smooches` (serverless, auto-pause) + a firewall rule allowing
  Azure services.
- **Static Web App** (Free) for the SPA.

Outputs: `apiUrl`, `apiName`, `sqlServerFqdn`, `staticWebAppName`, `staticWebAppUrl`.

## Run it by hand (optional — the workflow also does this)
```bash
az deployment group create \
  -g smooches-rg \
  -f infra/main.bicep \
  -p namePrefix=smooches sqlAdminLogin=<LOGIN> sqlAdminPassword=<PASSWORD>

# preview instead of apply:
az deployment group what-if -g smooches-rg -f infra/main.bicep -p namePrefix=smooches sqlAdminLogin=x sqlAdminPassword=y
```

## Verify
- `az bicep build --file infra/main.bicep` is clean.
- After deploy, the Web App's **Configuration** blade shows the expected app settings, and the
  deployment **Outputs** show the API + SPA URLs.

## Gotchas
- **`MissingSubscriptionRegistration`** in the deploy log → a provider isn't registered. Register it
  and re-run. (We only need `Microsoft.Web` and `Microsoft.Sql`.)
- App settings set by the deploy task **merge** with Bicep-set settings — confirm both land in the
  Web App config.
- Registering providers needs Contributor (or higher) on the subscription.
