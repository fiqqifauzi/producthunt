"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopSearch } from "./top-search";

export function ProductHunterDashboard(): React.JSX.Element {
  const [query, setQuery] = useState("");

  return (
    <div className="dashboard-shell">
      <AppSidebar />
      <TopSearch query={query} onQueryChange={setQuery} />
      <main className="dashboard-content" id="discover">
        <h1>Find products worth promoting</h1>
        <p>Discover high-potential Shopee Affiliate products using real data and AI analysis.</p>
      </main>
      <aside className="detail-region" aria-label="Product details" />
    </div>
  );
}
