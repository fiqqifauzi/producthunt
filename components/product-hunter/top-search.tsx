import { Bell, Search } from "lucide-react";

export type TopSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function TopSearch({ query, onQueryChange }: TopSearchProps): React.JSX.Element {
  return (
    <header className="top-search">
      <label className="global-search">
        <Search size={18} aria-hidden="true" />
        <input
          aria-label="Search products, keywords, or categories"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search products, keywords, or categories..."
        />
        <kbd>Ctrl + K</kbd>
      </label>
      <div className="top-search-actions">
        <button className="notification-button" type="button" aria-label="Notifications">
          <Bell size={20} aria-hidden="true" />
        </button>
        <span className="user-avatar" aria-label="User account">F</span>
      </div>
    </header>
  );
}
