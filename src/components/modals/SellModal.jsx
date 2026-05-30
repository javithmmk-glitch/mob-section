// ─── SellModal.jsx ───────────────────────────────────────────────────────────
// Quick sell modal — opened when user taps "Sold" on any product card.
// Allows qty selection, date/time override, optional note.
// All sale recording logic → hooks/index.js → useSaleActions

import { useState, useCallback } from "react";
import { useStore, Actions }     from "@/store/AppStore.jsx";
import { BottomSheet, QtyStepper } from "@/components/shared/index.jsx";
import { fmt, todayStr, nowTimeStr } from "@/utils/calculations.js";
import { buildSaleEntry }        from "@/utils/calculations.js";

export default function SellModal({ product: p, T, showToast, onClose }) {
  const { dispatch } = useStore();
  const [qty,      setQty]      = useState(1);
  const [note,     setNote]     = useState("");
  const [sellDate, setSellDate] = useState(todayStr());
  const [sellTime, setSellTime] = useState(nowTimeStr());

  const revenue = p.sellPrice * qty;
  const cost    = p.costPrice * qty;
  const profit  = revenue - cost;
  const isToday = sellDate === todayStr();

  const stColor = p.stock === 0 ? T.muted : p.stock <= p.minLevel ? T.danger : p.stock <= p.minLevel * 1.5 ? T.warn : T.success;

  const inp = (extra = {}) => ({
    background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10,
    padding: "10px 12px", color: T.text, fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box", ...extra,
  });

  const confirmSell = useCallback(() => {
    if (qty < 1)        return showToast("Enter valid quantity", "error");
    if (qty > p.stock)  return showToast(`Only ${p.stock} in stock`, "error");

    const entry = buildSaleEntry(p, qty, sellDate, sellTime, note.trim());
    dispatch(Actions.updateStock(p.id, p.stock - qty));
    dispatch(Actions.addSaleEntry(entry));
    showToast(`✓ Sold ${qty}× ${p.name} — ${p.stock - qty} left`);
    onClose();
  }, [qty, p, sellDate, sellTime, note, dispatch, showToast, onClose]);

  return (
    <BottomSheet T={T} onClose={onClose}>
      {/* Product header */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
        <div style={{ background:`${T.success}18`, borderRadius:14, width:56, height:56, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0, overflow:"hidden" }}>
          {p.image ? <img src={p.image} style={{ width:56, height:56, borderRadius:14, objectFit:"cover" }}/> : "📦"}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:18 }}>{p.name}</div>
          <div style={{ fontSize:12, color:T.muted }}>{p.company || p.brand}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
            <span style={{ fontSize:12, fontWeight:700, color:stColor }}>{p.stock} in stock</span>
            <span style={{ fontSize:11, color:T.muted }}>· min {p.minLevel}</span>
          </div>
        </div>
      </div>

      {/* Date & Time — editable */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:6, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>🕐 SALE DATE & TIME</span>
          <button onClick={() => { setSellDate(todayStr()); setSellTime(nowTimeStr()); }}
            style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:8, padding:"3px 10px", color:T.muted, cursor:"pointer", fontSize:11, fontWeight:600 }}>
            Reset to Now
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }}>DATE</div>
            <input type="date" value={sellDate} onChange={e=>setSellDate(e.target.value)} max={todayStr()} style={inp()} />
          </div>
          <div>
            <div style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }}>TIME</div>
            <input type="time" value={sellTime} onChange={e=>setSellTime(e.target.value)} style={inp()} />
          </div>
        </div>
        {!isToday && <div style={{ marginTop:6, fontSize:11, color:T.warn }}>⚠ Recording sale for a past date</div>}
      </div>

      {/* Quantity */}
      <div style={{ fontSize:11, color:T.muted, marginBottom:8, fontWeight:600 }}>QUANTITY SOLD</div>
      <div style={{ marginBottom:12 }}>
        <QtyStepper value={qty} onChange={setQty} min={1} max={p.stock} T={T} />
      </div>

      {/* Presets */}
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        {[1,2,5,10,20,50].filter(n=>n<=p.stock).map(n=>(
          <button key={n} onClick={()=>setQty(n)}
            style={{ background:qty===n?T.btnGrad:T.card2, border:`1px solid ${qty===n?T.accent:T.border}`, borderRadius:10, padding:"7px 14px", cursor:"pointer", fontSize:13, fontWeight:700, color:qty===n?"#fff":T.muted }}>
            {n}
          </button>
        ))}
        <button onClick={()=>setQty(p.stock)}
          style={{ background:qty===p.stock?T.btnGrad:T.card2, border:`1px solid ${qty===p.stock?T.accent:T.border}`, borderRadius:10, padding:"7px 14px", cursor:"pointer", fontSize:13, fontWeight:700, color:qty===p.stock?"#fff":T.muted }}>
          All ({p.stock})
        </button>
      </div>

      {/* Sale preview */}
      <div style={{ background:T.bg, borderRadius:14, padding:14, marginBottom:14 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:8, fontWeight:600 }}>SALE PREVIEW</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, textAlign:"center", marginBottom:10 }}>
          {[["Revenue",fmt(revenue),T.success],["Cost",fmt(cost),T.warn],["Profit",fmt(profit),T.success]].map(([l,v,c])=>(
            <div key={l}><div style={{ fontSize:15, fontWeight:800, color:c }}>{v}</div><div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{l}</div></div>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.muted, padding:"8px 0", borderTop:`1px solid ${T.border}` }}>
          <span>Sell price: <b style={{ color:T.text }}>{fmt(p.sellPrice)}/pc</b></span>
          <span>Stock after: <b style={{ color:p.stock-qty<=p.minLevel?T.danger:T.success }}>{p.stock-qty}</b></span>
        </div>
      </div>

      {/* Note */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:6, fontWeight:600 }}>NOTE (optional)</div>
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Walk-in customer, discount given..."
          style={inp()} />
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ flex:1, background:T.card2, border:"none", borderRadius:14, padding:14, color:T.muted, fontWeight:700, cursor:"pointer", fontSize:15 }}>Cancel</button>
        <button onClick={confirmSell} style={{ flex:2, background:"linear-gradient(135deg,#22c55e,#16a34a)", border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Save Sale
        </button>
      </div>
    </BottomSheet>
  );
}
