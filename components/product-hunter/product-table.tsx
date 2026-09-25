"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowUpDown, Boxes, BrushCleaning, Camera, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Container, CookingPot, ExternalLink, Heart, Lamp, Package, SlidersHorizontal, Star } from "lucide-react";
import { columnVisibilityFeature, createColumnHelper, createPaginatedRowModel, createSortedRowModel, rowPaginationFeature, rowSortingFeature, tableFeatures, useTable } from "@tanstack/react-table";
import { calculateOpportunityScore } from "../../lib/opportunity-score";
import type { Product } from "../../lib/types";
import { OpportunityScore } from "./opportunity-score";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnVisibilityFeature,
});
const helper = createColumnHelper<typeof features, Product>();
const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
const formatSold = (value: number) => `${(value / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}K`;
const thumbnailIcons = { brush: BrushCleaning, rack: Container, chopper: CookingPot, led: Lamp, tripod: Camera, boxes: Boxes, sunscreen: Package, containers: Container };
const tabs = [
  { label: "Top Opportunities", id: "score", desc: true },
  { label: "Trending", id: "velocity", desc: true },
  { label: "Latest", id: "addedAt", desc: true },
  { label: "Highest Commission", id: "commission", desc: true },
] as const;
const sortable = ["score", "sold", "commission", "velocity"] as const;

export function ProductTable({ products, selectedId, onSelect, onToggleWatchlist }: {
  products: Product[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
}): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [watched, setWatched] = useState<Record<string, boolean>>({});
  const columns = useMemo(() => helper.columns([
    helper.display({ id: "select", header: () => <span className="table-check-placeholder" aria-hidden="true" />, cell: ({ row }) => <input type="checkbox" aria-label={`Select ${row.original.name}`} checked={row.original.id === selectedId} onChange={() => onSelect(row.original.id)} /> }),
    helper.accessor("name", { id: "name", header: "Product", cell: ({ row }) => {
      const product = row.original;
      const Icon = thumbnailIcons[product.image as keyof typeof thumbnailIcons] ?? Package;
      return <button type="button" className="product-identity" aria-label={`Select ${product.name}`} onClick={() => onSelect(product.id)}><span className={`product-thumb thumb-${product.image}`}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></span><span data-testid="product-name">{product.name}</span></button>;
    } }),
    helper.accessor("category", { id: "category", header: "Category", cell: ({ getValue }) => <span className={`category-tag ${getValue() === "Kecantikan" ? "category-beauty" : ""}`}>{getValue()}</span> }),
    helper.accessor("price", { id: "price", header: "Price", cell: ({ getValue }) => formatRupiah(getValue()) }),
    helper.accessor("sold", { id: "sold", header: "Sold", cell: ({ getValue }) => formatSold(getValue()) }),
    helper.accessor("rating", { id: "rating", header: "Rating", cell: ({ getValue }) => <span className="rating-cell"><Star size={13} fill="currentColor" aria-hidden="true" />{getValue().toFixed(1)}</span> }),
    helper.accessor("commission", { id: "commission", header: "Commission", cell: ({ row }) => <span className="commission-cell"><strong>{row.original.commission}%</strong><small>≈ {formatRupiah(Math.round(row.original.price * row.original.commission / 100))}</small></span> }),
    helper.accessor("velocity", { id: "velocity", header: () => <>Velocity <CircleHelp size={12} aria-label="Sales growth" /></>, cell: ({ getValue }) => <span className="velocity-cell"><ArrowUp size={13} aria-hidden="true" />{getValue()}%</span> }),
    helper.accessor((product) => calculateOpportunityScore(product).score, { id: "score", header: "Score", cell: ({ row }) => <OpportunityScore product={row.original} onSelect={onSelect} /> }),
    helper.accessor("addedAt", { id: "addedAt", header: "Latest", enableHiding: false }),
    helper.display({ id: "action", header: "Action", cell: ({ row }) => {
      const product = row.original;
      const isWatched = watched[product.id] ?? product.watched ?? false;
      return <span className="row-actions"><button type="button" aria-label={`${isWatched ? "Remove" : "Add"} ${product.name} ${isWatched ? "from" : "to"} watchlist`} className={isWatched ? "is-watched" : ""} onClick={() => { setWatched((current) => ({ ...current, [product.id]: !isWatched })); onToggleWatchlist(product.id); }}><Heart size={16} fill={isWatched ? "currentColor" : "none"} /></button><a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Search ${product.name} on Shopee`}><ExternalLink size={15} /></a></span>;
    } }),
  ]), [onSelect, onToggleWatchlist, selectedId, watched]);
  const table = useTable({ features, data: products, columns, getRowId: (product) => product.id, initialState: { sorting: [{ id: "score", desc: true }], pagination: { pageIndex: 0, pageSize: 8 }, columnVisibility: { addedAt: false } } });
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const selectedSort = table.state.sorting[0]?.id ?? "score";
  const chooseSort = (id: string, desc = true) => { table.setSorting([{ id, desc }]); table.firstPage(); };
  const visibleColumns = table.getVisibleLeafColumns();
  const start = products.length === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min(products.length, (pageIndex + 1) * pageSize);

  return <section className="product-table-section" aria-label="Product opportunities">
    <div className="table-toolbar"><div className="table-tabs" role="tablist" aria-label="Product rankings">{tabs.map((tab) => <button key={tab.label} type="button" role="tab" aria-selected={activeTab === tab.label} className={activeTab === tab.label ? "active" : ""} onClick={() => { setActiveTab(tab.label); chooseSort(tab.id, tab.desc); }}>{tab.label}</button>)}</div><div className="table-tools"><span>Sort by:</span><label className="table-sort-select"><span className="sr-only">Sort products by</span><select value={selectedSort} onChange={(event) => { const selected = tabs.find((tab) => tab.id === event.target.value); setActiveTab(selected?.label ?? ""); chooseSort(event.target.value); }}><option value="score">Opportunity Score</option><option value="sold">Sold</option><option value="commission">Commission</option><option value="velocity">Velocity</option><option value="addedAt">Latest</option><option value="price">Price</option></select><ChevronDown size={14} aria-hidden="true" /></label><div className="column-menu-wrap"><button type="button" className="column-menu-trigger" aria-label="Choose columns" aria-expanded={columnsOpen} onClick={() => setColumnsOpen(!columnsOpen)}><SlidersHorizontal size={15} /></button>{columnsOpen && <div className="column-menu" role="group" aria-label="Visible columns">{visibleColumns.concat(table.getAllLeafColumns().filter((column) => !column.getIsVisible())).filter((column) => column.getCanHide()).map((column) => <label key={column.id}><input type="checkbox" checked={column.getIsVisible()} onChange={() => column.toggleVisibility()} />{column.id === "score" ? "Score" : column.id[0].toUpperCase() + column.id.slice(1)}</label>)}</div>}</div></div></div>
    <div className="table-scroll"><table className="product-comparison"><colgroup>{visibleColumns.map((column) => <col key={column.id} className={`col-${column.id}`} />)}</colgroup><thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => <th key={header.id} scope="col">{header.isPlaceholder ? null : <>{sortable.includes(header.id as typeof sortable[number]) ? <button type="button" onClick={() => { setActiveTab(""); header.column.toggleSorting(); }}><table.FlexRender header={header} /><ArrowUpDown size={11} aria-hidden="true" /></button> : <table.FlexRender header={header} />}</>}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map((row) => <tr key={row.id} aria-selected={row.original.id === selectedId} className={row.original.id === selectedId ? "selected-row" : ""} onClick={() => onSelect(row.original.id)}>{row.getVisibleCells().map((cell) => <td key={cell.id} onClick={(event) => { if (event.target instanceof Element && event.target.closest("button, a, input")) event.stopPropagation(); }}><table.FlexRender cell={cell} /></td>)}</tr>)}</tbody></table>{products.length === 0 && <p className="table-empty">No products match your filters.</p>}</div>
    <div className="table-footer"><span>Showing {start}–{end} of {products.length} products</span><nav className="pagination" aria-label="Product pages"><button type="button" aria-label="Previous page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft size={16} /></button>{Array.from({ length: Math.min(pageCount, 5) }, (_, index) => <button key={index} type="button" aria-label={`Page ${index + 1}`} aria-current={pageIndex === index ? "page" : undefined} onClick={() => table.setPageIndex(index)}>{index + 1}</button>)}{pageCount > 5 && <span>...</span>}{pageCount > 5 && <button type="button" aria-label={`Page ${pageCount}`} onClick={() => table.setPageIndex(pageCount - 1)}>{pageCount}</button>}<button type="button" aria-label="Next page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight size={16} /></button></nav><label className="page-size-select"><span className="sr-only">Rows per page</span><select value={pageSize} onChange={(event) => table.setPageSize(Number(event.target.value))}><option value={8}>8 rows</option><option value={16}>16 rows</option><option value={32}>32 rows</option></select><ChevronDown size={13} aria-hidden="true" /></label></div>
  </section>;
}
