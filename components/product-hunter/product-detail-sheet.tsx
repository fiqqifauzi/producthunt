"use client";

import { ExternalLink, Heart, Star, X } from "lucide-react";
import { calculateOpportunityScore } from "../../lib/opportunity-score";
import type { Product } from "../../lib/types";

const labels = [
  ["Demand", "demand", 25],
  ["Commission", "commission", 20],
  ["Rating", "rating", 10],
  ["Price", "price", 10],
  ["Content Potential", "contentPotential", 20],
  ["Competition", "competition", 15],
] as const;

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
const formatSold = (value: number) => `${(value / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}K`;

export function ProductDetailSheet({ product, open, onOpenChange, watchlisted, onToggleWatchlist, onGenerateIdeas }: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchlisted: boolean;
  onToggleWatchlist: () => void;
  onGenerateIdeas: () => void;
}): React.JSX.Element | null {
  if (!open) return null;
  const result = calculateOpportunityScore(product);
  const commissionPerOrder = Math.round(product.price * product.commission / 100);

  return <aside className="product-detail-sheet" aria-label={product.name} role="complementary" tabIndex={-1} onKeyDown={(event) => {
    if (event.key === "Escape") onOpenChange(false);
  }}>
    <div className="detail-heading"><div><h2>{product.name}</h2><p>Source: <span className="source-shopee">Shopee</span></p></div><button type="button" className="detail-close" aria-label="Close product details" onClick={() => onOpenChange(false)}><X size={20} /></button></div>
    <div className={`detail-product-image thumb-${product.image}`} aria-label={`${product.name} product image`} role="img" />
    <div className="detail-price-row"><strong>{formatRupiah(product.price)}</strong><span>-20%</span><del>{formatRupiah(Math.round(product.price * 1.25))}</del></div>
    <div className="detail-meta"><span><Star size={14} fill="currentColor" /> {product.rating.toFixed(1)} (12.4K ulasan)</span><span>{formatSold(product.sold)} terjual</span></div>
    <div className="detail-badges"><span>Produk Star</span><span>Mall</span></div>
    <section className="commission-card"><span>Commission</span><strong>{product.commission}% <small>≈ {formatRupiah(commissionPerOrder)} / order</small></strong></section>
    <section className="analysis-card"><h3>Opportunity Score</h3><div className="score-analysis"><div className="score-ring"><strong>{result.score}</strong><span>/100</span><b>{result.level}</b></div><div className="score-bars">{labels.map(([label, key, max]) => <div key={key}><span>{label}</span><i><b style={{ width: `${(result.breakdown[key] / max) * 100}%` }} /></i><em>{result.breakdown[key]}/{max}</em></div>)}</div></div>
      <div className="why-product"><h3>Why this product?</h3><ul><li>Permintaan tinggi dengan penjualan stabil</li><li>Komisi tinggi di kategori {product.category.toLowerCase()}</li><li>Mudah dibuat konten demo (before/after)</li><li>Visual menarik dan satisfying</li><li>Kompetisi masih dalam batas wajar</li></ul></div>
    </section>
    <div className="detail-actions"><button type="button" className="watchlist-button" onClick={onToggleWatchlist}><Heart size={17} fill={watchlisted ? "currentColor" : "none"} />{watchlisted ? "In Watchlist" : "Add to Watchlist"}</button><a href={product.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={17} />Lihat di Shopee</a></div>
    <button type="button" className="generate-ideas" onClick={onGenerateIdeas}>Generate Content Ideas</button>
  </aside>;
}
