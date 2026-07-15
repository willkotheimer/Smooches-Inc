# 4 — GitHub Actions CI/CD

[← 3 SQL](3-SQL-Database.md) · [Index](README.md) · Next: [5 — Deploy & Verify](5-Deploy-and-Verify.md)

## Goal
CI on every PR to `main`; provision + deploy on push to `main`. The workflow is
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

## How the workflow is structured
- **`ci`** (pull requests): `dotnet test` + SPA `tsc`/`build`. No deploy.
- **`provision`** (push to main): `azure/login` (OIDC) → `az deployment group create` with the Bicep;
  exposes `apiUrl`, `apiName`, `swaName` as job outputs.
- **`deploy-api`**: `dotnet publish` → `azure/webapps-deploy` to the App Service.
- **`deploy-web`**: `npm ci && npm run build` with **`VITE_API_BASE_URL` = `<apiUrl>/api`** (from the
  provision output, so the bundle points at the real API), then upload the prebuilt `dist` to Static
  Web Apps. The SWA deploy token is fetched at runtime with `az staticwebapp secrets list` — not stored.

## Log in to Azure with OIDC (no stored secret)
Create a service principal the workflow logs in as, and a **federated credential** so GitHub gets a
short-lived token (no client secret to rotate):

```bash
# 1) App registration for the deploy identity
az ad app create --display-name "smooches-github-deploy"
appId=$(az ad app list --display-name "smooches-github-deploy" --query "[0].appId" -o tsv)
az ad sp create --id "$appId"

# 2) Give it rights on the resource group
subId=$(az account show --query id -o tsv)
az role assignment create --assignee "$appId" --role Contributor \
  --scope "/subscriptions/$subId/resourceGroups/smooches-rg"

# 3) Federated credential: trust pushes to main of this repo
az ad app federated-credential create --id "$appId" --parameters '{
  "name": "github-main",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:willkotheimer/Smooches-Inc:ref:refs/heads/main",
  "audiences": ["api://AzureADTokenExchange"]
}'
```
> If a job ever runs from a PR or environment context, add matching federated-credential subjects
> (e.g. `repo:.../Smooches-Inc:pull_request`). Our deploy jobs only run on push to `main`.

## GitHub secrets & variables
Repo → **Settings → Secrets and variables → Actions**.

**Secrets**
| Name | Value |
|---|---|
| `AZURE_CLIENT_ID` | `$appId` from above |
| `AZURE_TENANT_ID` | your Azure (workforce) tenant id (`az account show --query tenantId`) |
| `AZURE_SUBSCRIPTION_ID` | `az account show --query id` |
| `SQL_ADMIN_LOGIN` | Azure SQL admin login |
| `SQL_ADMIN_PASSWORD` | Azure SQL admin password |

**Variables**
| Name | Value |
|---|---|
| `AZURE_RESOURCE_GROUP` | `smooches-rg` |

That's the whole list — everything else is created by Bicep or derived at runtime.

## Notes / gotchas
- The workflow needs `permissions: id-token: write` for OIDC (already set).
- **Secret vs plain:** the SQL password and Azure login are secrets. `VITE_*` build values are **not**
  secrets — they end up in the browser bundle; keep them as plain variables/outputs.
- A **missing build-time variable** deploys fine but breaks prod at runtime (e.g. the SPA calls the
  wrong API). The workflow wires `VITE_API_BASE_URL` from the Bicep output to avoid this.
- Key Vault is intentionally deferred — secret GitHub secrets are the "get it green first" choice.
