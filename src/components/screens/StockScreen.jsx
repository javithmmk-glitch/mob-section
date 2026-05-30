// ─── StockScreen.jsx ─────────────────────────────────────────────────────────
// Stock list screen: search, filter, product cards with Sold/Edit/Reorder.
// Filter logic is in hooks/index.js useStockFilter (memoised).
// To add a new filter option: add to useStockFilter in hooks/index.js.

import { useStore, Actions }    from "@/store/AppStore.jsx";
import { WaIcon, ProductThumb } from "@/components/shared/index.jsx";
import { useStockFilter }       from "@/hooks/index.js";
import { fmt, stockStatus, STOCK_STATUS_COLOR, STOCK_STATUS_LABEL, fmtDate } from "@/utils/calculations.js";
import { CAT_ICON }             from "@/constants/app.js";

export default function StockScreen({ T, showToast, openSell, openEdit, openReorder }) {
  const { state: { products }, dispatch } = useStore();
  const { filtered, allCats, filterCat, setFilterCat, search, handleSearch, showReorderOnly, setShowReorderOnly } = useStockFilter();

  const deleteProduct = (p) => {
    if (!window.confirm(`Remove "${p.name}"?`)) return;
    dispatch(Actions.deleteProduct(p.id));
    showToast("Removed", "error");
  };

  const inp = (extra={}) => ({
    background:T.card2, border:`1px solid ${T.border}`, borderRadius:10,
    padding:"10px 12px", color:T.text, fontSize:14, outline:"none",
    width:"100%", boxSizing:"border-box", ...extra,
  });

  return (
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input placeholder="Search name, brand, barcode..." defaultValue={search} onChange={e => handleSearchChange(e.target.value)} style={{ ...inp(), flex: 1, borderRadius: 14 }} />
              <button onClick={() => openScanner("search")} style={{ background: T.btnGrad, border: "none", borderRadius: 12, padding: "0 14px", color: "#fff", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>⌷</button>
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
              {allCats.map(c => (
                <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", background: filterCat === c ? T.accent : T.card2, color: filterCat === c ? "#fff" : T.muted }}>{CAT_ICON[c] || ""} {c}</button>
              ))}
              <button onClick={() => setShowReorderOnly(!showReorderOnly)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${showReorderOnly ? T.danger : T.border}`, cursor: "pointer", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", background: showReorderOnly ? `${T.danger}20` : T.card2, color: showReorderOnly ? T.danger : T.muted }}>⚠ Reorder</button>
            </div>

            {filtered.map(p => {
              const st = stockStatus(p);
              const stColor = { ok: T.success, warn: T.warn, low: T.danger, empty: T.muted }[st];
              const stLabel = { ok: "In Stock", warn: "Low", low: "Reorder Now", empty: "Out of Stock" }[st];
              return (
                <div key={p.id} style={{ background: T.card, borderRadius: 18, padding: 16, marginBottom: 12, border: `1px solid ${st === "low" || st === "empty" ? T.danger + "40" : T.border}` }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <ProductThumb product={p} size={60} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 16 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: T.muted }}>{p.company || p.brand} · <span style={{background:`${T.accent}18`,color:T.accent,borderRadius:5,padding:"1px 6px",fontSize:11,fontWeight:700}}>pcs</span></div>
                          {p.barcode && <div style={{ fontSize: 10, color: T.muted, marginTop: 2, fontFamily: "monospace" }}>⌷ {p.barcode}</div>}
                          {p.dateAdded && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>📅 Added: {new Date(p.dateAdded).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 26, fontWeight: 900, color: stColor, lineHeight: 1 }}>{p.stock}</div>
                          <div style={{ fontSize: 10, color: stColor }}>{stLabel}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10, background: T.bg, borderRadius: 10, padding: "8px 10px" }}>
                        {[["COST", fmt(p.costPrice), T.muted], ["MRP", fmt(p.mrp), T.muted], ["SELL", fmt(p.sellPrice), T.success]].map(([l, v, c]) => (
                          <div key={l}><div style={{ fontSize: 9, color: T.muted }}>{l}</div><div style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</div></div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: T.muted }}>Margin <b style={{ color: parseFloat(calcMargin(p.costPrice, p.sellPrice)) >= 25 ? T.success : T.danger }}>{calcMargin(p.costPrice, p.sellPrice)}%</b></span>
                        <span style={{ fontSize: 11, color: T.muted }}>GMROI <b style={{ color: T.accent }}>{calcGMROI(p.costPrice, p.sellPrice)}x</b></span>
                        <span style={{ fontSize: 11, color: T.muted }}>Profit <b style={{ color: T.success }}>{fmt(p.sellPrice - p.costPrice)}</b></span>
                      </div>
                      <div style={{ marginTop: 8, background: T.bg, borderRadius: 6, height: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 6, width: `${Math.min(100, (p.stock / (p.minLevel * 3)) * 100)}%`, background: stColor }} />
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        {/* SOLD button — prominent, always visible */}
                        <button onClick={() => openSellModal(p)}
                          disabled={p.stock === 0}
                          style={{ flex: 2, background: p.stock > 0 ? "linear-gradient(135deg,#22c55e,#16a34a)" : T.border, border: "none", borderRadius: 10, padding: "10px 8px", color: p.stock > 0 ? "#fff" : T.muted, fontWeight: 800, fontSize: 13, cursor: p.stock > 0 ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Sold
                        </button>
                        <button onClick={() => openEdit(p)} title="Edit product" style={{ flex: 1, background: `${T.accent}18`, border: `1px solid ${T.accent}40`, borderRadius: 10, padding: "10px 8px", color: T.accent, fontWeight: 700, fontSize: 12, cursor: "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </button>
                        {(st === "low" || st === "empty") && (
                          <button onClick={() => openReorderModal(p.company || p.brand, [p])} style={{ flex: 1, background: "#25d36615", border: "1px solid #25d36640", borderRadius: 10, padding: "10px 6px", color: "#25d366", fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}><WaIcon size={11} /></button>
                        )}
                        <button onClick={() => deleteProduct(p.id)} style={{ background: `${T.danger}15`, border: `1px solid ${T.danger}30`, borderRadius: 10, padding: "10px 12px", color: T.danger, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div style={{ textAlign: "center", color: T.muted, padding: 48, fontSize: 15 }}>No products found</div>}
          </div>
        )}

  );
}
