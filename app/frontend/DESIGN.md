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

## Color palette

One theme only: no light and dark modes. The interface is built from four brand colors, with Linen as the page background. Data colors (stance and mood) are separate earthy hues and are **never green**, so a chart bar never looks like a button and no stance reads as a party color. All values are CSS variables in [globals.css](src/app/globals.css).

### Brand (interface)

| Name | Hex | Used for |
|---|---|---|
| **Linen** | `#EDE4D3` | Page background |
| **Forest night** | `#173A2A` | Main text, headings, the sidebar |
| **Pine** | `#2D5A43` | Primary buttons, selected nav item and toggles, focus ring, progress |
| **Moss** | `#4F7552` | Single-series bars (emotions, posts per collection round), confidence meters |

### Derived from the brand

| Token | Hex | Used for |
|---|---|---|
| Card | `#F6F0E3` | Panels and cards, a lighter linen |
| Rule / Rule strong | `#D9CEB9` / `#C3B59C` | Borders and dividers |
| Sage | `#566A5C` | Secondary text (4.6:1 on Linen) |
| Moss tint | `#B9C9B3` | Earlier values beside a Moss bar |
| On forest / muted | `#EDE4D3` / `#A9B8A8` | Text on the sidebar |

### Data: stance

| Name | Meaning | Hex |
|---|---|---|
| **Indus** | Supportive | `#235E92` |
| **Stone** | Neutral (stance and mood) | `#ADA492` |
| **Kiln** | Critical | `#B4532A` |

### Data: mood

| Name | Meaning | Hex |
|---|---|---|
| **Haldi** | Positive | `#9A6A00` |
| **Jamun** | Negative | `#6D4590` |

Mood uses its own hues so analysts do not confuse a positive mood with a supportive stance.

### System

| Name | Meaning | Hex |
|---|---|---|
| **Chilli** | System errors only, such as a failed collection | `#A3261F` |

Always pair Chilli with an icon and text.

### Rules

- Text never takes a data color. Labels and values stay in Forest night or Sage, with a colored swatch beside them.
- The data colors were checked with a palette validator on the Card surface for lightness, color-blind separation and contrast. Stone is deliberately light so it reads as "no lean"; it is under 3:1 contrast, so stance and mood bars always carry a legend with values.

### No new colors for these

- **Sarcasm:** a label chip with a small 45° hatched swatch.
- **Low confidence:** a dashed outline and the score shown as text, e.g. "Stance Critical 0.52" ([D-013](../../docs/DECISIONS.md#d-013-confidence-score-on-every-label)).
- **Narratives:** identified by name, with bars colored by their stance mix. No categorical narrative palette.

## Logo

The mark is a single line: a heartbeat runs in from the left and becomes the P. It says "pulse" and "P" at once. Chosen by Hasaan on 2026-10-20 from four options (a listening bubble, the Urdu letter Pe and converging threads were the others).

| Use | Version | File |
|---|---|---|
| Sidebar | Linen mark beside the "PakPulse" wordmark in Source Serif 4 | [LogoMark.tsx](src/components/LogoMark.tsx) (draws in the current text color) |
| Browser tab | Linen mark on a Forest night rounded square | [icon.svg](src/app/icon.svg) |
| Phone home screen | Same, full-bleed square, 180px | [apple-icon.png](src/app/apple-icon.png) |
| Other uses | Forest night mark, Linen mark, app icon | [public/brand/](public/brand/) |

- Use the mark only in Forest night on Linen, or Linen on Forest night. Never in the data colors.
- Keep clear space around it of at least a quarter of its height.
- The wordmark is live text, not an image, so it always matches the interface font.

## Stack

| Item | Choice |
|---|---|
| Framework | Next.js 16 ([D-009](../../docs/DECISIONS.md#d-009-frontend-framework-is-nextjs)) |
| Router (App vs Pages) | App Router ([D-019](../../docs/DECISIONS.md#d-019-frontend-stack-app-router-css-modules-recharts)) |
| Node version | 20.9 or later (Next.js minimum). Developed on Node 24. |
| Charts | Recharts, styled to the palette ([D-019](../../docs/DECISIONS.md#d-019-frontend-stack-app-router-css-modules-recharts)) |
| Styling / component library | CSS Modules plus CSS variables. No component library ([D-019](../../docs/DECISIONS.md#d-019-frontend-stack-app-router-css-modules-recharts)) |
| Fonts | IBM Plex Sans (interface), Source Serif 4 (titles and the brief), Noto Nastaliq Urdu (Urdu script) |
| Auth / login | **TBD — to confirm with Shahab** |

## Running locally

```
cd app/frontend
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` checks types and builds for production.

## Code layout

| Path | What it holds |
|---|---|
| `src/app/` | One folder per screen: overview (`page.tsx`), `narratives/`, `posts/`, `brief/`, `review/`, `topic/` |
| `src/components/` | Shared pieces: sidebar, logo mark, post card, label chips, proportion bar, volume chart, skeletons |
| `src/lib/api.ts` | **The only data source.** Every function returns mock data today; swap each body for a backend call when the API exists |
| `src/lib/mock/` | Hand-written mock topic, posts, narratives, aggregates and briefs. Not real data |
| `src/lib/config.ts` | Review threshold (placeholder 0.60) and other settings |

## Mock data

The dashboard currently runs on **made-up data** for prototyping, approved by Hasaan on 2026-10-19. There is no on-screen mock label (removed at Hasaan's request on 2026-10-20), so say so when showing it. The mock topic is a fuel price rise; the real demo topic is still open ([Progress → Open questions](../../docs/PROGRESS.md#open-questions)). Mock posts have no authors and no source links. Replace the mock layer before any demo with real data.

## Data

The dashboard gets data **only from the backend API**, never directly from the database, the NLP service or external services. Endpoints are **TBD**; see the [Backend guide](../backend/CLAUDE.md#api-endpoints).

# Never use these

## Avoid the "vibe-coded" look
PakPulse should look like a serious tool built for PR analysts, not a generic AI-generated template. Don't use any of the following unless the team explicitly decides otherwise.

**Color**
- No harsh or showy gradients, and no rainbow coloring.
- No neon colors, no basic pastel palettes, and no purple-on-black theme.
- No pure white (`#FFFFFF`) page background. Use a slightly tinted neutral instead.
- The interface uses only the brand greens and Linen. Data colors appear only where they carry meaning, such as stance or mood (see [Color palette](#color-palette)). Never use them as decoration.

**Decoration and effects**
- No radial glow orbs and no dot-grid backgrounds.
- No "liquid glass" or glassmorphism panels, and no heavy drop shadows.
- No overly soft, pill-like corner radius everywhere. Keep corners small and consistent.
- No colored stripe down the left edge of cards or alerts.

**Layout**
- No bento grids.
- No row of three identical feature cards.
- No fake terminal or code windows used as decoration.

**Icons and type**
- No emojis in the UI.
- No sparkle ✨ icons, and no animated arrows.
- Don't just use the default Lucide icon set as-is. Choose icons deliberately and keep them consistent.
- No default "AI template" fonts: Inter, Geist or Space Grotesk.

**Motion**
- No hover animations on everything. Use motion only where it helps the user, e.g. showing that data is loading or that a chart has updated.

**Copy and text**
- No em dashes (—) in UI text.
- No "It's not X, it's Y" style phrasing.
- No checkmark-bullet lists of features.
- Write plainly and specifically.

**Content and trust**
- No fake testimonials, no made-up numbers, and no placeholder "real-time" claims. Show only real data and real sources.
- No generic three-tier pricing section.
- **Do** show the real product, i.e. the actual charts and posts, rather than mockups.
- **Do** use skeleton loaders while data is loading, never blank screens or bare spinners.
- **Do** include Terms of Use and a Privacy Policy before any public release.



