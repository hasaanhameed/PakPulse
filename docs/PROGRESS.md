# PakPulse — Progress

> **Purpose:** Tracks the current status, milestones, budget, open questions and next steps.

**Related docs:** [Architecture](ARCHITECTURE.md) · [Decisions](DECISIONS.md) · [Flow](FLOW.md) · [Backend guide](../app/backend/CLAUDE.md) · [Frontend design](../app/frontend/DESIGN.md) · [Root guide](../CLAUDE.md) · [README](../README.md)

---

## Current status

**Phase:** Prototype / proof of concept (last updated 2026-10-19)

Research is complete, the architecture is proposed and documentation is in progress. **A first version of the dashboard exists, running on mock data** ([Frontend design](../app/frontend/DESIGN.md#mock-data)). There is no backend, collection or NLP code yet.

**Next up: Phase 1, the database (Supabase) and the backend data layer.** The approved plan is in [PHASE1_DATABASE_PLAN.md](PHASE1_DATABASE_PLAN.md).

## Completed so far

- [x] Research: data access, platforms, NLP approaches and existing tools (see [Decisions → Alternatives researched](DECISIONS.md#alternatives-researched)).
- [x] Data collection strategy ([D-006](DECISIONS.md#d-006-monitor-key-accounts-and-a-small-keyword-set), [D-007](DECISIONS.md#d-007-collect-smart)).
- [x] Cost estimates ([Architecture → Cost model](ARCHITECTURE.md#cost-model)).
- [x] Prototype scope: one topic, ~6,000 posts, 2–3 snapshots, local run.
- [x] Proposed architecture ([Architecture](ARCHITECTURE.md)).

## Prototype milestones

- [ ] 1. Confirm the [open questions](#open-questions).
- [ ] 2. Choose the demo topic, ~10 keywords (English / Urdu / Roman Urdu) and key accounts.
- [ ] 3. Set up accounts and spending caps (Apify / twitterapi.io, Threads API app, LLM provider).
- [ ] 4. Repo scaffolding + Docker Compose (Postgres, backend, NLP service, frontend).
- [ ] 5. Collectors (X first, then Instagram, then Threads), each tested on 100 posts.
- [ ] 6. Cleaning + language tagging.
- [ ] 7. LLM labelling (mood, stance, sarcasm + confidence).
- [ ] 8. Embeddings + narrative grouping.
- [ ] 9. Daily brief generation.
- [ ] 10. Dashboard screens ([Frontend design](../app/frontend/DESIGN.md)). *In progress: all screens built on mock data (2026-10-19); still to connect to the backend API.*
- [ ] 11. Run 2–3 snapshots (~6,000 posts) and save them.
- [ ] 12. Demo rehearsal using saved data only.

## Budget tracker

Prototype budget: **Rs 2,000 (one-off)**. All figures are in Pakistani Rupees at ~Rs 278 per USD. Services bill in USD, so the rupee cost moves with the exchange rate, and card payments from Pakistan may add bank or tax charges. Re-verify prices before buying.

| Item | Estimated | Actual |
|---|---|---|
| X data (~5,000 tweets) | Rs 200–550 | |
| Instagram data (~500–1,000 posts) | Rs 400–750 | |
| Threads | Free (official API); fallback ~Rs 250–650 | |
| AI analysis | Rs 300–800 | |
| Hosting | Rs 0 (local) | |
| **Total** | **~Rs 1,000–2,000** | |

Budget tips:
- Test on 100 posts first.
- Set a spending cap on each service.
- Never re-scrape for a demo.
- If money runs short, cut Instagram first, since X alone tells most of the story.
- Apify's free plan may include a small monthly credit. This is **unverified**.

## Open questions

| # | Question | Status |
|---|---|---|
| 1 | **Python NLP service ([D-010](DECISIONS.md#d-010-add-a-python-nlp-service))**: accept it or go .NET-only? If accepted, where does it live in the repo? | Open (D-010 stays Proposed) |
| 2 | **Demo topic** (a recent naval exercise or geopolitical event). | Open |
| 3 | **LLM provider and models** for labelling and briefs ([D-012](DECISIONS.md#d-012-two-tier-llm-via-api)). | Open |
| 4 | **Versions:** .NET version. | Open (Next.js App Router and Node 20.9+ decided in [D-019](DECISIONS.md#d-019-frontend-stack-app-router-css-modules-recharts)) |
| 5 | **Frontend styling:** branding (logo, product colors beyond the data palette). | Open (CSS Modules, no component library: [D-019](DECISIONS.md#d-019-frontend-stack-app-router-css-modules-recharts)) |
| 6 | **X scraping provider:** Apify or twitterapi.io ([D-002](DECISIONS.md#d-002-use-ready-made-scraping-services-for-x-and-instagram)). | Open |
| 7 | **Auth:** does the prototype need a login, or is it single-user and local? | Open |
| 8 | **`.gitignore`:** the file is currently empty. Approve the proposed contents. | Open |
| 9 | **Review-queue confidence threshold** ([Flow → Human review loop](FLOW.md#human-review-loop)). | Open |
| 10 | **Common post format** fields, API endpoints and database schema. | Open (to define at build time) |
| — | Project name: **PakPulse**. | Resolved 2026-10-14 |
| — | Client naming: **fully generic in all docs** (neither the end client nor the PR company is named). | Resolved 2026-10-14 |
| — | Raw scraped data snapshots: **not committed** (kept out via `.gitignore`). | Resolved 2026-10-14 |
| — | Decision date 2026-10-14; owner Shahab Najmi / InfinityX Digital LTD, no other contributors listed. | Resolved 2026-10-14 |

## Risks to watch

See [Architecture → Risks and constraints](ARCHITECTURE.md#risks-and-constraints) for the full list. The ones to watch most closely:

- Legal view on scraping services; UK GDPR / DPIA.
- Roman Urdu and sarcasm accuracy.
- Threads API app review delay.
- Price changes and exchange-rate movement.

## Next steps after the prototype

1. Get a **legal view** on using scraping services for a government-linked client.
2. Complete a **DPIA** and document the legitimate-interest basis (UK GDPR).
3. Build the **labelled domain dataset** ([D-014](DECISIONS.md#d-014-build-a-labelled-domain-dataset)).
4. Plan a **pilot**: one topic, ~1,000 posts/day, ~Rs 20,000–40,000 / month. This includes decisions on hosting and data residency.
5. Ask whether the client already has a **monitoring subscription** whose data could be used.
