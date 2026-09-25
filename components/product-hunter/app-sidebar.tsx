import {
  ChartNoAxesColumnIncreasing,
  Flame,
  Heart,
  House,
  Search,
  Settings,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  comingSoon?: boolean;
};

const groups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "DISCOVERY",
    items: [
      { label: "Discover", href: "#discover", icon: House, active: true },
      { label: "Trending", href: "#trending", icon: Flame },
      { label: "Watchlist", href: "#watchlist", icon: Heart },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { label: "Niche Hunter", href: "#niche-hunter", icon: Target, comingSoon: true },
      { label: "Winning Products", href: "#winning-products", icon: Trophy, comingSoon: true },
    ],
  },
  {
    label: "CONTENT",
    items: [{ label: "AI Content", href: "#ai-content", icon: Sparkles, comingSoon: true }],
  },
  {
    label: "ANALYTICS",
    items: [{ label: "Performance", href: "#performance", icon: ChartNoAxesColumnIncreasing, comingSoon: true }],
  },
];

export function AppSidebar(): React.JSX.Element {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true"><Search size={29} strokeWidth={2.2} /></span>
        <span className="brand-name">Product<br />Hunter</span>
      </div>
      <nav aria-label="Main navigation" className="sidebar-navigation">
        {groups.map((group) => (
          <div className="navigation-group" key={group.label}>
            <div className="navigation-group-label">{group.label}</div>
            <div className="navigation-items">
              {group.items.map(({ label, href, icon: Icon, active, comingSoon }) => (
                <a className={`navigation-item${active ? " is-active" : ""}`} href={href} aria-label={label} aria-current={active ? "page" : undefined} key={label}>
                  <Icon size={19} aria-hidden="true" />
                  <span className="navigation-item-label">{label}</span>
                  {comingSoon && <span className="coming-soon">Soon</span>}
                </a>
              ))}
            </div>
          </div>
        ))}
        <div className="settings-navigation">
          <a className="navigation-item" href="#settings" aria-label="Settings">
            <Settings size={19} aria-hidden="true" />
            <span className="navigation-item-label">Settings</span>
          </a>
        </div>
      </nav>
    </aside>
  );
}
