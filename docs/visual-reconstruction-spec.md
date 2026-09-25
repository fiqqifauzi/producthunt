# Product Hunter Visual Reconstruction Specification

## Objective

Reconstruct the supplied 1536 × 1024 desktop reference as a production-oriented Product Hunter dashboard. The screenshot is the visual source of truth for placement, proportions, density, colors, and hierarchy; the attached mockup brief is the source of truth for the application engine, component libraries, interaction architecture, and accessibility behavior.

## Engine and Library Contract

This implementation uses the production-oriented stack from the mockup brief:

| Layer | Required implementation |
| --- | --- |
| Runtime | Next.js App Router + React + TypeScript |
| Styling | Tailwind CSS with semantic CSS-variable tokens |
| Components | shadcn/ui primitives and interaction conventions |
| Icons | `lucide-react`; no emoji, Unicode substitutes, or remote icon fonts |
| Table | TanStack Table |
| Charts | Recharts only when Niche Hunter and Performance are implemented |
| Data | Typed local fixtures behind an adapter boundary, ready for an official API |

No single-file or CDN implementation is required. Packages are installed through the project package manager and the application must provide standard development and production build commands.

### Proposed source structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  product-hunter/
    app-sidebar.tsx
    top-search.tsx
    discovery-filters.tsx
    kpi-strip.tsx
    product-table.tsx
    opportunity-score.tsx
    product-detail-sheet.tsx
    content-ideas-dialog.tsx
    product-hunter-dashboard.tsx
data/
  products.ts
lib/
  opportunity-score.ts
  product-filters.ts
  types.ts
```

### Icon rules

- Use components from `lucide-react` with the standard 24 × 24 view box, `currentColor` stroke, round caps, and round joins.
- Use 18–20 px icons for sidebar navigation, 16–18 px for controls and row actions, and 14–16 px for compact status affordances.
- Every icon-only button requires an accessible label and visible focus state.
- Use icons matching the brief: Search, Bell, Home, Flame, Heart, Target, Trophy, Sparkles, BarChart, Settings, SlidersHorizontal, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, Star, Package, TrendingUp, X, and Check.
- Shopee orange is limited to the source indicator; it is not the primary action color.

### Semantic tokens

| Token | Value / direction |
| --- | --- |
| `primary` | `#2563EB` for active navigation, Hunt Products, focus, and selected row border |
| `brand-navy` | `#14233B` to `#0E1B2E` sidebar range |
| `background` | `#F7F9FC` |
| `surface` | `#FFFFFF` |
| `text` | `#101828` / charcoal |
| `muted` | `#667085` |
| `border` | `#E4E7EC` |
| `ai` | blue-to-violet gradient for Generate Content Ideas only |
| `success` | `#12B76A` |
| `warning` | `#F79009` |
| `danger` | `#F04438` |
| `source-shopee` | `#EE4D2D`, limited to source branding |

## Fixed Desktop Geometry

| Region | Target |
| --- | --- |
| Canvas | 1536 × 1024 px |
| Sidebar | 210 px fixed width |
| Top bar | 63 px height |
| Detail panel | 370 px fixed width |
| Main content | Remaining width; 22 px horizontal inset |
| Main heading | 28 px, dark navy |
| Table rows | 61 px height |

## Versioned Components

### v1-shell

Dark navy sidebar with Product Hunter mark and four navigation group labels; white top search bar; fixed desktop detail panel. Main content remains readable when the panel is open. Use `lucide-react` icons throughout.

### v2-discovery

Heading copy, five filters in one white card, blue Hunt Products button, and four white KPI cards. Primary blue is `#2563EB`; page canvas is near-white blue-gray.

### v3-product-table

Four tabs, sort control, secondary column-visibility control, eight dense rows with thumbnail, category chip, price, sold, rating, commission, velocity, score status, actions, and screenshot-style pagination. Score hover/focus opens an accessible explanation popover with View Analysis.

### v4-detail-drawer

Selected product includes source, main image + thumbnail rail, price/rating/sold, commission card, green score gauge with six weighted bars, recommendation list, secondary CTAs, and a blue-purple content-ideas CTA.

### v5-polish

Search, filtering, tabs, sorting, watchlist, pagination, row-count selection, drawer, score popover, content modal, keyboard behavior, and responsive mode are implemented as typed React components. Add loading skeleton, empty, error, and stale-data presentation. At desktop dimensions visual geometry takes precedence; smaller screens may use an overlay drawer.

## Interaction Architecture

- Search and filters use typed React controlled state, a short debounce, and shareable URL search parameters.
- Product sorting, filters, row selection, column visibility, pagination, and page-size selection use TanStack Table directly.
- Drawer and modal use shadcn Sheet/Dialog primitives: Escape close, focus trap, focus restoration, labelled title, and inert background when modal.
- Watchlist uses optimistic local state persisted in `localStorage`.
- Opportunity Score is a deterministic function returning total, six weighted factors, and explanation reasons.
- Content ideas receive the selected product context and return exactly five initial angles defined in the brief.

## Data States

- Loading: eight-row skeleton table and disabled primary action.
- Empty: actionable suggestion to loosen filters or change search terms.
- Error: concise retry action without losing current filters.
- Stale: visible last-updated indicator; refresh retains table context.

## Acceptance Method

At each version, validate the HTML interaction harness and inspect the page at 1536 × 1024. Do not advance a version when its target section materially diverges in layout or density from the reference.
