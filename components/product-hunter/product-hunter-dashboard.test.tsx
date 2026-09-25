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

  it("keeps every navigation link named when mobile labels are hidden", () => {
    const mobileStyle = document.createElement("style");
    mobileStyle.textContent = ".navigation-item-label, .coming-soon { display: none; }";
    document.head.appendChild(mobileStyle);

    try {
      render(<ProductHunterDashboard />);

      for (const name of ["Discover", "Trending", "Watchlist", "Niche Hunter", "Winning Products", "AI Content", "Performance", "Settings"]) {
        expect(screen.getByRole("link", { name })).toBeInTheDocument();
      }
    } finally {
      mobileStyle.remove();
    }
  });
});
