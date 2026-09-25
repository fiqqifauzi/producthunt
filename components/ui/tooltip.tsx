"use client";

import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Position = { top: number; left: number };

export function Tooltip({ children, content }: { children: ReactElement<ComponentProps<"button">>; content: ReactNode }): React.JSX.Element {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextFocus = useRef(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
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

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const inside = (target: EventTarget | null) => target instanceof Node && (anchorRef.current?.contains(target) || panelRef.current?.contains(target));
  const reveal = () => { cancelClose(); if (!open) { setPosition(null); setOpen(true); } };
  const scheduleClose = (relatedTarget: EventTarget | null) => {
    if (inside(relatedTarget)) return;
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (!inside(document.activeElement)) setOpen(false);
    }, 120);
  };
  const blurOutside = (relatedTarget: EventTarget | null) => {
    if (!inside(relatedTarget)) { cancelClose(); setOpen(false); }
  };
  const trigger = () => anchorRef.current?.querySelector<HTMLElement>("button");
  const dismiss = () => {
    cancelClose();
    setOpen(false);
    const button = trigger();
    if (button && document.activeElement !== button) {
      suppressNextFocus.current = true;
      button.focus();
    }
  };
  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape" && open) { event.preventDefault(); dismiss(); }
    if (event.key === "Tab" && !event.shiftKey && open) {
      const action = panelRef.current?.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
      if (action) { event.preventDefault(); action.focus(); }
    }
  };
  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
    if (event.key !== "Tab") return;
    if (event.shiftKey) { event.preventDefault(); trigger()?.focus(); return; }
    const focusable = [...document.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")];
    const current = focusable.indexOf(trigger()!);
    const next = focusable.slice(current + 1).find((element) => !panelRef.current?.contains(element));
    if (next) { event.preventDefault(); setOpen(false); next.focus(); }
  };

  return <>
    <span ref={anchorRef} className="tooltip-anchor" onMouseEnter={reveal} onMouseLeave={(event) => scheduleClose(event.relatedTarget)} onFocus={() => { if (suppressNextFocus.current) suppressNextFocus.current = false; else reveal(); }} onBlur={(event) => blurOutside(event.relatedTarget)} onKeyDown={onTriggerKeyDown}>
      {cloneElement(children, { "aria-describedby": open ? id : undefined, "aria-haspopup": "dialog", "aria-expanded": open, "aria-controls": open ? id : undefined })}
    </span>
    {mounted && open && createPortal(
      <span ref={panelRef} id={id} className="tooltip-panel" role="dialog" aria-label="Opportunity score details" aria-modal="false" style={{ top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? "visible" : "hidden" }} onMouseEnter={cancelClose} onMouseLeave={(event) => scheduleClose(event.relatedTarget)} onBlur={(event) => blurOutside(event.relatedTarget)} onKeyDown={onPanelKeyDown}>
        {content}
      </span>, document.body,
    )}
  </>;
}
