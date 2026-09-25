import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DiscoveryFilters, type ProductFilters } from "./discovery-filters";

const defaultFilters: ProductFilters = {
  category: "all",
  priceRange: "20000-200000",
  minSold: 1000,
  minRating: 4.7,
  minCommission: 5,
};

describe("DiscoveryFilters", () => {
  it("shows each filter and submits the current criteria", () => {
    const onHunt = vi.fn();
    render(<DiscoveryFilters value={defaultFilters} onChange={vi.fn()} onHunt={onHunt} />);

    for (const label of ["Category", "Price Range", "Min Sold", "Min Rating", "Min Commission"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByLabelText("Category")).toHaveValue("all");
    expect(screen.getByLabelText("Price Range")).toHaveValue("20000-200000");
    fireEvent.click(screen.getByRole("button", { name: "Hunt Products" }));
    expect(onHunt).toHaveBeenCalledOnce();
  });

  it("reports a changed field without discarding other controlled values", () => {
    const onChange = vi.fn();
    render(<DiscoveryFilters value={defaultFilters} onChange={onChange} onHunt={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Min Sold"), { target: { value: "3000" } });
    expect(onChange).toHaveBeenCalledWith({ ...defaultFilters, minSold: 3000 });
  });
});
