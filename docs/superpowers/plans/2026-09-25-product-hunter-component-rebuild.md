# Product Hunter Component Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Product Hunter dashboard as a componentized Next.js application that matches the supplied 1536 × 1024 mockup and preserves the approved research interactions.

**Architecture:** The App Router page renders a client-side `ProductHunterDashboard` composed from focused sidebar, search, filter, KPI, table, score, sheet, and dialog components. Typed product fixtures feed deterministic filtering and score utilities; TanStack Table owns tab sorting, row selection, pagination, and column visibility while shadcn-style Radix primitives own overlay accessibility.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Radix/shadcn component patterns, `lucide-react`, TanStack Table, Vitest, Testing Library, Playwright.

**Spec:** `docs/visual-reconstruction-spec.md`

## Global Constraints

- The 1536 × 1024 reference image is the visual source of truth; desktop uses a 210 px sidebar, 63 px top bar, and 370 px detail panel.
- Use Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui interaction conventions, `lucide-react`, and TanStack Table.
- Do not use emoji, Unicode symbols as icons, remote icon fonts, or marketplace-style product card grids.
- Shopee orange is limited to source branding; blue is primary and blue-to-violet is reserved for AI actions.
- Preserve keyboard focus, Escape behavior, visible focus rings, labelled icon buttons, and text labels in addition to status colors.
- Each version is a separate Git commit named `v1` through `v5`.

---

### Task 1: v1-shell — scaffold and fixed dashboard anatomy

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `components/product-hunter/app-sidebar.tsx`, `components/product-hunter/top-search.tsx`, `components/product-hunter/product-hunter-dashboard.tsx`
- Create: `lib/utils.ts`, `vitest.config.ts`, `vitest.setup.ts`
- Test: `components/product-hunter/product-hunter-dashboard.test.tsx`

**Interfaces:**
- Produces: `ProductHunterDashboard(): JSX.Element`, `AppSidebar(): JSX.Element`, and `TopSearch({query,onQueryChange})`.
- Produces semantic CSS tokens `--primary`, `--brand-navy`, `--background`, `--surface`, `--text`, `--muted`, `--border`, `--ai-start`, `--ai-end`, `--success`, `--warning`, `--danger`, and `--source-shopee`.

- [ ] **Step 1: Add the failing shell test**

```tsx
render(<ProductHunterDashboard />)
expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
expect(screen.getByPlaceholderText('Search products, keywords, or categories...')).toBeInTheDocument()
expect(screen.getByText('DISCOVERY')).toBeInTheDocument()
expect(screen.getByText('Find products worth promoting')).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm test -- product-hunter-dashboard.test.tsx`
Expected: FAIL because the dashboard components do not exist.

- [ ] **Step 3: Scaffold the application and implement the shell**

Run: `npm install next react react-dom @tanstack/react-table lucide-react @radix-ui/react-dialog @radix-ui/react-tooltip clsx tailwind-merge class-variance-authority && npm install -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss vitest jsdom @testing-library/react @testing-library/jest-dom @vitejs/plugin-react playwright`

Implement the 210/remaining/370 desktop grid, grouped sidebar navigation, 63 px top search, heading, and an empty stable right detail region. Use Lucide `Search`, `Bell`, `House`, `Flame`, `Heart`, `Target`, `Trophy`, `Sparkles`, `ChartNoAxesColumnIncreasing`, and `Settings` icons.

- [ ] **Step 4: Verify GREEN and production build**

Run: `npm test -- product-hunter-dashboard.test.tsx && npm run build`
Expected: test passes and Next.js build exits 0.

- [ ] **Step 5: Commit the version**

```bash
git add package.json package-lock.json app components lib vitest.config.ts vitest.setup.ts next.config.ts tsconfig.json postcss.config.mjs
git commit -m "feat(v1): build product hunter shell"
```

### Task 2: v2-discovery — filters and KPI strip

**Files:**
- Create: `components/product-hunter/discovery-filters.tsx`, `components/product-hunter/kpi-strip.tsx`
- Create: `components/ui/select.tsx`, `components/ui/button.tsx`
- Modify: `components/product-hunter/product-hunter-dashboard.tsx`
- Test: `components/product-hunter/discovery-filters.test.tsx`

**Interfaces:**
- Consumes: `query` and `onQueryChange` from the shell.
- Produces: `ProductFilters` type and `DiscoveryFilters({value,onChange,onHunt})`.
- Produces: `KpiStrip({productsScanned,highOpportunity,trendingProducts,averageOpportunity})`.

- [ ] **Step 1: Add failing controlled-filter tests**

```tsx
render(<DiscoveryFilters value={defaultFilters} onChange={onChange} onHunt={onHunt} />)
expect(screen.getByLabelText('Category')).toBeInTheDocument()
expect(screen.getByLabelText('Price Range')).toBeInTheDocument()
expect(screen.getByLabelText('Min Sold')).toBeInTheDocument()
expect(screen.getByLabelText('Min Rating')).toBeInTheDocument()
expect(screen.getByLabelText('Min Commission')).toBeInTheDocument()
await user.click(screen.getByRole('button', { name: 'Hunt Products' }))
expect(onHunt).toHaveBeenCalledOnce()
```

- [ ] **Step 2: Confirm RED**

Run: `npm test -- discovery-filters.test.tsx`
Expected: FAIL because `DiscoveryFilters` is missing.

- [ ] **Step 3: Implement the filter bar and KPI strip**

Use screenshot copy and order exactly: Category, Price Range, Min Sold, Min Rating, Min Commission, Hunt Products; then Products Scanned, High Opportunity, Trending Products, Average Opportunity. Use Lucide `Search`, `Package`, `Flame`, `TrendingUp`, and `Star`.

- [ ] **Step 4: Verify the focused tests and build**

Run: `npm test -- discovery-filters.test.tsx product-hunter-dashboard.test.tsx && npm run build`
Expected: all tests pass and build exits 0.

- [ ] **Step 5: Commit the version**

```bash
git add components
git commit -m "feat(v2): add discovery filters and KPI strip"
```

### Task 3: v3-product-table — typed fixtures and comparison table

**Files:**
- Create: `lib/types.ts`, `lib/product-filters.ts`, `lib/opportunity-score.ts`, `data/products.ts`
- Create: `components/product-hunter/product-table.tsx`, `components/product-hunter/opportunity-score.tsx`
- Create: `components/ui/tooltip.tsx`
- Modify: `components/product-hunter/product-hunter-dashboard.tsx`
- Test: `lib/product-filters.test.ts`, `lib/opportunity-score.test.ts`, `components/product-hunter/product-table.test.tsx`

**Interfaces:**
- Produces: `Product`, `OpportunityBreakdown`, and `ProductQuery` types.
- Produces: `filterProducts(products, query): Product[]` and `calculateOpportunityScore(product): OpportunityScoreResult`.
- Produces: `ProductTable({products,selectedId,onSelect,onToggleWatchlist})` using TanStack Table.

- [ ] **Step 1: Add failing utility and table tests**

```ts
expect(filterProducts(products, { search: 'sikat', category: 'all', minSold: 1000 })).toHaveLength(1)
expect(calculateOpportunityScore(products[0]).breakdown).toEqual({ demand: 24, commission: 18, rating: 9, price: 8, contentPotential: 19, competition: 14 })
```

```tsx
render(<ProductTable products={products} selectedId="brush" onSelect={onSelect} onToggleWatchlist={onToggle} />)
expect(screen.getByText('Sikat Pembersih Elektrik 3 in 1')).toBeInTheDocument()
expect(screen.getByRole('row', { name: /Sikat Pembersih/i })).toHaveAttribute('aria-selected', 'true')
```

- [ ] **Step 2: Confirm RED**

Run: `npm test -- product-filters.test.ts opportunity-score.test.ts product-table.test.tsx`
Expected: FAIL because the typed utilities and table are missing.

- [ ] **Step 3: Implement fixtures, deterministic scoring, and TanStack Table**

Implement the screenshot column order Product, Category, Price, Sold, Rating, Commission, Velocity, Score, Action; eight rows per page; four sorting tabs; Opportunity Score default sort; column visibility button; watchlist and source icon actions. Score hover/focus opens an accessible tooltip containing all six factor values and “View Analysis”.

- [ ] **Step 4: Verify utilities, table, and build**

Run: `npm test -- product-filters.test.ts opportunity-score.test.ts product-table.test.tsx && npm run build`
Expected: all tests pass and build exits 0.

- [ ] **Step 5: Commit the version**

```bash
git add components data lib
git commit -m "feat(v3): build product comparison table"
```

### Task 4: v4-detail-drawer — score analysis and content ideas

**Files:**
- Create: `components/product-hunter/product-detail-sheet.tsx`, `components/product-hunter/content-ideas-dialog.tsx`
- Create: `components/ui/dialog.tsx`, `components/ui/sheet.tsx`, `components/ui/progress.tsx`
- Modify: `components/product-hunter/product-hunter-dashboard.tsx`
- Test: `components/product-hunter/product-detail-sheet.test.tsx`, `components/product-hunter/content-ideas-dialog.test.tsx`

**Interfaces:**
- Consumes: selected `Product` and `OpportunityScoreResult`.
- Produces: `ProductDetailSheet({product,open,onOpenChange,watchlisted,onToggleWatchlist,onGenerateIdeas})`.
- Produces: `ContentIdeasDialog({product,open,onOpenChange})` with five fixed angle types.

- [ ] **Step 1: Add failing drawer and content tests**

```tsx
render(<ProductDetailSheet product={product} open onOpenChange={onOpenChange} watchlisted={false} onToggleWatchlist={onToggle} onGenerateIdeas={onIdeas} />)
expect(screen.getByText('Opportunity Score')).toBeInTheDocument()
expect(screen.getByText('Demand')).toBeInTheDocument()
expect(screen.getByText('Why this product?')).toBeInTheDocument()
```

```tsx
render(<ContentIdeasDialog product={product} open onOpenChange={onOpenChange} />)
for (const angle of ['Problem-Solution','Before/After','Satisfying Demo','Product Discovery','Comparison']) expect(screen.getByText(angle)).toBeInTheDocument()
```

- [ ] **Step 2: Confirm RED**

Run: `npm test -- product-detail-sheet.test.tsx content-ideas-dialog.test.tsx`
Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement persistent desktop sheet and accessible modal**

Match the reference gallery, pricing row, commission card, radial score treatment, six progress bars, reasons, Add to Watchlist, Lihat di Shopee placeholder, and AI gradient CTA. On desktop keep the panel stable; on smaller breakpoints use an overlay Sheet. Dialog contains title, concise hook, and visual direction for each angle.

- [ ] **Step 4: Verify overlay behavior and build**

Run: `npm test -- product-detail-sheet.test.tsx content-ideas-dialog.test.tsx && npm run build`
Expected: tests pass, including Escape/focus restoration assertions, and build exits 0.

- [ ] **Step 5: Commit the version**

```bash
git add components
git commit -m "feat(v4): add product analysis and content ideas"
```

### Task 5: v5-polish — integrated state, data states, responsive behavior, and visual QA

**Files:**
- Modify: `components/product-hunter/product-hunter-dashboard.tsx`, `components/product-hunter/product-table.tsx`, `components/product-hunter/discovery-filters.tsx`, `app/globals.css`, `README.md`
- Create: `components/product-hunter/product-table-states.tsx`, `e2e/product-hunter.spec.ts`, `playwright.config.ts`
- Test: `components/product-hunter/product-hunter-dashboard.integration.test.tsx`, `e2e/product-hunter.spec.ts`

**Interfaces:**
- Consumes: every component and utility from Tasks 1–4.
- Produces: shareable query parameters, persisted watchlist, loading/empty/error/stale displays, 8-row page-size default with selector, and responsive desktop/tablet/mobile composition.

- [ ] **Step 1: Add failing integration and visual-layout assertions**

```tsx
expect(screen.getByRole('button', { name: 'Hunt Products' })).toBeEnabled()
await user.type(screen.getByPlaceholderText('Search products, keywords, or categories...'), 'sikat')
expect(screen.getByText('Sikat Pembersih Elektrik 3 in 1')).toBeInTheDocument()
expect(screen.queryByText('Rak Dapur Stainless 2 Tingkat')).not.toBeInTheDocument()
```

```ts
await page.setViewportSize({ width: 1536, height: 1024 })
await page.goto('/')
await expect(page.locator('aside[aria-label="Main navigation"]')).toHaveCSS('width', '210px')
await expect(page.getByRole('dialog', { name: /Sikat Pembersih/i })).toBeVisible()
await expect(page).toHaveScreenshot('product-hunter-1536x1024.png', { maxDiffPixelRatio: 0.01 })
```

- [ ] **Step 2: Confirm RED**

Run: `npm test -- product-hunter-dashboard.integration.test.tsx && npx playwright test e2e/product-hunter.spec.ts`
Expected: FAIL until integration state and reference snapshot exist.

- [ ] **Step 3: Integrate application state and finish all states**

Implement debounced search, URL search parameters, filters, tabs, sort, selected row, watchlist persistence, pagination/page-size selection, column visibility, score analysis, loading skeleton, empty guidance, retryable error, and stale timestamp. Add responsive rules: filter wrap on tablet, compact list on mobile, overlay detail sheet below desktop.

- [ ] **Step 4: Run complete verification**

Run: `npm test && npm run build && npx playwright test`
Expected: all unit/integration/E2E tests pass, production build exits 0, and the 1536 × 1024 screenshot stays within the 1% pixel-difference threshold.

- [ ] **Step 5: Commit the version**

```bash
git add app components data e2e lib README.md package.json package-lock.json playwright.config.ts
git commit -m "feat(v5): complete product hunter dashboard"
```
