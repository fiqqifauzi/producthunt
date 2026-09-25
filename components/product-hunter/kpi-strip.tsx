import { Flame, Package, Star, TrendingUp } from "lucide-react";

type KpiStripProps = {
  productsScanned: number;
  highOpportunity: number;
  trendingProducts: number;
  averageOpportunity: number;
};

const integer = new Intl.NumberFormat("id-ID");
const decimal = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function KpiStrip({ productsScanned, highOpportunity, trendingProducts, averageOpportunity }: KpiStripProps): React.JSX.Element {
  const cards = [
    { label: "Products Scanned", value: integer.format(productsScanned), change: "12%", note: "Dari pencarian terakhir", icon: Package, tone: "blue" },
    { label: "High Opportunity", value: integer.format(highOpportunity), change: "28%", note: "Score ≥ 80", icon: Flame, tone: "orange" },
    { label: "Trending Products", value: integer.format(trendingProducts), change: "41%", note: "Pertumbuhan penjualan", icon: TrendingUp, tone: "green" },
    { label: "Average Opportunity", value: decimal.format(averageOpportunity), change: "6%", note: "Dari semua produk", icon: Star, tone: "amber" },
  ] as const;

  return (
    <section className="kpi-strip" aria-label="Product discovery summary">
      {cards.map(({ label, value, change, note, icon: Icon, tone }) => (
        <article className={`kpi-card kpi-${tone}`} key={label}>
          <div className="kpi-icon" aria-hidden="true"><Icon size={26} strokeWidth={2.3} /></div>
          <div className="kpi-content">
            <div className="kpi-value-line"><strong>{value}</strong><span className="kpi-change">↑ {change}</span></div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-note">{note}</div>
          </div>
        </article>
      ))}
    </section>
  );
}
