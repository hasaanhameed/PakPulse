# PakPulse — Backend Guide (for Claude Code)

> **Purpose:** Rules and context for any work on the ASP.NET Core backend (API + collector jobs).

**Related docs:** [Root guide](../../CLAUDE.md) · [Architecture](../../docs/ARCHITECTURE.md) · [Decisions](../../docs/DECISIONS.md) · [Flow](../../docs/FLOW.md) · [Progress](../../docs/PROGRESS.md) · [Frontend design](../frontend/DESIGN.md)

---

## Before you code

- [ ] Read the [Root guide](../../CLAUDE.md), [Architecture](../../docs/ARCHITECTURE.md), [Decisions](../../docs/DECISIONS.md) and [Flow](../../docs/FLOW.md).
- [ ] Check [Progress](../../docs/PROGRESS.md) for the current milestone and open questions.
- [ ] **If anything is unclear, ask Shahab.** Do not guess on scope, cost, data sources or architecture.

## Scope

The backend is the **single front door** for the dashboard. It contains:

- **Backend API:** topic management, triggering collection and analysis runs, and serving results to the dashboard.
- **Collector jobs:** call the scraping services and the Threads API, store the raw data, and normalise it into the common post format.

NLP work (labelling, embeddings, narratives, brief) is planned for a separate Python NLP service that the backend calls over HTTP. This is **proposed, not confirmed** ([D-010](../../docs/DECISIONS.md#d-010-add-a-python-nlp-service)). See [Architecture → Components](../../docs/ARCHITECTURE.md#components).

## Stack

| Item | Choice |
|---|---|
| Framework | ASP.NET Core ([D-008](../../docs/DECISIONS.md#d-008-backend-framework-is-aspnet-core)) |
| .NET version | .NET 10 ([Phase 1 plan](../../docs/PHASE1_DATABASE_PLAN.md)) |
| ORM | Entity Framework Core with the Npgsql provider. Models map onto the existing tables; EF Core migrations are **not** used ([D-021](../../docs/DECISIONS.md#d-021-database-first-sql-scripts-are-the-master-copy)) |
| Database | PostgreSQL + pgvector on Supabase, schema `pakpulse` ([D-011](../../docs/DECISIONS.md#d-011-single-postgresql-database-with-pgvector), [D-020](../../docs/DECISIONS.md#d-020-host-the-prototype-database-on-supabase)) |
| Scheduling | Hangfire (prototype: manual "Collect now" trigger) |
| Local run | Runs on the developer's laptop ([D-017](../../docs/DECISIONS.md#d-017-run-locally-with-docker-compose)); connects to Supabase |
| Auth | **TBD — to confirm with Shahab** |

## Responsibilities

1. **Topic management:** keywords (English / Urdu / Roman Urdu), categories and key accounts.
2. **Collection triggering:** manual for the prototype, Hangfire later ([Flow → Prototype vs future mode](../../docs/FLOW.md#prototype-vs-future-mode)).
3. **Normalisation:** map every platform into one common post format. The format's fields are **TBD**.
4. **Calling the NLP service** for new, unanalysed posts.
5. **Serving dashboard data:** trends, mood and stance breakdowns, narratives, sample posts, briefs and the review queue.

## Conventions (must follow)

- **One `ISourceCollector` implementation per source** (X, Instagram, Threads), so swapping a provider is a single-class change ([D-015](../../docs/DECISIONS.md#d-015-common-interface-for-every-data-source)).
- **Never scrape platforms directly** or bypass platform blocking ([D-001](../../docs/DECISIONS.md#d-001-do-not-build-our-own-scrapers)).
- **Deduplicate by platform + post ID.** Never analyse a post twice ([D-016](../../docs/DECISIONS.md#d-016-never-analyse-the-same-post-twice)).
- **Store raw responses as JSONB, untouched.** Cleaning writes to separate records.
- **Spending caps:** respect the cap on every paid service. Never add a paid service or raise spending without Shahab's approval.
- **Secrets:** use .NET user secrets (or environment variables) only. Never put them in code or committed config. See [Secrets and connection](#secrets-and-connection).
- **Test on ~100 posts** before any full collection run.
- **Aggregate analysis only.** No features that track or profile individuals ([Architecture → Ethical boundary](../../docs/ARCHITECTURE.md#ethical-boundary)).
- Any new architectural decision gets an entry in [Decisions](../../docs/DECISIONS.md). Any status change gets an update in [Progress](../../docs/PROGRESS.md).

## Prototype priorities

These follow the milestones in [Progress](../../docs/PROGRESS.md#prototype-milestones):

1. Backend project setup, with models matching the [existing tables](../../docs/DATABASE.md) and a connection test against Supabase.
2. Collectors: X first, then Instagram, then Threads, each tested on 100 posts.
3. Cleaning + language tagging.
4. Hand-off to labelling, embeddings and narratives, then the endpoints the dashboard needs.

## API endpoints

**TBD.** Do not invent endpoints. Agree them with Shahab, then list them here.

## Database schema

The tables already exist in Supabase. What each one holds, the allowed values and how to change them: [Database](../../docs/DATABASE.md).

- **The SQL scripts in [app/database/migrations/](../database/migrations/) are the master copy** ([D-021](../../docs/DECISIONS.md#d-021-database-first-sql-scripts-are-the-master-copy)). Write C# models to match the tables. Do not create or alter tables from EF Core.
- A schema change is a new numbered SQL script, then a matching model change, in the same commit.
- Map to the `pakpulse` schema with snake_case names. Allowed values (stance, language, emotion…) are stored as lowercase text, e.g. `roman_ur`, `off_topic`.

## Secrets and connection

- Connect through Supabase's **session pooler**. The host, port and user are in [Database → Connecting](../../docs/DATABASE.md#connecting).
- The **password** lives only in .NET **user secrets** on each developer's laptop, never in `appsettings.json`, a committed `.env` file, code or chat:
  ```
  dotnet user-secrets set "ConnectionStrings:PakPulse" "Host=aws-0-ap-south-1.pooler.supabase.com;Port=5432;Database=postgres;Username=postgres.mwbhrzvhloqlrcrcrlwh;Password=<password>;SSL Mode=Require;Search Path=pakpulse,extensions,public"
  ```
  Run it from the API project's folder once that project exists. User secrets are stored outside the repo, in your user profile, so they can never be committed by accident.
- Committed config (`appsettings.json`) may hold the connection string **without** the password, or nothing at all.
