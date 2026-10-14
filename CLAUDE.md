# PakPulse — Root Guide (for Claude Code)

> **Purpose:** The entry point for Claude Code. Read this first in every session.

**Related docs:** [README](README.md) · [Architecture](docs/ARCHITECTURE.md) · [Decisions](docs/DECISIONS.md) · [Flow](docs/FLOW.md) · [Progress](docs/PROGRESS.md) · [Backend guide](app/backend/CLAUDE.md) · [Frontend design](app/frontend/DESIGN.md)

---

## Project summary

PakPulse is a social media listening and analysis system built by **InfinityX Digital LTD** (London; owner/lead: Shahab Najmi) for a PR client. It collects recent posts on a topic from X, Instagram and Threads, then labels each post for mood, stance and sarcasm in English, Urdu and Roman Urdu. It groups the posts into narratives and reports the results on a dashboard with an evidence-linked daily brief. Full overview: [README](README.md).

## Current phase

- **Prototype / proof of concept** for demos.
- **Budget:** ~Rs 2,000 in total (one-off) for data and AI. It runs locally on a laptop with no hosting cost.
- One topic, ~6,000 posts collected in 2–3 snapshots. **Collect once, save, and reuse the data for every demo.**
- **No application code yet.** Do not write code unless Shahab asks.
- Status and milestones: [Progress](docs/PROGRESS.md).

## Documentation map

| Doc | Purpose | Read it when… |
|---|---|---|
| [README.md](README.md) | Human-facing project overview | You need the big picture |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Components, data sources, storage, NLP layer, costs, risks | **Before any work** |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Decision log (D-001 onwards): the "why" | **Before any work**, and when making a new decision |
| [docs/PROGRESS.md](docs/PROGRESS.md) | Status, milestones, budget, open questions | **Before any work**, and when status changes |
| [docs/FLOW.md](docs/FLOW.md) | Pipeline and data flow, human review loop, failure handling | Working on collection, analysis or reporting |
| [app/backend/CLAUDE.md](app/backend/CLAUDE.md) | Backend conventions and stack | **Before any backend work** |
| [app/frontend/DESIGN.md](app/frontend/DESIGN.md) | Dashboard screens and design principles | **Before any frontend work** |

## Working rules for Claude Code

1. **Always read** [Architecture](docs/ARCHITECTURE.md), [Decisions](docs/DECISIONS.md) and [Progress](docs/PROGRESS.md) before starting work.
2. Read the [Backend guide](app/backend/CLAUDE.md) before backend work, and the [Frontend design](app/frontend/DESIGN.md) before frontend work.
3. **Ask Shahab when anything is ambiguous.** Do not guess on scope, cost, data sources or architecture.
4. **Never add a paid service or raise spending without approval.** Respect the spending caps.
5. **Never scrape platforms directly** or bypass platform blocking ([D-001](docs/DECISIONS.md#d-001-do-not-build-our-own-scrapers)).
6. **Never commit secrets** (API keys, tokens, `.env` files) or raw scraped data snapshots.
7. **Do not create, rename, move or delete files or folders** without Shahab's approval.
8. A new architectural decision gets an entry in [Decisions](docs/DECISIONS.md) (append only). A status change gets an update in [Progress](docs/PROGRESS.md).
9. **Keep cross-links valid** when editing docs. Use relative paths from each file's own location.
10. Never invent facts, figures, endpoints, schemas, versions or dates. Write **"TBD — to confirm with Shahab"** and add the item to [Progress → Open questions](docs/PROGRESS.md#open-questions).
11. **Keep the client generic.** Do not name the end client or the PR company in any doc.

## Ethical boundary

PakPulse does **aggregate narrative analysis, not profiling of individuals**. Never design features that track or profile specific private individuals, such as journalists or critics. See [Architecture → Ethical boundary](docs/ARCHITECTURE.md#ethical-boundary).

## Repository structure

```
PakPulse/
├── app/
│   ├── backend/      ← ASP.NET Core API + collector jobs (CLAUDE.md = backend guide)
│   └── frontend/     ← Next.js dashboard (DESIGN.md = design guide)
├── docs/             ← Architecture, decisions, flow and progress docs
├── .gitignore        ← Git ignore rules (contents pending approval)
├── CLAUDE.md         ← This file: Claude Code entry point
└── README.md         ← Human-facing overview
```

The Python NLP service ([D-010](docs/DECISIONS.md#d-010-add-a-python-nlp-service), proposed) has **no folder yet**. Its location is TBD.
