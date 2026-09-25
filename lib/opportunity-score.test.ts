import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { calculateOpportunityScore } from "./opportunity-score";

describe("calculateOpportunityScore", () => {
  it("calculates the selected brush's six factors", () => {
    expect(calculateOpportunityScore(products[0]).breakdown).toEqual({
      demand: 24, commission: 18, rating: 9, price: 8, contentPotential: 19, competition: 14,
    });
    expect(calculateOpportunityScore(products[0]).score).toBe(92);
  });

  it("uses product metrics rather than a stored total", () => {
    const score = calculateOpportunityScore({ ...products[0], sold: 0, commission: 0 });
    expect(score.breakdown.demand).toBe(0);
    expect(score.breakdown.commission).toBe(0);
    expect(score.score).toBe(50);
  });
});
