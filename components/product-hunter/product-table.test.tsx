import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { products } from "../../data/products";
import { ProductTable } from "./product-table";

describe("ProductTable", () => {
  it("shows the screenshot order and selected product", () => {
    render(<ProductTable products={products} selectedId="brush" onSelect={vi.fn()} onToggleWatchlist={vi.fn()} />);
    expect(screen.getByText("Sikat Pembersih Elektrik 3 in 1")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Sikat Pembersih/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("row").slice(1).map((row) => within(row).getByTestId("product-name").textContent)).toEqual([
      "Sikat Pembersih Elektrik 3 in 1", "Rak Dapur Stainless 2 Tingkat", "Chopper Elektrik 2L Premium", "Lampu LED Strip 5 Meter RGB",
      "Tripod HP 1.7M + Remote", "Kotak Penyimpanan Set 3 Pcs", "Sunscreen SPF 50+ 50ml", "Food Container Set 5 Pcs",
    ]);
  });

  it("sorts by the selected tab and opens all six score factors", () => {
    render(<ProductTable products={products} selectedId="brush" onSelect={vi.fn()} onToggleWatchlist={vi.fn()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Trending" }));
    expect(within(screen.getAllByRole("row")[1]).getByTestId("product-name")).toHaveTextContent("Sunscreen SPF 50+ 50ml");
    fireEvent.focus(screen.getByRole("button", { name: /Opportunity score for Sikat Pembersih/i }));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Demand 24/25");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Competition 14/15");
    expect(screen.getByRole("link", { name: "View Analysis" })).toBeInTheDocument();
  });

  it("provides row selection, watchlist, column visibility, and pagination", () => {
    const onSelect = vi.fn();
    const onToggleWatchlist = vi.fn();
    render(<ProductTable products={[...products, ...products.map((product) => ({ ...product, id: `${product.id}-copy` }))]} selectedId="brush" onSelect={onSelect} onToggleWatchlist={onToggleWatchlist} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Select Rak Dapur Stainless 2 Tingkat" })[0]);
    expect(onSelect).toHaveBeenCalledWith("rack");
    fireEvent.click(screen.getAllByRole("button", { name: "Add Sikat Pembersih Elektrik 3 in 1 to watchlist" })[0]);
    expect(onToggleWatchlist).toHaveBeenCalledWith("brush");
    fireEvent.click(screen.getByRole("button", { name: "Choose columns" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Velocity" }));
    expect(screen.queryByRole("columnheader", { name: /Velocity/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("Showing 9–16 of 16 products")).toBeInTheDocument();
  });
});
