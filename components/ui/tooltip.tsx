"use client";

import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Position = { top: number; left: number };

export function Tooltip({ children, content }: { children: ReactElement<{ "aria-describedby"?: string }>; content: ReactNode }): React.JSX.Element {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => setMounted(true), []);
  useLayoutEffect(() => {
    if (!open || !mounted) return;
    const updatePosition = () => {
      const anchor = anchorRef.current?.getBoundingClientRect();
      const panel = panelRef.current?.getBoundingClientRect();
      if (!anchor || !panel) return;
      const below = anchor.bottom + panel.height + 4 <= window.innerHeight - 8;
      setPosition({
        top: below ? anchor.bottom + 4 : Math.max(8, anchor.top - panel.height - 4),
        left: Math.max(8, Math.min(anchor.right - panel.width, window.innerWidth - panel.width - 8)),
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, mounted]);

  const reveal = () => { setPosition(null); setOpen(true); };
  const outside = (relatedTarget: EventTarget | null) => {
    if (!(relatedTarget instanceof Node) || (!anchorRef.current?.contains(relatedTarget) && !panelRef.current?.contains(relatedTarget))) setOpen(false);
  };

  return <>
    <span ref={anchorRef} className="tooltip-anchor" onMouseEnter={reveal} onMouseLeave={(event) => outside(event.relatedTarget)} onFocus={reveal} onBlur={(event) => outside(event.relatedTarget)}>
      {cloneElement(children, { "aria-describedby": open ? id : undefined })}
    </span>
    {mounted && open && createPortal(
      <span ref={panelRef} id={id} className="tooltip-panel" role="tooltip" style={{ top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? "visible" : "hidden" }} onMouseLeave={(event) => outside(event.relatedTarget)} onBlur={(event) => outside(event.relatedTarget)}>
        {content}
      </span>, document.body,
    )}
  </>;
}
