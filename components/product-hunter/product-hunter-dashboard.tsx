"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { TopSearch } from "./top-search";
import { DiscoveryFilters, defaultFilters } from "./discovery-filters";
import { KpiStrip } from "./kpi-strip";
import { ProductTable } from "./product-table";
import { ProductDetailSheet } from "./product-detail-sheet";
import { ContentIdeasDialog } from "./content-ideas-dialog";
import { products } from "../../data/products";

export function ProductHunterDashboard(): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [huntCount, setHuntCount] = useState(0);
  const [selectedId, setSelectedId] = useState("brush");
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [detailOpen, setDetailOpen] = useState(true);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0];
  const isSelectedWatched = watchedIds.includes(selectedProduct.id) ? !selectedProduct.watched : Boolean(selectedProduct.watched);
  const toggleWatchlist = (id: string) => setWatchedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

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
        <ProductTable products={products.map((product) => ({ ...product, watched: watchedIds.includes(product.id) ? !product.watched : product.watched }))} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setDetailOpen(true); }} onToggleWatchlist={toggleWatchlist} />
      </main>
      <div className="detail-region">{detailOpen && <ProductDetailSheet product={selectedProduct} open={detailOpen} onOpenChange={setDetailOpen} watchlisted={isSelectedWatched} onToggleWatchlist={() => toggleWatchlist(selectedProduct.id)} onGenerateIdeas={() => setIdeasOpen(true)} />}</div>
      <ContentIdeasDialog product={selectedProduct} open={ideasOpen} onOpenChange={setIdeasOpen} />
    </div>
  );
}
