import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductHunterDashboard } from "./product-hunter-dashboard";

describe("ProductHunterDashboard", () => {
  it("renders the dashboard navigation and discovery entry point", () => {
    render(<ProductHunterDashboard />);

    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search products, keywords, or categories...")).toBeInTheDocument();
    expect(screen.getByText("DISCOVERY")).toBeInTheDocument();
    expect(screen.getByText("Find products worth promoting")).toBeInTheDocument();
  });
});
