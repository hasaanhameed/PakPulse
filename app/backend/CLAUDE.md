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
| .NET version | **TBD — to confirm with Shahab** |
| ORM | Entity Framework Core |
| Database | PostgreSQL + pgvector ([D-011](../../docs/DECISIONS.md#d-011-single-postgresql-database-with-pgvector)) |
| Scheduling | Hangfire (prototype: manual "Collect now" trigger) |
| Local run | Docker Compose ([D-017](../../docs/DECISIONS.md#d-017-run-locally-with-docker-compose)) |
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
- **Secrets:** use environment variables or .NET user-secrets only. Never put them in code or committed config.
- **Test on ~100 posts** before any full collection run.
- **Aggregate analysis only.** No features that track or profile individuals ([Architecture → Ethical boundary](../../docs/ARCHITECTURE.md#ethical-boundary)).
- Any new architectural decision gets an entry in [Decisions](../../docs/DECISIONS.md). Any status change gets an update in [Progress](../../docs/PROGRESS.md).

## Prototype priorities

These follow the milestones in [Progress](../../docs/PROGRESS.md#prototype-milestones):

1. Repo scaffolding + Docker Compose (Postgres, backend, NLP service, frontend).
2. Collectors: X first, then Instagram, then Threads, each tested on 100 posts.
3. Cleaning + language tagging.
4. Hand-off to labelling, embeddings and narratives, then the endpoints the dashboard needs.

## API endpoints

**TBD.** Do not invent endpoints. Agree them with Shahab, then list them here.

## Database schema

**TBD.** Conceptual layers are in [Architecture → Data storage](../../docs/ARCHITECTURE.md#data-storage).
