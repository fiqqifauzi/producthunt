import type { Product, ProductQuery } from "./types";

export function filterProducts(products: Product[], query: ProductQuery): Product[] {
  const search = query.search?.trim().toLocaleLowerCase("id-ID") ?? "";
  return products.filter((product) => {
    if (search && !`${product.name} ${product.category}`.toLocaleLowerCase("id-ID").includes(search)) return false;
    if (query.category && query.category !== "all" && product.category !== query.category) return false;
    if (product.sold < (query.minSold ?? 0) || product.rating < (query.minRating ?? 0) || product.commission < (query.minCommission ?? 0)) return false;
    const range = query.priceRange;
    if (!range || range === "all") return true;
    if (range.endsWith("+")) return product.price >= Number(range.slice(0, -1));
    const [min, max] = range.split("-").map(Number);
    return Number.isFinite(min) && Number.isFinite(max) && product.price >= min && product.price <= max;
  });
}
