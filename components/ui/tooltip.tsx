"use client";

import { useState, type ReactNode } from "react";

export function Tooltip({ children, content }: { children: ReactNode; content: ReactNode }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <span className="tooltip-anchor" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      {children}
      {open && <span className="tooltip-panel" role="tooltip">{content}</span>}
    </span>
  );
}
