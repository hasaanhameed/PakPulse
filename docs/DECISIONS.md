# PakPulse — Decision Log

> **Purpose:** Records *why* PakPulse is built the way it is. Each choice is stored as a numbered decision (ADR-style).

**Related docs:** [Architecture](ARCHITECTURE.md) · [Flow](FLOW.md) · [Progress](PROGRESS.md) · [Backend guide](../app/backend/CLAUDE.md) · [Frontend design](../app/frontend/DESIGN.md) · [Root guide](../CLAUDE.md) · [README](../README.md)

---

## How this log works

- Each decision has an ID (`D-001`, `D-002`, …), a date, a status, its context, the decision itself, consequences, and the alternatives considered.
- **Status values:** `Proposed` (not yet confirmed by Shahab), `Accepted`, `Rejected`, `Superseded by D-xxx`.
- **Append only.** New decisions go at the bottom with the next free ID. Existing entries are never silently edited. If a decision changes, add a new entry and mark the old one `Superseded by D-xxx`.
- Prices are in Pakistani Rupees (Rs) at ~Rs 278 per USD. Services bill in USD, so rupee figures move with the exchange rate. Card payments from Pakistan may add bank or tax charges. Full cost model: [Architecture → Cost model](ARCHITECTURE.md#cost-model).

## Summary

| ID | Title | Status |
|---|---|---|
| [D-001](#d-001-do-not-build-our-own-scrapers) | Do not build our own scrapers | Accepted |
| [D-002](#d-002-use-ready-made-scraping-services-for-x-and-instagram) | Use ready-made scraping services for X and Instagram | Accepted |
| [D-003](#d-003-use-the-official-threads-api-for-threads) | Use the official Threads API for Threads | Accepted |
| [D-004](#d-004-do-not-use-the-official-x-api-for-now) | Do not use the official X API for now | Accepted |
| [D-005](#d-005-no-historical-data) | No historical data | Accepted |
| [D-006](#d-006-monitor-key-accounts-and-a-small-keyword-set) | Monitor key accounts and a small keyword set | Accepted |
| [D-007](#d-007-collect-smart) | Collect smart | Accepted |
| [D-008](#d-008-backend-framework-is-aspnet-core) | Backend framework is ASP.NET Core | Accepted |
| [D-009](#d-009-frontend-framework-is-nextjs) | Frontend framework is Next.js | Accepted |
| [D-010](#d-010-add-a-python-nlp-service) | Add a Python NLP service | **Proposed** |
| [D-011](#d-011-single-postgresql-database-with-pgvector) | Single PostgreSQL database with pgvector | Accepted |
| [D-012](#d-012-two-tier-llm-via-api) | Two-tier LLM via API | Accepted |
| [D-013](#d-013-confidence-score-on-every-label) | Confidence score on every label | Accepted |
| [D-014](#d-014-build-a-labelled-domain-dataset) | Build a labelled domain dataset | Accepted |
| [D-015](#d-015-common-interface-for-every-data-source) | Common interface for every data source | Accepted |
| [D-016](#d-016-never-analyse-the-same-post-twice) | Never analyse the same post twice | Accepted |
| [D-017](#d-017-run-locally-with-docker-compose) | Run locally with Docker Compose | Accepted |
| [D-018](#d-018-avoid-vendors-unsuitable-for-the-client) | Avoid vendors unsuitable for the client | Accepted |

---

## Decisions

### D-001 Do not build our own scrapers

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** X, Instagram and Threads actively block scrapers through login walls, account bans, IP blocking and frequent page changes.
- **Decision:** We do not write our own scrapers for X, Instagram or Threads.
- **Consequences:** No ongoing scraper maintenance, and we avoid a direct breach of platform Terms of Service, which would be a reputational risk for a government-linked client. In return we depend on third-party services ([D-002](#d-002-use-ready-made-scraping-services-for-x-and-instagram), [D-003](#d-003-use-the-official-threads-api-for-threads)).
- **Alternatives considered:** In-house scrapers (rejected: fragile, ToS breach, constant upkeep).
- **See also:** [Architecture → Data sources](ARCHITECTURE.md#data-sources)

### D-002 Use ready-made scraping services for X and Instagram

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** We need X and Instagram data cheaply and reliably without running scrapers ourselves ([D-001](#d-001-do-not-build-our-own-scrapers)).
- **Decision:** Use pay-per-result scraping services (e.g. Apify, twitterapi.io) for X and Instagram.
- **Consequences:** The services handle blocking and maintenance, and they are far cheaper than the official X API ([D-004](#d-004-do-not-use-the-official-x-api-for-now)). ToS risk is reduced, because the scraping runs on their infrastructure, but it is **not zero**, so a legal view is still needed. Which provider to use for X is **TBD — to confirm with Shahab**.
- **Alternatives considered:** Official X API (D-004), in-house scrapers (D-001), other aggregators (Bright Data, ScrapingDog, SocialCrawl).
- **See also:** [Architecture → Data sources](ARCHITECTURE.md#data-sources) · [Progress → Open questions](PROGRESS.md#open-questions)

### D-003 Use the official Threads API for Threads

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** Meta offers a free official Threads API, but keyword search is rationed (reported ~500 queries per rolling 7 days).
- **Decision:** Use Meta's official Threads API for Threads data.
- **Consequences:** Free, and the quota is enough for a few core keywords. It may require Meta app review, which can take time. **Fallback:** buy ~300 Threads posts via Apify (~Rs 250–650), or demo with X + Instagram only.
- **Alternatives considered:** Threads via scraping services (~Rs 830–2,220 per 1,000 posts).
- **See also:** [Architecture → Risks and constraints](ARCHITECTURE.md#risks-and-constraints)

### D-004 Do not use the official X API for now

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** The official X API is pay-per-use at ~$0.005 (~Rs 1.4) per post read, about Rs 1,390 per 1,000. Recent search covers only the last 7 days, which is acceptable because we need no history ([D-005](#d-005-no-historical-data)).
- **Decision:** Do not use the official X API at this stage.
- **Consequences:** Over 10× saving compared with scraping services. **Revisit** if a scraping service fails or a legal review requires official access.
- **Alternatives considered:** Official X API (kept as the fallback).

### D-005 No historical data

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** The use case is current trends and live reaction.
- **Decision:** PakPulse does not collect or analyse historical data.
- **Consequences:** Lower cost and complexity. We cannot compare against long-term baselines.
- **Alternatives considered:** Historical backfill (rejected for cost).

### D-006 Monitor key accounts and a small keyword set

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** Searching a whole platform is noisy and expensive.
- **Decision:** Monitor a curated list of key accounts plus a small keyword set (English, Urdu, Roman Urdu). Accounts include official handles, defence journalists, analysts, regional commentators and major news outlets.
- **Consequences:** Less volume, cost and noise. Coverage depends on keeping the account list up to date. The list is used for aggregate analysis only, never to profile individuals (see [Architecture → Ethical boundary](ARCHITECTURE.md#ethical-boundary)).
- **Alternatives considered:** Whole-platform keyword search.

### D-007 Collect smart

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** Data cost scales with the number of posts collected.
- **Decision:** Collect in snapshots for the prototype (hourly later), take the most-engaged posts first, and skip retweets but count them.
- **Consequences:** Cost roughly halves without losing the overall picture.
- **Alternatives considered:** Collect everything continuously.
- **See also:** [Flow → Prototype vs future mode](FLOW.md#prototype-vs-future-mode)

### D-008 Backend framework is ASP.NET Core

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context / Decision:** The team chose ASP.NET Core (with Entity Framework Core) for the backend API and collector jobs. The .NET version is **TBD — to confirm with Shahab**.
- **Consequences:** Some NLP tooling is Python-only (see [D-010](#d-010-add-a-python-nlp-service)).
- **See also:** [Backend guide](../app/backend/CLAUDE.md)

### D-009 Frontend framework is Next.js

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context / Decision:** The team chose Next.js for the dashboard. The router, Node version and styling are **TBD — to confirm with Shahab**.
- **See also:** [Frontend design](../app/frontend/DESIGN.md)

### D-010 Add a Python NLP service

- **Date:** 2026-10-14 · **Status:** **Proposed** — awaiting Shahab's confirmation
- **Context:** Key NLP tooling, such as BERTopic topic clustering and multilingual/Roman Urdu models like fine-tuned XLM-R, exists mainly in Python.
- **Decision (proposed):** Add a small Python service (FastAPI) alongside the .NET backend. The backend calls it over HTTP.
- **Consequences:** Stronger narrative grouping and access to multilingual models, at the cost of a second language and one more service to run. **Where it lives in the repo is TBD.** No folder exists for it yet, and none will be created without approval.
- **Alternatives considered:** **.NET-only**: LLM labels + an embeddings API + simple clustering. Quicker to build, but topic grouping is weaker.
- **See also:** [Architecture → Components](ARCHITECTURE.md#components) · [Progress → Open questions](PROGRESS.md#open-questions)

### D-011 Single PostgreSQL database with pgvector

- **Date:** 2026-10-14 · **Status:** Accepted
- **Decision:** Use one PostgreSQL database with the pgvector extension for topics, raw posts (JSONB), cleaned posts, labels, embeddings, narratives and briefs.
- **Consequences:** No separate vector database, and only one store to back up and run.
- **Alternatives considered:** A dedicated vector database alongside Postgres.
- **See also:** [Architecture → Data storage](ARCHITECTURE.md#data-storage)

### D-012 Two-tier LLM via API

- **Date:** 2026-10-14 · **Status:** Accepted
- **Decision:** Call an LLM through an API at two tiers: a small, cheap model for per-post labelling and a stronger model only for the daily brief. Output must be strict JSON. Labelling sends ~20 posts per request.
- **Consequences:** Controls cost and makes parsing reliable. The provider and models are **TBD — to confirm with Shahab**.
- **Alternatives considered:** A single strong model for everything (too costly), or self-hosted models (more setup on a laptop).
- **See also:** [Architecture → NLP and AI layer](ARCHITECTURE.md#nlp-and-ai-layer)

### D-013 Confidence score on every label

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** Prompted LLMs underperform fine-tuned models on sarcasm benchmarks (SarcasmBench).
- **Decision:** Every label stores a confidence score. Low-confidence posts go to a human review queue.
- **Consequences:** Human corrections become our labelled test set ([D-014](#d-014-build-a-labelled-domain-dataset)), and the dashboard must show confidence.
- **See also:** [Flow → Human review loop](FLOW.md#human-review-loop) · [Frontend design](../app/frontend/DESIGN.md)

### D-014 Build a labelled domain dataset

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** Public Roman Urdu datasets are thin and mostly based on product reviews, not geopolitical text.
- **Decision:** Build a labelled dataset of a few hundred to ~2,000 posts in English, Urdu and Roman Urdu.
- **Consequences:** Lets us measure and prove accuracy, especially for Roman Urdu and sarcasm. It takes analyst time.
- **See also:** [Progress → Next steps after the prototype](PROGRESS.md#next-steps-after-the-prototype)

### D-015 Common interface for every data source

- **Date:** 2026-10-14 · **Status:** Accepted
- **Decision:** Each data source sits behind a common interface, `ISourceCollector`.
- **Consequences:** Switching to a different provider later is a one-class change.
- **See also:** [Backend guide](../app/backend/CLAUDE.md)

### D-016 Never analyse the same post twice

- **Date:** 2026-10-14 · **Status:** Accepted
- **Decision:** Deduplicate and cache by platform + post ID, so a post is never analysed twice.
- **Consequences:** Protects the budget, and re-runs are cheap.

### D-017 Run locally with Docker Compose

- **Date:** 2026-10-14 · **Status:** Accepted
- **Decision:** For the prototype, all services run on a laptop under Docker Compose.
- **Consequences:** Zero hosting cost and one command to start everything. Hosting and data residency must be revisited after the prototype.

### D-018 Avoid vendors unsuitable for the client

- **Date:** 2026-10-14 · **Status:** Accepted
- **Context:** Some narrative-intelligence vendors, such as Israeli-headquartered Cyabra, are unlikely to be procurable for the client.
- **Decision:** Do not depend on vendors that are unsuitable for the client.
- **Consequences:** This is one of the reasons a custom build makes sense.

---

## Alternatives researched

Recorded as background only. None of these is a decision.

| Category | Examples | Notes |
|---|---|---|
| Enterprise social listening | Brandwatch, Meltwater, Talkwalker (now "Lumen by Talkwalker"), Pulsar | Sales-quoted annual contracts. Weak on Roman Urdu. Data-sovereignty concerns. |
| Narrative intelligence | Cyabra, Graphika | See [D-018](#d-018-avoid-vendors-unsuitable-for-the-client). |
| Data aggregators | Apify, twitterapi.io, Bright Data, ScrapingDog, SocialCrawl | Apify / twitterapi.io chosen as candidates ([D-002](#d-002-use-ready-made-scraping-services-for-x-and-instagram)). |
| Meta Content Library | — | Researcher-only, controlled access. Not suitable for commercial PR use. |
