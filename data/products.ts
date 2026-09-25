import type { Product } from "../lib/types";

const source = (name: string) => `https://shopee.co.id/search?keyword=${encodeURIComponent(name)}`;

export const products: Product[] = [
  { id: "brush", name: "Sikat Pembersih Elektrik 3 in 1", category: "Rumah Tangga", price: 79000, sold: 32400, rating: 4.9, commission: 12, velocity: 24, addedAt: "2026-09-25", priceFit: 8, contentPotential: 19, competition: 14, image: "brush", watched: false },
  { id: "rack", name: "Rak Dapur Stainless 2 Tingkat", category: "Rumah Tangga", price: 49000, sold: 28100, rating: 4.9, commission: 10, velocity: 18, addedAt: "2026-09-24", priceFit: 9, contentPotential: 20, competition: 14, image: "rack", watched: true },
  { id: "chopper", name: "Chopper Elektrik 2L Premium", category: "Peralatan Dapur", price: 89000, sold: 17600, rating: 4.8, commission: 9, velocity: 31, addedAt: "2026-09-23", priceFit: 10, contentPotential: 20, competition: 15, image: "chopper" },
  { id: "led", name: "Lampu LED Strip 5 Meter RGB", category: "Dekorasi Rumah", price: 39000, sold: 15200, rating: 4.8, commission: 11, velocity: 27, addedAt: "2026-09-22", priceFit: 9, contentPotential: 19, competition: 13, image: "led" },
  { id: "tripod", name: "Tripod HP 1.7M + Remote", category: "Elektronik", price: 52000, sold: 14800, rating: 4.7, commission: 8, velocity: 22, addedAt: "2026-09-21", priceFit: 9, contentPotential: 20, competition: 15, image: "tripod" },
  { id: "boxes", name: "Kotak Penyimpanan Set 3 Pcs", category: "Rumah Tangga", price: 27000, sold: 13900, rating: 4.8, commission: 9, velocity: 19, addedAt: "2026-09-20", priceFit: 9, contentPotential: 18, competition: 13, image: "boxes" },
  { id: "sunscreen", name: "Sunscreen SPF 50+ 50ml", category: "Kecantikan", price: 67000, sold: 12600, rating: 4.8, commission: 15, velocity: 35, addedAt: "2026-09-19", priceFit: 8, contentPotential: 14, competition: 11, image: "sunscreen" },
  { id: "containers", name: "Food Container Set 5 Pcs", category: "Rumah Tangga", price: 45000, sold: 11200, rating: 4.7, commission: 10, velocity: 16, addedAt: "2026-09-18", priceFit: 9, contentPotential: 16, competition: 12, image: "containers" },
].map((product) => ({ ...product, sourceUrl: source(product.name) }));
