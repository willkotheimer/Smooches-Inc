# 1 — Prerequisites

[Index](README.md) · Next: [2 — Provision Infrastructure](2-Provision-Infrastructure.md)

## Accounts
- **Azure subscription** with rights to create resources and register providers.
- **GitHub** (the repo already lives here: `willkotheimer/Smooches-Inc`). No Azure DevOps needed.
- *(Deferred, auth)* A **Google Cloud** account and access to your existing **Entra External ID** tenant.

## Local tools
- **Azure CLI** (`az`) — `az login`, then `az account show`.
- **Bicep** — `az bicep install` (or bundled with recent `az`).
- **.NET SDK 10** and **Node 22** (to build/test locally; the workflow uses the same versions).
- **SQL client** — SSMS, Azure Data Studio, or the VS Code `mssql` extension (to apply the schema to Azure SQL).

## Verify
```bash
az account show          # correct subscription?
az bicep version
dotnet --version         # 10.x
node --version           # 22.x
```

## Notes
- Keep the CLI on the subscription you intend to deploy to: `az account set --subscription <SUBSCRIPTION_ID>`.
- Windows: if `npm.ps1` is blocked ("running scripts is disabled"), use Git Bash or
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
