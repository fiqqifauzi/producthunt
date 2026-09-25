import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Select } from "../ui/select";

export type ProductFilters = {
  category: string;
  priceRange: string;
  minSold: number;
  minRating: number;
  minCommission: number;
};

export const defaultFilters: ProductFilters = {
  category: "all",
  priceRange: "20000-200000",
  minSold: 1000,
  minRating: 4.7,
  minCommission: 5,
};

type DiscoveryFiltersProps = {
  value: ProductFilters;
  onChange: (next: ProductFilters) => void;
  onHunt: () => void;
};

export function DiscoveryFilters({ value, onChange, onHunt }: DiscoveryFiltersProps): React.JSX.Element {
  return (
    <form className="discovery-filters" onSubmit={(event) => { event.preventDefault(); onHunt(); }}>
      <div className="filter-fields">
        <Select label="Category" value={value.category} onChange={(event) => onChange({ ...value, category: event.target.value })} options={[
          { value: "all", label: "Semua Kategori" },
          { value: "Rumah Tangga", label: "Rumah Tangga" },
          { value: "Peralatan Dapur", label: "Peralatan Dapur" },
          { value: "Elektronik", label: "Elektronik" },
          { value: "Kecantikan", label: "Kecantikan" },
        ]} />
        <Select label="Price Range" value={value.priceRange} onChange={(event) => onChange({ ...value, priceRange: event.target.value })} options={[
          { value: "all", label: "Semua Harga" },
          { value: "20000-200000", label: "Rp 20.000 - 200.000" },
          { value: "0-50000", label: "Di bawah Rp 50.000" },
          { value: "50000-100000", label: "Rp 50.000 - 100.000" },
          { value: "100000-200000", label: "Rp 100.000 - 200.000" },
          { value: "200000+", label: "Di atas Rp 200.000" },
        ]} />
        <Select label="Min Sold" value={String(value.minSold)} onChange={(event) => onChange({ ...value, minSold: Number(event.target.value) })} options={[
          { value: "0", label: "Semua" },
          { value: "1000", label: "> 1.000" },
          { value: "3000", label: "> 3.000" },
          { value: "5000", label: "> 5.000" },
          { value: "10000", label: "> 10.000" },
        ]} />
        <Select label="Min Rating" value={String(value.minRating)} onChange={(event) => onChange({ ...value, minRating: Number(event.target.value) })} options={[
          { value: "0", label: "Semua" },
          { value: "4.7", label: "≥ 4.7" },
          { value: "4.8", label: "≥ 4.8" },
          { value: "4.9", label: "≥ 4.9" },
        ]} />
        <Select label="Min Commission" value={String(value.minCommission)} onChange={(event) => onChange({ ...value, minCommission: Number(event.target.value) })} options={[
          { value: "0", label: "Semua" },
          { value: "5", label: "≥ 5%" },
          { value: "10", label: "≥ 10%" },
          { value: "15", label: "≥ 15%" },
        ]} />
      </div>
      <Button type="submit" className="hunt-button"><Search size={16} aria-hidden="true" />Hunt Products</Button>
    </form>
  );
}
