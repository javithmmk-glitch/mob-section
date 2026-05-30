// ─── Dashboard.jsx ───────────────────────────────────────────────────────────
// Main dashboard screen: KPI cards, urgent restocks, category health.
// Data comes from useDashboardStats hook — all memoised, no recalculation here.
// To add a new KPI card: add to the array in "Quick Summary" section below.

import { useMemo } from "react";
import { useStore }             from "@/store/AppStore.jsx";
import { WaIcon }               from "@/components/shared/index.jsx";
import { useDashboardStats, useCategoryHealth } from "@/hooks/index.js";
import { fmt, stockStatus }     from "@/utils/calculations.js";
import { CAT_ICON }             from "@/constants/app.js";

export default function Dashboard({ T, setTab, openReorder, openSell }) {
  const { state: { products } } = useStore();
  const { needsReorder, outOfStock, totalCostValue, totalSellValue, totalProfit, avgMargin, lowestStock } = useDashboardStats();
  const catHealth = useCategoryHealth();
  const switchTab = (t) => setTab(t);

  return (
            {needsReorder.length > 0 && (
              <div style={{ background: T.dangerBg, border: `1px solid ${T.danger}40`, borderRadius: 18, padding: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ background: `${T.danger}25`, borderRadius: 14, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={T.danger}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17 }}>{needsReorder.length} urgent restocks</div>
                      <div style={{ fontSize: 12, color: T.muted }}>{outOfStock.length} item{outOfStock.length !== 1 ? "s" : ""} out of stock</div>
                    </div>
                  </div>
                  <button onClick={() => switchTab("Stock")} style={{ background: T.danger, border: "none", borderRadius: 12, padding: "10px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Review Items ›</button>
                </div>
                {lowestStock && (
                  <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 13, color: T.muted }}>Lowest: <span style={{ color: T.text, fontWeight: 700 }}>{lowestStock.name}</span></div>
                    <button onClick={() => openReorderModal(lowestStock.company || lowestStock.brand, [lowestStock])} style={{ background: "#25d366", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <WaIcon size={13} /> Send WhatsApp Order
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 14 }}>Quick Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Total Products", value: products.length, sub: "View all", icon: "📦", color: T.accent, iconBg: `${T.accent}20` },
                { label: "Inventory Cost Value", value: fmt(totalCostValue), sub: null, icon: "₹", color: T.success, iconBg: `${T.success}20` },
                { label: "Potential Revenue", value: fmt(totalSellValue), sub: null, icon: "₹", color: T.warn, iconBg: `${T.warn}20` },
                { label: "Potential Profit", value: fmt(totalProfit), sub: `${avgMargin}% Margin`, icon: "↗", color: T.success, iconBg: `${T.success}20` },
              ].map((s, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 16 }}>
                  <div style={{ background: s.iconBg, borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 10, color: s.color, fontWeight: 800 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
                  {s.sub && <div style={{ fontSize: 11, color: s.color, marginTop: 4, fontWeight: 600, cursor: "pointer" }} onClick={() => s.sub === "View all" && setTab("Stock")}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {needsReorder.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>Urgent Restock <span style={{ color: T.muted, fontWeight: 600 }}>({needsReorder.length})</span></div>
                  <button onClick={() => switchTab("Stock")} style={{ background: "none", border: "none", color: T.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>View all</button>
                </div>
                {needsReorder.slice(0, 5).map(p => {
                  const st = stockStatus(p);
                  const bColor = st === "low" ? T.danger : T.warn;
                  return (
                    <div key={p.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, borderLeft: `3px solid ${bColor}` }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: bColor, flexShrink: 0 }} />
                      <ProductThumb product={p} size={46} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: T.muted }}>{p.company || p.brand}</div>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Stock: {p.stock} pcs · Min: {p.minLevel} pcs</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: bColor, lineHeight: 1 }}>{p.stock} left</div>
                        <div style={{ fontSize: 11, color: bColor, marginBottom: 8 }}>{st === "low" ? "Below minimum" : "Low stock"}</div>
                        <button onClick={() => openReorderModal(p.company || p.brand, [p])} style={{ background: "none", border: `1.5px solid #25d366`, borderRadius: 10, padding: "6px 12px", color: "#25d366", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                          <WaIcon size={12} /> Reorder
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Today's Sales Summary ─────────────────────────────── */}
            {(() => {
              const todayStr  = new Date().toISOString().slice(0,10);
              const todaySales= salesLog.filter(e=>e.type==="sale"&&e.date===todayStr);
              const todayUnits= todaySales.reduce((s,e)=>s+e.qty,0);
              const todayRev  = todaySales.reduce((s,e)=>s+e.revenue,0);
              const todayProfit=todaySales.reduce((s,e)=>s+e.profit,0);
              return todaySales.length > 0 ? (
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{fontWeight:800,fontSize:18}}>Today's Sales</div>
                    <button onClick={()=>setTab("Sales")} style={{background:"none",border:"none",color:T.accent,fontWeight:700,fontSize:13,cursor:"pointer"}}>Full report</button>
                  </div>
                  <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:14}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
                      {[["Units",todayUnits,T.accent],["Revenue",fmt(todayRev),T.success],["Profit",fmt(todayProfit),T.success]].map(([l,v,c])=>(
                        <div key={l} style={{textAlign:"center",background:T.bg,borderRadius:10,padding:"10px 6px"}}>
                          <div style={{fontSize:16,fontWeight:900,color:c}}>{v}</div>
                          <div style={{fontSize:10,color:T.muted,marginTop:2}}>{l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:11,color:T.muted,marginBottom:6,fontWeight:600}}>LAST SOLD</div>
                    {todaySales.slice(0,3).map(e=>(
                      <div key={e.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div>
                          <div style={{fontWeight:600,fontSize:13}}>{e.productName}</div>
                          <div style={{fontSize:10,color:T.muted}}>{e.time} · ×{e.qty}</div>
                        </div>
                        <div style={{fontWeight:700,fontSize:13,color:T.success}}>{fmt(e.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* ── Recently Added Products ───────────────────────────── */}
            {products.length > 0 && (
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontWeight:800,fontSize:18}}>All Products <span style={{color:T.muted,fontWeight:500,fontSize:14}}>({products.length})</span></div>
                  <button onClick={()=>{setTab("Stock");setFilterCat("All");setSearch("");}} style={{background:T.btnGrad,border:"none",borderRadius:20,padding:"6px 14px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>View All</button>
                </div>
                <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                  {[...products].reverse().slice(0,5).map((p,i)=>{
                    const st = stockStatus(p);
                    const stColor = {ok:T.success,warn:T.warn,low:T.danger,empty:T.muted}[st];
                    const stLabel = {ok:"In Stock",warn:"Low",low:"⚠ Low",empty:"Empty"}[st];
                    return (
                      <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:i<4?`1px solid ${T.border}`:"none",cursor:"pointer"}}
                        onClick={()=>{setTab("Stock");setSearch(p.name);}}>
                        <ProductThumb product={p} size={44}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:14}}>{p.name}</div>
                          <div style={{fontSize:11,color:T.muted}}>{p.category} · {p.unit}</div>
                          <div style={{fontSize:11,color:T.muted}}>{fmt(p.sellPrice)} · Profit {fmt(p.sellPrice-p.costPrice)}/unit</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:18,fontWeight:900,color:stColor}}>{p.stock}</div>
                          <div style={{fontSize:10,color:stColor,marginTop:1}}>{stLabel}</div>
                          <button onClick={e=>{e.stopPropagation();openSellModal(p);}}
                            disabled={p.stock===0}
                            style={{marginTop:5,background:p.stock>0?"linear-gradient(135deg,#22c55e,#16a34a)":T.border,border:"none",borderRadius:8,padding:"4px 10px",color:p.stock>0?"#fff":T.muted,fontWeight:700,fontSize:11,cursor:p.stock>0?"pointer":"default"}}>
                            Sold
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {products.length > 5 && (
                    <div onClick={()=>{setTab("Stock");setFilterCat("All");setSearch("");}}
                      style={{padding:"12px 14px",textAlign:"center",color:T.accent,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      +{products.length-5} more products →
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Least Sold / Slow Moving ──────────────────────────── */}
            {(() => {
              const salesByProduct = {};
              salesLog.filter(e=>e.type==="sale").forEach(e=>{
                salesByProduct[e.productId] = (salesByProduct[e.productId]||0) + e.qty;
              });
              // Products with lowest sales (or no sales at all)
              const leastSold = [...products]
                .map(p=>({...p, totalSold: salesByProduct[p.id]||0}))
                .sort((a,b)=>a.totalSold-b.totalSold)
                .slice(0,4);
              return leastSold.length > 0 ? (
                <div style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{fontWeight:800,fontSize:18}}>🐢 Least Sold</div>
                    <div style={{fontSize:11,color:T.muted}}>may need attention</div>
                  </div>
                  <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.warn}30`,overflow:"hidden"}}>
                    {leastSold.map((p,i)=>(
                      <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:i<leastSold.length-1?`1px solid ${T.border}`:"none"}}>
                        <ProductThumb product={p} size={42}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:13}}>{p.name}</div>
                          <div style={{fontSize:11,color:T.muted}}>{p.category} · stock: {p.stock}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:15,fontWeight:900,color:p.totalSold===0?T.danger:T.warn}}>{p.totalSold}</div>
                          <div style={{fontSize:9,color:T.muted}}>units sold</div>
                          <button onClick={()=>openSellModal(p)} disabled={p.stock===0}
                            style={{marginTop:5,background:p.stock>0?"linear-gradient(135deg,#22c55e,#16a34a)":T.border,border:"none",borderRadius:8,padding:"4px 10px",color:p.stock>0?"#fff":T.muted,fontWeight:700,fontSize:11,cursor:p.stock>0?"pointer":"default"}}>
                            Sold
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* ── Category Health ───────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Category Health</div>
                <button onClick={() => switchTab("Stock")} style={{ background: "none", border: "none", color: T.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>View all</button>
              </div>
              <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {catHealth.map(({ cat, total, low }, i) => (
                  <div key={cat} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: i < catHealth.length - 1 ? `1px solid ${T.border}` : "none", gap: 14, cursor: "pointer" }} onClick={() => { switchTab("Stock"); setFilterCat(cat); }}>
                    <div style={{ fontSize: 24, width: 32, textAlign: "center" }}>{CAT_ICON[cat] || "📦"}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, flex: 1 }}>{cat}</div>
                    <div style={{ textAlign: "right" }}>
                      {low === 0
                        ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}><svg width="16" height="16" viewBox="0 0 24 24" fill={T.success}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg><span style={{ color: T.success, fontWeight: 700, fontSize: 14 }}>Good</span></div>
                        : <div style={{ display: "flex", alignItems: "center", gap: 6 }}><svg width="16" height="16" viewBox="0 0 24 24" fill={T.warn}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span style={{ color: T.warn, fontWeight: 700, fontSize: 14 }}>{low} low stock</span></div>
                      }
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{total} product{total !== 1 ? "s" : ""}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
  );
}
