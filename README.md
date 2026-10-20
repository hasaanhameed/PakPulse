# PakPulse

> **Purpose:** An overview of PakPulse for people new to the project.

**Related docs:** [Architecture](docs/ARCHITECTURE.md) · [Decisions](docs/DECISIONS.md) · [Flow](docs/FLOW.md) · [Progress](docs/PROGRESS.md) · [Claude Code guide](CLAUDE.md)

---

## What is PakPulse?

PakPulse is a **social media listening and analysis system**. It shows PR analysts **what people are saying right now** about a topic, and **what they actually mean**: their mood, whether they support or criticise the topic, and whether they are being sarcastic.

It is built by **InfinityX Digital LTD** for a public relations client whose work covers naval and defence affairs, geopolitics and current world events.

Simple keyword tools count mentions. PakPulse reads them.

## Key features

1. **Collection:** gathers the latest posts on a topic from curated key accounts and a small set of keywords.
2. **Cleaning:** removes duplicates and spam, puts all platforms into one format, and tags each post's language.
3. **Analysis:** labels each post for mood, stance (supportive / critical / neutral) and sarcasm likelihood. Every label has a confidence score, and uncertain posts go to a human reviewer.
4. **Narratives:** groups posts into the main storylines and flags fast-growing ones.
5. **Reporting:** a dashboard plus an AI-written daily brief that **links back to the real posts** as evidence.

PakPulse does aggregate analysis only. It does not profile individuals.

## Platforms and languages

- **Platforms (initial):** X (Twitter), Instagram, Threads. YouTube, Telegram, Bluesky, news (GDELT/RSS) and Reddit may be added later.
- **Languages:** English, Urdu (Urdu script) and Roman Urdu (Urdu written in Latin script, often mixed with English).
- **Current trends only.** There is no historical analysis.

## Tech stack

| Part | Technology |
|---|---|
| Dashboard | Next.js |
| Backend API + collectors | ASP.NET Core, Entity Framework Core, Hangfire |
| Database | PostgreSQL + pgvector (Supabase for the prototype) |
| NLP service (proposed) | Python + FastAPI (BERTopic, multilingual models) |
| AI | External LLM API (provider TBD) |
| Data sources | Apify / twitterapi.io, Meta Threads API |
| Local run | Docker Compose |

## Architecture at a glance

The dashboard talks to the backend API. The backend runs the collectors, stores everything in PostgreSQL, and asks the NLP service to label posts, group narratives and write the brief. Full details are in [Architecture](docs/ARCHITECTURE.md), and the reasons for each choice are in [Decisions](docs/DECISIONS.md).

## Getting started

**TBD — to be written when code exists.** The whole system is expected to start locally with a single Docker Compose command.

## Documentation

| Doc | What it covers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Components, data sources, storage, AI layer, costs, risks |
| [docs/FLOW.md](docs/FLOW.md) | How data moves through the system |
| [docs/DATABASE.md](docs/DATABASE.md) | The tables, and how to change and connect to the database |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Why things are built the way they are |
| [docs/PROGRESS.md](docs/PROGRESS.md) | Status, milestones, budget, open questions |
| [app/backend/CLAUDE.md](app/backend/CLAUDE.md) | Backend guide |
| [app/frontend/DESIGN.md](app/frontend/DESIGN.md) | Dashboard design guide |
| [CLAUDE.md](CLAUDE.md) | Working rules for Claude Code |

## Status

**Prototype / proof of concept. No code yet.** See [Progress](docs/PROGRESS.md).

## Owner

**InfinityX Digital LTD**, London. Lead: Shahab Najmi.
