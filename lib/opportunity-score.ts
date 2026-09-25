import type { OpportunityBreakdown, OpportunityScoreResult, Product } from "./types";

const bounded = (value: number, max: number) => Math.max(0, Math.min(max, value));

export function calculateOpportunityScore(product: Product): OpportunityScoreResult {
  const breakdown: OpportunityBreakdown = {
    demand: product.sold <= 0 ? 0 : bounded(Math.floor(14 + product.sold / 3240), 25),
    commission: bounded(Math.round(product.commission * 1.5), 20),
    rating: bounded(Math.floor(product.rating * 2), 10),
    price: bounded(product.priceFit, 10),
    contentPotential: bounded(product.contentPotential, 20),
    competition: bounded(product.competition, 15),
  };
  const score = Object.values(breakdown).reduce((sum, factor) => sum + factor, 0);
  return { score, level: score >= 80 ? "HIGH" : score >= 60 ? "MEDIUM" : "LOW", breakdown };
}
