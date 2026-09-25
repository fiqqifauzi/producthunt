export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  rating: number;
  commission: number;
  velocity: number;
  addedAt: string;
  priceFit: number;
  contentPotential: number;
  competition: number;
  image: string;
  watched?: boolean;
  sourceUrl: string;
};

export type OpportunityBreakdown = {
  demand: number;
  commission: number;
  rating: number;
  price: number;
  contentPotential: number;
  competition: number;
};

export type OpportunityScoreResult = {
  score: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  breakdown: OpportunityBreakdown;
};

export type ProductQuery = {
  search?: string;
  category?: string;
  priceRange?: string;
  minSold?: number;
  minRating?: number;
  minCommission?: number;
};
