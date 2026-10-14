# PakPulse — Frontend Design Guide

> **Purpose:** Design and UI guidance for the Next.js dashboard.

**Related docs:** [Root guide](../../CLAUDE.md) · [Architecture](../../docs/ARCHITECTURE.md) · [Flow](../../docs/FLOW.md) · [Decisions](../../docs/DECISIONS.md) · [Progress](../../docs/PROGRESS.md) · [Backend guide](../backend/CLAUDE.md)

---

## Purpose and users

The dashboard is for **PR analysts** who need to understand quickly and reliably what people are saying right now about a topic: not just volume, but mood, stance and whether a post is sarcastic. It is the only user-facing part of PakPulse (see [Architecture → Components](../../docs/ARCHITECTURE.md#components)).

## Prototype screens

| Screen | What it shows |
|---|---|
| **Topic setup** | Create or edit a topic: keywords and key accounts in English, Urdu and Roman Urdu, plus a "Collect now" trigger ([Flow](../../docs/FLOW.md#prototype-vs-future-mode)). |
| **Overview** | Post volume over time, plus the mood and stance breakdown (supportive / critical / neutral). |
| **Narratives** | Top and fast-growing narratives, each with sample posts. |
| **Daily brief** | The AI-written brief, with every claim linking to its source posts. |
| **Review queue** | Low-confidence labels for an analyst to confirm or correct ([Flow → Human review loop](../../docs/FLOW.md#human-review-loop)). |

## Design principles

- **Clarity over decoration.** Analysts should get the picture at a glance.
- **Every insight links to evidence.** Charts, narratives and brief sentences lead to the real posts.
- **Show confidence visibly.** Labels show their confidence score, and low-confidence items stand out ([D-013](../../docs/DECISIONS.md#d-013-confidence-score-on-every-label)).
- **Multilingual text:** render Urdu script right-to-left alongside English and Roman Urdu, including in mixed lists.
- **Aggregate, not individual.** No screens that profile or track individual people ([Architecture → Ethical boundary](../../docs/ARCHITECTURE.md#ethical-boundary)).

## Stack

| Item | Choice |
|---|---|
| Framework | Next.js ([D-009](../../docs/DECISIONS.md#d-009-frontend-framework-is-nextjs)) |
| Router (App vs Pages) | **TBD — to confirm with Shahab** |
| Node version | **TBD — to confirm with Shahab** |
| Charts | A library such as Recharts (**to confirm**) |
| Styling / component library | **TBD — to confirm with Shahab** |
| Auth / login | **TBD — to confirm with Shahab** |

## Data

The dashboard gets data **only from the backend API**, never directly from the database, the NLP service or external services. Endpoints are **TBD**; see the [Backend guide](../backend/CLAUDE.md#api-endpoints).

## Branding and visual identity

**TBD — to confirm with Shahab.**
