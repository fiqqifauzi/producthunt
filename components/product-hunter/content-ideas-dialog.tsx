"use client";

import { Sparkles, X } from "lucide-react";
import type { Product } from "../../lib/types";

const ideas = [
  ["Problem-Solution", "Capek bersihin sudut rumah yang sulit dijangkau? Coba trik ini."],
  ["Before/After", "Lihat transformasi noda membandel hanya dalam beberapa detik."],
  ["Satisfying Demo", "Suara dan hasil bersihnya bikin susah berhenti nonton."],
  ["Product Discovery", "Aku baru menemukan alat kecil yang bikin pekerjaan rumah jauh lebih cepat."],
  ["Comparison", "Alat manual vs elektrik: mana yang benar-benar menghemat waktu?"],
] as const;

export function ContentIdeasDialog({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (open: boolean) => void }): React.JSX.Element | null {
  if (!open) return null;
  return <div className="content-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onOpenChange(false); }}>
    <section className="content-ideas-dialog" role="dialog" aria-modal="true" aria-labelledby="content-ideas-title" onKeyDown={(event) => { if (event.key === "Escape") onOpenChange(false); }} tabIndex={-1}>
      <header><div><span><Sparkles size={17} /> AI Content Ideas</span><h2 id="content-ideas-title">Ideas for {product.name}</h2></div><button type="button" aria-label="Close content ideas" onClick={() => onOpenChange(false)}><X size={20} /></button></header>
      <p>Siap untuk video affiliate Shorts, Reels, atau TikTok.</p>
      <div className="idea-list">{ideas.map(([angle, hook]) => <article key={angle}><h3>{angle}</h3><p>{hook}</p></article>)}</div>
    </section>
  </div>;
}
