import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { products } from "../../data/products";
import { ContentIdeasDialog } from "./content-ideas-dialog";

describe("ContentIdeasDialog", () => {
  it("shows five affiliate video angles for the selected product", () => {
    render(<ContentIdeasDialog product={products[0]} open onOpenChange={vi.fn()} />);

    for (const angle of ["Problem-Solution", "Before/After", "Satisfying Demo", "Product Discovery", "Comparison"]) {
      expect(screen.getByText(angle)).toBeInTheDocument();
    }
  });

  it("closes with its close control", () => {
    const onOpenChange = vi.fn();
    render(<ContentIdeasDialog product={products[0]} open onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Close content ideas" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
