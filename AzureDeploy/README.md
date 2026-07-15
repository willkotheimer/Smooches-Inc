# Smooches — Azure Deployment Plan

Our concrete plan for publishing **this** app to Azure. (Rewritten from a copied
generic playbook to match what we actually build and deploy.)

## What we deploy

| Piece | Source | Hosted on |
|---|---|---|
| **API** | `SmoochesApp` (.NET 10) | **Azure App Service** (Linux) |
| **SPA** | `Smooches.UI` (React + Vite) | **Azure Static Web Apps** |
| **Database** | schema in `Smooches.UI/sql/01-create-database.sql` | **Azure SQL Database** |
| **IaC** | [`infra/main.bicep`](../infra/main.bicep) | — |
| **CI/CD** | [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | **GitHub Actions** |
| **Auth** | Firebase today → Entra External ID + Google *(deferred)* | Microsoft Entra External ID |

**Not used here:** Azure Storage/Blob (no file uploads), Azure DevOps (we use GitHub
Actions), Key Vault (secrets are GitHub secrets for now — Key Vault is a later hardening step).

## Task order

1. [Prerequisites](1-Prerequisites.md)
2. [Provision infrastructure (Bicep)](2-Provision-Infrastructure.md)
3. [SQL database (apply the schema)](3-SQL-Database.md)
4. [GitHub Actions CI/CD](4-GitHub-Actions-CICD.md)
5. [Deploy & verify](5-Deploy-and-Verify.md)
6. [Auth: Entra External ID + Google](6-Auth-Entra-Google.md) — **deferred; not required to publish**
7. [Post-deploy data tasks](7-Post-Deploy-Data.md)

## Resource checklist (what you create where)

You asked "which resources, and where." Here's the full list. **You already run another
Azure app that uses Entra + Google — reuse that tenant** to skip most of step 6.

### In the Azure Portal / CLI (one-time)
- [ ] **Resource group** (e.g. `smooches-rg`) in your subscription.
- [ ] **Resource providers** registered: `Microsoft.Web`, `Microsoft.Sql`. *(No `Microsoft.Storage` — we don't use it.)*
- [ ] **App registration for the deploy identity** (service principal) with a **federated credential**
      for GitHub OIDC, and **Contributor** on the resource group. This is what the workflow logs in as.
- [ ] Everything else — **App Service plan + Web App, Azure SQL server + database, Static Web App** —
      is created by **Bicep**, not by hand.
- [ ] *(Deferred, auth)* Reuse your existing **Entra External ID tenant** + **Google federation**; add one
      new **SPA app registration** for Smooches. See [6](6-Auth-Entra-Google.md).

### In GitHub (repo → Settings → Secrets and variables → Actions)
**Secrets**
- [ ] `AZURE_CLIENT_ID` — the deploy app registration's client id
- [ ] `AZURE_TENANT_ID` — your Azure (workforce) tenant id
- [ ] `AZURE_SUBSCRIPTION_ID`
- [ ] `SQL_ADMIN_LOGIN`
- [ ] `SQL_ADMIN_PASSWORD`

**Variables**
- [ ] `AZURE_RESOURCE_GROUP` — e.g. `smooches-rg`

The Static Web Apps deploy token and the API URL are **fetched/computed inside the workflow**, so
they are *not* stored as secrets. SPA build values (`VITE_API_BASE_URL`, later the auth `VITE_*`) are
injected at build time from Bicep outputs / repo variables — never secrets.

## Publish-today path (happy path)

1. Create the resource group + register providers ([2](2-Provision-Infrastructure.md)).
2. Create the deploy service principal + GitHub OIDC federated credential; set the GitHub secrets/vars above ([4](4-GitHub-Actions-CICD.md)).
3. Push to `main` → the workflow runs Bicep (provisions everything), deploys the API and SPA.
4. Apply the SQL schema to the new Azure SQL database ([3](3-SQL-Database.md)) — **required before the API returns data**.
5. Verify ([5](5-Deploy-and-Verify.md)). Auth migration to Entra/Google comes later ([6](6-Auth-Entra-Google.md)).

## Principles (worth keeping)

- **Schema before code.** The Azure SQL database starts empty; apply the schema before (or with) the
  deploy or every read fails with "Invalid object name". See [3](3-SQL-Database.md).
- **Minimize concurrent unknowns.** Get build → deploy → data green first; add Key Vault and the Entra
  auth swap as separate, isolated changes so failures stay attributable.
- **SPA config isn't secret.** `VITE_*` values are compiled into the browser bundle; keep them as plain
  build variables. The only real secrets here are the SQL password and the Azure login.
