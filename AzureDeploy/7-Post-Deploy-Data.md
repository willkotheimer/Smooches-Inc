# 7 — Post-Deploy Data Tasks

[← 6 Auth](6-Auth-Entra-Google.md) · [Index](README.md)

## Schema changes (no ORM migrations)
This app applies SQL by hand, not via EF migrations. When the schema changes:
- Edit [`Smooches.UI/sql/01-create-database.sql`](../Smooches.UI/sql/01-create-database.sql) and keep it
  **idempotent** (guard with `IF NOT EXISTS`) with sensible defaults so existing rows stay valid.
- **Apply to every environment** (local + Azure) **before** the code that reads the new column deploys.
  Nothing in the pipeline runs these automatically — you apply them ([3](3-SQL-Database.md)).

## Identity relink (when we move off Firebase → Entra)
Existing rows key users by the Firebase `uid`. On first Entra sign-in, link the new identity:
- New stable key = the token's **object id** (`oid` / MSAL `localAccountId`).
- Match the existing `Users` row by **email**, then set its key column to the new id; only create a new
  row if no email match. Make it **idempotent** (skip if already linked). Trigger it once an account is
  present (a `LOGIN_SUCCESS` handler / auth context).

Our data model already made this easier: entity keys are per-entity (`usersKey`, etc.) and `uid` is the
cross-entity join key — the relink updates the user's identity key, not every reference.

## Duplicate-record gotcha
A database copied between environments can carry **duplicate users for the same email** (one with data,
one empty). Prefer the record that actually owns data when linking; if a wrong link happens, fix with SQL
(move the new key onto the data-owning row, neutralize the empty duplicate), then re-check with a
`SELECT ... WHERE Email = '<email>'`.

## Verify
- The signed-in user sees their own data.
- No empty/duplicate row is linked to the live identity.

## Notes
- **Version-control the schema script** (idempotent DDL) — it's reviewable and repeatable.
- **Don't commit real seed/DB dumps** to this repo. The anonymized `seed-data.demo.json` is fine; real
  exports stay gitignored.
