# 6 — Auth: Entra External ID + Google (deferred)

[← 5 Deploy & Verify](5-Deploy-and-Verify.md) · [Index](README.md) · Next: [7 — Post-Deploy Data](7-Post-Deploy-Data.md)

> **Not required to publish.** The app ships on its current Firebase auth. This is the planned swap to
> Azure-native identity so we can drop Firebase. Do it as a separate, isolated change after the core
> deploy is green.

## Why Entra External ID + Google
- We're consolidating on Azure; **Entra External ID** (CIAM) is Azure's consumer identity product.
- It issues standard **OIDC/JWT** tokens the .NET API validates cleanly.
- **Google federation** keeps the "sign in with Google" experience users already have.

## Reuse your existing tenant (big time-saver)
You already run another Azure app on **Entra External ID with Google federation**. Reuse that tenant:
- Google OAuth client + Entra Google identity provider + user flow **already exist** — you skip most of
  the setup.
- Just add **one new SPA app registration** for Smooches inside that tenant, and attach it to the
  existing user flow.

If you'd rather isolate Smooches in its own tenant, create a new **External ID** tenant
(`entra.microsoft.com` → Manage tenants → Create → External); provisioning can take ~30 min, and you'd
redo the Google client + federation + user flow there.

## App registration (inside the External ID tenant)
1. **App registrations → New registration** → name `Smooches Web`, single tenant (this external tenant).
2. **Redirect URI**: platform **SPA**, add `http://localhost:3000` (dev) and `https://<staticWebAppUrl>` (prod).
3. Copy **Application (client) ID** = `<SPA_CLIENT_ID>`.
4. **Expose an API** → Add Application ID URI (`api://<SPA_CLIENT_ID>`) → **+ Add a scope** `access_as_user`.
5. Attach the app to the existing **user flow** (External Identities → User flows → your flow →
   Applications → Add) so the Google button appears.

## Frontend (MSAL, in `Smooches.UI`)
Build-time `VITE_*` values (plain, not secrets — they ship in the bundle):

| Variable | Value |
|---|---|
| `VITE_ENTRA_CLIENT_ID` | `<SPA_CLIENT_ID>` |
| `VITE_ENTRA_TENANT_ID` | external tenant id |
| `VITE_ENTRA_AUTHORITY` | `https://<TENANT_SUBDOMAIN>.ciamlogin.com/<TENANT_ID>` |
| `VITE_ENTRA_API_SCOPE` | `api://<SPA_CLIENT_ID>/access_as_user` |

Wire these into the `deploy-web` build step's `env:` (like `VITE_API_BASE_URL` already is). Use MSAL
`PublicClientApplication`, `knownAuthorities: ['<TENANT_SUBDOMAIN>.ciamlogin.com']`, redirect flow,
and include the **API scope** in the login request (or writes 401). Replace the Firebase auth calls in
`src/helpers/data/` and the auth context.

## Backend (JWT, in `SmoochesApp`)
App settings (Bicep already declares `Entra__Authority` / `Entra__Audience` — fill them in):

| Setting | Value |
|---|---|
| `Entra__Authority` | `https://<TENANT_SUBDOMAIN>.ciamlogin.com/<TENANT_ID>/v2.0` |
| `Entra__Audience` | `api://<SPA_CLIENT_ID>` |

Add `AddAuthentication().AddJwtBearer(...)` with `Authority` = the setting; validate issuer/lifetime and
**accept both** `api://<clientId>` and the bare client-id GUID as audience. Put `UseAuthentication()`
before `UseAuthorization()`. Suggested policy: require auth on writes (POST/PUT/PATCH/DELETE), leave
GETs anonymous so public browsing still works. Keep the CORS origin list in sync with the SPA redirect
URIs (the API already reads `FrontendOrigin`).

## Gotchas
- `endpoints_resolution_error` → use the **tenant-scoped** authority `.../ciamlogin.com/<TENANT_ID>`.
- Signed in but writes 401 → login didn't request the API scope, or audience mismatch (accept both forms).
- The **Google client secret** lives only in the Entra Google config — never in the repo/pipeline.
- First-login identity mapping (Firebase uid → Entra object id) is data work → [7](7-Post-Deploy-Data.md).
