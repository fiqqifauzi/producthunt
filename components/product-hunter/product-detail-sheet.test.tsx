import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { products } from "../../data/products";
import { ProductDetailSheet } from "./product-detail-sheet";

describe("ProductDetailSheet", () => {
  it("shows the selected product analysis and exposes product actions", () => {
    const onToggleWatchlist = vi.fn();
    render(<ProductDetailSheet product={products[0]} open onOpenChange={vi.fn()} watchlisted={false} onToggleWatchlist={onToggleWatchlist} onGenerateIdeas={vi.fn()} />);

    expect(screen.getByRole("complementary", { name: /Sikat Pembersih Elektrik 3 in 1/i })).toBeInTheDocument();
    expect(screen.getByText("Opportunity Score")).toBeInTheDocument();
    expect(screen.getByText("Demand")).toBeInTheDocument();
    expect(screen.getByText("Why this product?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add to Watchlist" }));
    expect(onToggleWatchlist).toHaveBeenCalledOnce();
  });

  it("closes with Escape", () => {
    const onOpenChange = vi.fn();
    render(<ProductDetailSheet product={products[0]} open onOpenChange={onOpenChange} watchlisted={false} onToggleWatchlist={vi.fn()} onGenerateIdeas={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole("complementary"), { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
