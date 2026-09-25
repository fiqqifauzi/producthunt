import { calculateOpportunityScore } from "../../lib/opportunity-score";
import type { Product } from "../../lib/types";
import { Tooltip } from "../ui/tooltip";

const factors = [
  ["Demand", "demand", 25], ["Commission", "commission", 20], ["Rating", "rating", 10],
  ["Price", "price", 10], ["Content Potential", "contentPotential", 20], ["Competition", "competition", 15],
] as const;

export function OpportunityScore({ product, onSelect }: { product: Product; onSelect: (id: string) => void }): React.JSX.Element {
  const result = calculateOpportunityScore(product);
  return (
    <Tooltip content={<>
      <strong>Opportunity Score</strong>
      {factors.map(([label, key, max]) => <span key={key}>{label} {result.breakdown[key]}/{max}</span>)}
      <a href={`#analysis-${product.id}`} onClick={(event) => { event.preventDefault(); onSelect(product.id); }}>View Analysis</a>
    </>}>
      <button type="button" className={`score-pill score-${result.level.toLowerCase()}`} aria-label={`Opportunity score for ${product.name}: ${result.score} ${result.level}`} onClick={() => onSelect(product.id)}>
        <span className="score-number">{result.score}</span><span>{result.level}</span>
      </button>
    </Tooltip>
  );
}
