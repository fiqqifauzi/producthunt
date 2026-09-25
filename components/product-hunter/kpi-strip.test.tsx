import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiStrip } from "./kpi-strip";

describe("KpiStrip", () => {
  it("renders each positive trend with an icon and readable percentage", () => {
    const { container } = render(<KpiStrip productsScanned={12480} highOpportunity={1284} trendingProducts={327} averageOpportunity={86.4} />);

    expect(container.querySelectorAll(".kpi-change svg")).toHaveLength(4);
    expect(container.textContent).not.toContain("↑");
    for (const change of ["12%", "28%", "41%", "6%"]) {
      expect(screen.getByText(change)).toBeInTheDocument();
    }
  });
});
