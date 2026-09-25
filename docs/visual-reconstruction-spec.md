# Product Hunter Visual Reconstruction Specification

## Objective

Reconstruct the supplied 1536 × 1024 desktop reference as a functional, standalone Product Hunter dashboard. The screenshot is the visual source of truth for placement, proportions, density, colors, and hierarchy.

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

Dark navy sidebar with Product Hunter mark and four navigation group labels; white top search bar; fixed desktop detail panel. Main content remains readable when the panel is open.

### v2-discovery

Heading copy, five filters in one white card, blue Hunt Products button, and four white KPI cards. Primary blue is `#2563EB`; page canvas is near-white blue-gray.

### v3-product-table

Four tabs, sort control, eight dense rows with thumbnail, category chip, price, sold, rating, commission, velocity, score status, actions, and screenshot-style pagination.

### v4-detail-drawer

Selected product includes source, main image + thumbnail rail, price/rating/sold, commission card, green score gauge with six weighted bars, recommendation list, secondary CTAs, and a blue-purple content-ideas CTA.

### v5-polish

Existing search, filtering, tabs, watchlist, pagination, drawer, content modal, keyboard behavior, and basic responsive mode are retained. At desktop dimensions visual geometry takes precedence; smaller screens may use an overlay drawer.

## Acceptance Method

At each version, validate the HTML interaction harness and inspect the page at 1536 × 1024. Do not advance a version when its target section materially diverges in layout or density from the reference.
