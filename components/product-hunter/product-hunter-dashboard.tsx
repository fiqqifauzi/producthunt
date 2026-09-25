"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopSearch } from "./top-search";
import { DiscoveryFilters, defaultFilters } from "./discovery-filters";
import { KpiStrip } from "./kpi-strip";

export function ProductHunterDashboard(): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [huntCount, setHuntCount] = useState(0);

  return (
    <div className="dashboard-shell">
      <AppSidebar />
      <TopSearch query={query} onQueryChange={setQuery} />
      <main className="dashboard-content" id="discover">
        <h1>Find products worth promoting</h1>
        <p>Discover high-potential Shopee Affiliate products using real data and AI analysis.</p>
        <DiscoveryFilters value={filters} onChange={setFilters} onHunt={() => setHuntCount((count) => count + 1)} />
        <span className="sr-only" aria-live="polite">{huntCount > 0 ? `Search applied for ${query || "all products"}` : ""}</span>
        <KpiStrip productsScanned={12480} highOpportunity={1284} trendingProducts={327} averageOpportunity={86.4} />
      </main>
      <aside className="detail-region" aria-label="Product details" />
    </div>
  );
}
