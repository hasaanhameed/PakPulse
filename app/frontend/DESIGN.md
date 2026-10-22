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
| **Overview** | The pulse of post volume across collection rounds, key figures, stance and mood breakdowns, narratives to watch, and three claims from the latest brief beside the posts behind them. |
| **Narratives** | Top and fast-growing narratives, each with sample posts. |
| **Daily brief** | The AI-written brief, with every claim linking to its source posts. |
| **Review queue** | Low-confidence labels for an analyst to confirm or correct ([Flow → Human review loop](../../docs/FLOW.md#human-review-loop)). |

## Design principles

- **Clarity over decoration.** Analysts should get the picture at a glance.
- **Every insight links to evidence.** Charts, narratives and brief sentences lead to the real posts.
- **Show confidence visibly.** Labels show their confidence score, and low-confidence items stand out ([D-013](../../docs/DECISIONS.md#d-013-confidence-score-on-every-label)).
- **Multilingual text:** render Urdu script right-to-left alongside English and Roman Urdu, including in mixed lists.
- **Aggregate, not individual.** No screens that profile or track individual people ([Architecture → Ethical boundary](../../docs/ARCHITECTURE.md#ethical-boundary)).

## Look and feel: the Forest frame

Chosen by Shahab on 2026-10-22 from three light mock-ups (A: Linen refined, **B: Forest frame**, C: Paper with waffle charts). The goal: livelier and easier to scan than the first version, while still looking like a serious tool for analysts rather than an AI-generated template. Decision: [D-022](../../docs/DECISIONS.md#d-022-dashboard-look-the-forest-frame).

- **One light theme with a dark green frame.** Linen pages and Card panels, framed by two Forest night surfaces: the **sidebar** and the overview's **pulse band**. Nothing else is dark.
- **No dark mode.** A full dark "monitoring console" version was tried on 2026-10-22 and rejected because it looked AI-generated. Do not reintroduce it.
- **The pulse line is the signature.** The overview opens with total posts per 6-hour window drawn as one heartbeat-like line on the Forest night band, echoing the logo ([PulseChart.tsx](src/components/PulseChart.tsx)). Narrative rows repeat it as small trend lines ([Sparkline.tsx](src/components/Sparkline.tsx)).
- **Numbers in monospace.** Every count, percentage, time and score uses IBM Plex Mono through the `.tabular` class, so figures line up and read like instrument readouts. Words stay in IBM Plex Sans. No serif anywhere.
- **Figures get the shape that suits them,** not a row of identical boxes: e.g. critical share with a bar per round, sarcasm with its caveat, the fastest-growing narrative with its change.
- **Corners:** 2px on bars and swatches, 4px on buttons, chips and inputs, 6px on panels and cards (`--radius-sm`, `--radius`, `--radius-lg`).

### Less text

The first version explained everything in sentences. Now:

- **Explanations live behind an ⓘ button** ([InfoTip.tsx](src/components/InfoTip.tsx)), shown on hover or keyboard focus, not as a note under every heading.
- **Page subtitles are one short line.**
- **Brief claims are numbered rows** in normal-size text, with their sources as small numbered links underneath, one panel per section. The overview shows three of them as "Three things to know", beside the posts behind them.
- **Long summaries are cut to two lines** in lists; the full text is on the detail page.
- **Compact post cards** (brief sources) show stance and mood only. The post page has every label.
- **Confidence is a signal meter plus the score:** four rising bars, then the number ([ConfidenceMeter.tsx](src/components/ConfidenceMeter.tsx)).
- **Platforms have small outline icons** ([PlatformIcon.tsx](src/components/PlatformIcon.tsx)). They are our own simple marks, not the official logos. X sits in a rounded square so it never reads as a close button.

## Color palette

One light theme with a Forest night frame (see above). The interface is built from four brand colors, with Linen as the page background. Data colors (stance, mood and emotion) are separate earthy hues and are **never green**, so a chart bar never looks like a button and no stance reads as a party color. All values are CSS variables in [globals.css](src/app/globals.css).

### Brand (interface)

| Name | Hex | Used for |
|---|---|---|
| **Linen** | `#EDE4D3` | Page background |
| **Forest night** | `#173A2A` | Main text and headings; the frame (sidebar and pulse band); selected toggles |
| **Pine** | `#2D5A43` | Primary buttons, "Emerging" and "Growing fast" badges, focus ring |
| **Moss** | `#4F7552` | Single-series bars (posts per collection round), the label meters on the post page |

### Derived from the brand

| Token | Hex | Used for |
|---|---|---|
| Card | `#F6F0E3` | Panels and cards, a lighter linen |
| Highlight | `#E4D9C3` | Hovered rows and figures; the brief's opening summary |
| Rule / Rule strong | `#D9CEB9` / `#C3B59C` | Borders and dividers |
| Sage | `#566A5C` | Secondary text (4.6:1 on Linen) |
| Moss tint | `#B9C9B3` | Earlier values beside a Moss bar |
| On forest / soft / muted | `#EDE4D3` / `#C9D3C6` / `#A9B8A8` | Text on the frame: values, labels, small print |
| On forest rule / hover / active | Linen at 16% / 8% / 13% | Borders, hovered and current nav items on the frame |

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

### Data: emotion

Emotions take the color of the mood they lean to, so color keeps its meaning and there is no rainbow of six hues.

| Emotion | Color |
|---|---|
| Anger, worry, disappointment | **Jamun** (negative) |
| Hope | **Haldi** (positive) |
| Humour | **Slate** `#6B7487`, because humour can lean either way |
| No clear emotion | **Stone** (neutral) |

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
- **Low confidence:** a dashed outline, the signal meter and the score, e.g. "Stance Critical ▂▄ 0.52" ([D-013](../../docs/DECISIONS.md#d-013-confidence-score-on-every-label)).
- **Trends:** "Emerging" and "Growing fast" badges are solid Pine (interface, because they ask for attention); "Fading" is an outline.
- **Narratives:** identified by name, with bars colored by their stance mix. No categorical narrative palette.

## Logo

The mark is a single line: a heartbeat runs in from the left and becomes the P. It says "pulse" and "P" at once. Chosen by Hasaan on 2026-10-20 from four options (a listening bubble, the Urdu letter Pe and converging threads were the others).

| Use | Version | File |
|---|---|---|
| Sidebar | Linen mark beside the "PakPulse" wordmark in IBM Plex Sans | [LogoMark.tsx](src/components/LogoMark.tsx) (draws in the current text color) |
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
| Charts | Hand-drawn SVG and CSS bars (pulse line, sparklines, proportion bars, round columns). No chart library: Recharts was removed on 2026-10-22 ([D-022](../../docs/DECISIONS.md#d-022-dashboard-look-the-forest-frame)) |
| Styling / component library | CSS Modules plus CSS variables. No component library ([D-019](../../docs/DECISIONS.md#d-019-frontend-stack-app-router-css-modules-recharts)) |
| Fonts | IBM Plex Sans (interface), IBM Plex Mono (numbers, times and scores), Noto Nastaliq Urdu (Urdu script). No serif |
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
| `src/components/` | Shared pieces: sidebar and nav icons, logo mark, page header, info tip, post card, label chips, confidence meter, platform icons, proportion bar, pulse chart, sparkline, round columns, skeletons |
| `src/lib/api.ts` | **The only data source.** Every function returns mock data today; swap each body for a backend call when the API exists |
| `src/lib/mock/` | Hand-written mock topic, posts, narratives, aggregates and briefs. Not real data |
| `src/lib/config.ts` | Review threshold (placeholder 0.60) and other settings |

## Mock data

The dashboard currently runs on **made-up data** for prototyping, approved by Hasaan on 2026-10-19. There is no on-screen mock label (removed at Hasaan's request on 2026-10-20), so say so when showing it. Mock collection rounds are labelled "Round 1" to "Round 3" (the code still calls them snapshots internally). The mock topic is a fuel price rise; the real demo topic is still open ([Progress → Open questions](../../docs/PROGRESS.md#open-questions)). Mock posts have no authors and no source links. Replace the mock layer before any demo with real data.

## Data

The dashboard gets data **only from the backend API**, never directly from the database, the NLP service or external services. Endpoints are **TBD**; see the [Backend guide](../backend/CLAUDE.md#api-endpoints).

# Never use these

## Avoid the "vibe-coded" look
PakPulse should look like a serious tool built for PR analysts, not a generic AI-generated template. Don't use any of the following unless the team explicitly decides otherwise.

**Color**
- No dark theme or dark "console" look. Tried on 2026-10-22 and rejected as AI-generated; see [Look and feel](#look-and-feel-the-forest-frame).
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



