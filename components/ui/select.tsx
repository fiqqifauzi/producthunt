import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
};

export function Select({ label, options, id, ...props }: SelectProps): React.JSX.Element {
  const selectId = id ?? `filter-${label.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <div className="filter-field">
      <label htmlFor={selectId}>{label}</label>
      <div className="select-wrap">
        <select id={selectId} {...props}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </div>
    </div>
  );
}
