import { act, fireEvent, render, screen, within } from "@testing-library/react";
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
    expect(screen.getByRole("dialog", { name: "Opportunity score details" })).toHaveTextContent("Demand 24/25");
    expect(screen.getByRole("dialog", { name: "Opportunity score details" })).toHaveTextContent("Competition 14/15");
    expect(screen.getByRole("link", { name: "View Analysis" })).toBeInTheDocument();
  });

  it("sorts Latest by the product date even when score order differs", () => {
    const dated = [
      { ...products[0], addedAt: "2026-09-01" },
      { ...products[1], addedAt: "2026-10-02" },
      { ...products[2], addedAt: "2026-09-20" },
    ];
    render(<ProductTable products={dated} selectedId="brush" onSelect={vi.fn()} onToggleWatchlist={vi.fn()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Latest" }));
    expect(screen.getAllByRole("row").slice(1).map((row) => within(row).getByTestId("product-name").textContent)).toEqual([
      "Rak Dapur Stainless 2 Tingkat", "Chopper Elektrik 2L Premium", "Sikat Pembersih Elektrik 3 in 1",
    ]);
  });

  it("associates each score trigger with a unique visible tooltip outside the scroll area", () => {
    render(<ProductTable products={products} selectedId="brush" onSelect={vi.fn()} onToggleWatchlist={vi.fn()} />);
    const triggers = screen.getAllByRole("button", { name: /Opportunity score for/ });
    const scrollArea = screen.getByRole("table").parentElement;
    fireEvent.focus(triggers[0]);
    const firstTooltip = screen.getByRole("dialog", { name: "Opportunity score details" });
    expect(triggers[0]).toHaveAttribute("aria-describedby", firstTooltip.id);
    expect(scrollArea).not.toContainElement(firstTooltip);
    fireEvent.blur(triggers[0]);
    fireEvent.focus(triggers[7]);
    const lastTooltip = screen.getByRole("dialog", { name: "Opportunity score details" });
    expect(triggers[7]).toHaveAttribute("aria-describedby", lastTooltip.id);
    expect(lastTooltip.id).not.toBe(firstTooltip.id);
    expect(scrollArea).not.toContainElement(lastTooltip);
  });

  it("moves keyboard focus into View Analysis and activates it", () => {
    const onSelect = vi.fn();
    render(<ProductTable products={products} selectedId="brush" onSelect={onSelect} onToggleWatchlist={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: /Opportunity score for Sikat Pembersih/i });
    act(() => trigger.focus());
    fireEvent.keyDown(trigger, { key: "Tab" });
    const analysis = screen.getByRole("link", { name: "View Analysis" });
    expect(analysis).toHaveFocus();
    fireEvent.click(analysis, { detail: 0 }); // Keyboard-activated links dispatch a click with detail 0.
    expect(onSelect).toHaveBeenCalledWith("brush");
  });

  it("dismisses score details with Escape and restores trigger focus", () => {
    render(<ProductTable products={products} selectedId="brush" onSelect={vi.fn()} onToggleWatchlist={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: /Opportunity score for Sikat Pembersih/i });
    act(() => trigger.focus());
    const analysis = screen.getByRole("link", { name: "View Analysis" });
    analysis.focus();
    fireEvent.keyDown(analysis, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Opportunity score details" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps score details open while the pointer crosses to the popover", () => {
    vi.useFakeTimers();
    try {
      render(<ProductTable products={products} selectedId="brush" onSelect={vi.fn()} onToggleWatchlist={vi.fn()} />);
      const trigger = screen.getByRole("button", { name: /Opportunity score for Sikat Pembersih/i });
      const anchor = trigger.parentElement!;
      fireEvent.mouseEnter(anchor);
      const details = screen.getByRole("dialog", { name: "Opportunity score details" });
      fireEvent.mouseLeave(anchor, { relatedTarget: document.body });
      expect(details).toBeInTheDocument();
      fireEvent.mouseEnter(details);
      act(() => vi.advanceTimersByTime(200));
      expect(details).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
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
