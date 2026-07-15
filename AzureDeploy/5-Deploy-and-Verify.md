# 5 — Deploy & Verify

[← 4 GitHub Actions](4-GitHub-Actions-CICD.md) · [Index](README.md) · Next: [6 — Auth](6-Auth-Entra-Google.md)

## Deploy
1. Confirm the foundation exists ([2](2-Provision-Infrastructure.md)) and the GitHub secrets/vars are set ([4](4-GitHub-Actions-CICD.md)).
2. Push/merge to `main`. The workflow: `provision` (Bicep) → `deploy-api` → `deploy-web`.
3. Apply the SQL schema to the new Azure database ([3](3-SQL-Database.md)) — do this once the database exists.

## Verify in prod
1. `GET https://<apiUrl>/api/health` → `{ "status": "ok" }`.
2. `GET https://<apiUrl>/api/services` → `[]` (or data) — a **500** means the schema isn't applied yet ([3](3-SQL-Database.md)).
3. Open the Static Web App URL; the SPA loads.
4. Browser dev tools → the SPA's API calls go to `https://<apiUrl>/api` (not localhost) and aren't blocked by CORS.

## Common first-deploy failures
| Symptom | Cause | Fix |
|---|---|---|
| `MissingSubscriptionRegistration` | provider not registered | `az provider register --namespace Microsoft.Web` / `Microsoft.Sql` ([2](2-Provision-Infrastructure.md)), re-run |
| API `/api/services` → 500, "Invalid object name" | schema not applied to Azure SQL | apply the schema ([3](3-SQL-Database.md)) |
| SPA calls `localhost` in prod | `VITE_API_BASE_URL` not injected at build | it's wired from the Bicep output in `deploy-web`; confirm the provision output ran |
| Browser CORS error | API doesn't allow the SPA origin | Bicep sets `FrontendOrigin`; the API adds it to CORS. Confirm the app setting = the SPA URL |
| `az login` fails in the workflow | OIDC federated credential subject mismatch | subject must be `repo:willkotheimer/Smooches-Inc:ref:refs/heads/main` ([4](4-GitHub-Actions-CICD.md)) |
| Web App returns 503/agent errors on first hit | serverless SQL resuming / cold start | retry after a few seconds |

## Notes
- Re-running just the **failed job** is faster than the whole workflow.
- Auth still runs on **Firebase** at this point — if sign-in fails on the prod domain, authorize the
  Static Web App domain in Firebase (Authentication → Settings → Authorized domains). The Entra/Google
  swap is [6](6-Auth-Entra-Google.md).
