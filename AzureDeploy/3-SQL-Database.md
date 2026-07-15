# 3 — SQL Database (apply the schema)

[← 2 Provision](2-Provision-Infrastructure.md) · [Index](README.md) · Next: [4 — GitHub Actions](4-GitHub-Actions-CICD.md)

## Goal
The Bicep creates an **empty** Azure SQL database named `Smooches`. This app has **no EF migrations** —
the schema lives in [`Smooches.UI/sql/01-create-database.sql`](../Smooches.UI/sql/01-create-database.sql).
You must apply it to the Azure database before the API can read/write.

> **Schema before code.** If the API deploys before the tables exist, every request fails with
> "Invalid object name 'dbo.Services'". Apply the schema **before or right after** the first deploy.

## Adapt the script for Azure SQL
The local script begins with `IF DB_ID('Smooches') IS NULL CREATE DATABASE ...` and `USE Smooches;`.
**Azure SQL doesn't support `CREATE DATABASE`/`USE` that way** (Bicep already created the database, and
each connection targets one database). When applying to Azure SQL, **skip those two leading statements**
and run the rest (the `CREATE TABLE` / index / FK batches) while connected to the `Smooches` database.

## How to apply
Pick one:

- **Portal query editor**: SQL database `Smooches` → **Query editor** → sign in → paste the table-creation
  part of the script → Run. (Add your client IP under the server's networking first if prompted.)
- **sqlcmd / Azure Data Studio / SSMS** against the server (add your IP to the SQL server firewall):
  ```bash
  sqlcmd -S <namePrefix>-sql-<hash>.database.windows.net -d Smooches -U <SQL_ADMIN_LOGIN> -P <SQL_ADMIN_PASSWORD> -G -i schema-azure.sql
  ```

## Connection string
The API reads `ConnectionStrings:Smooches`. Bicep already sets it on the Web App as the app setting
`ConnectionStrings__Smooches` (built from the SQL server FQDN + admin creds). Nothing to commit — it
never lands in source.

## Data
The Azure database starts empty. The app's UI can create records once auth/users exist; for a quick demo
you can insert a couple of rows by hand. (The local dev seeder loads `seed-data.demo.json`, but that
demo data is not published to prod by default.)

## Verify
- The `Smooches` database shows the tables (`Users`, `Services`, `Todos`, `Reviews`, `UserJoins`).
- `GET https://<apiUrl>/api/health` returns ok; `GET /api/services` returns `[]` (empty, not a 500).
