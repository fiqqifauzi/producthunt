import { describe, expect, it } from "vitest";
import { products } from "../data/products";
import { filterProducts } from "./product-filters";

describe("filterProducts", () => {
  it("combines search and numeric criteria", () => {
    expect(filterProducts(products, { search: "sikat", category: "all", minSold: 1000 })).toHaveLength(1);
    expect(filterProducts(products, { search: "sikat", category: "all", minSold: 1000 })[0].id).toBe("brush");
  });

  it("applies category, price, rating, and commission together", () => {
    const matches = filterProducts(products, {
      category: "Kecantikan", priceRange: "50000-100000", minRating: 4.8, minCommission: 15,
    });
    expect(matches.map((product) => product.id)).toEqual(["sunscreen"]);
  });
});
