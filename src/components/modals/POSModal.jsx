// ─── POSModal.jsx ─────────────────────────────────────────────────────────────
// Shows after barcode scan. Handles: found product, new product.
// To change post-scan behaviour: edit this file.

import { useState, useCallback } from "react";
import { useStore, Actions }     from "@/store/AppStore.jsx";
import { BottomSheet, QtyStepper } from "@/components/shared/index.jsx";
import { stockStatus, fmt, buildSaleEntry, buildRestockEntry, todayStr, nowTimeStr } from "@/utils/calculations.js";
import { CAT_ICON }              from "@/constants/app.js";

export default function POSModal({ data, T, showToast, onClose, setTab }) {
  const { product: initialProduct, barcode } = data;
  const { state: { products }, dispatch } = useStore();

  // Get fresh product from store (in case stock changed)
  const p = initialProduct
    ? products.find(x => x.id === initialProduct.id) || initialProduct
    : null;

  const [qtyAdj, setQtyAdj] = useState(1);

  const posAdjustStock = useCallback((delta) => {
    if (!p) return;
    const absQty  = Math.abs(delta);
    const newStock = Math.max(0, p.stock + delta);
    dispatch(Actions.updateStock(p.id, newStock));
    const entry = delta < 0
      ? buildSaleEntry(p, absQty, todayStr(), nowTimeStr())
      : buildRestockEntry(p, absQty);
    dispatch(Actions.addSaleEntry(entry));
    showToast(`${p.name}: ${delta > 0 ? "+" : ""}${delta} → ${newStock} left`);
    onClose();
  }, [p, dispatch, showToast, onClose]);

  const goAddProduct = useCallback(() => {
    setTab("Add");
    onClose();
    showToast("Fill in product details — barcode pre-filled");
  }, [setTab, onClose, showToast]);

  if (!p) {
    // New product not in inventory
    return (
      <BottomSheet T={T} onClose={onClose}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:50, marginBottom:10 }}>📦</div>
          <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>New Product</div>
          <div style={{ fontSize:12, color:T.muted }}>This barcode isn't in your inventory yet</div>
          <div style={{ fontFamily:"monospace", fontSize:14, color:T.accent, marginTop:8, background:T.bg, borderRadius:10, padding:"8px 16px", display:"inline-block" }}>
            ⌷ {barcode}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={goAddProduct}
            style={{ background:T.btnGrad, border:"none", borderRadius:14, padding:"16px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
            ➕ Add This Product
          </button>
          <button onClick={onClose}
            style={{ background:T.card2, border:"none", borderRadius:14, padding:"12px", color:T.muted, fontWeight:700, fontSize:14, cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      </BottomSheet>
    );
  }

  const st = stockStatus(p);
  const stColor = { ok:T.success, warn:T.warn, low:T.danger, empty:T.muted }[st];

  return (
    <BottomSheet T={T} onClose={onClose}>
      {/* Product header */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
        <div style={{ background:`${T.accent}15`, borderRadius:14, width:60, height:60, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0, overflow:"hidden" }}>
          {p.image ? <img src={p.image} style={{ width:60, height:60, borderRadius:14, objectFit:"cover" }}/> : (CAT_ICON[p.category]||"📦")}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:18 }}>{p.name}</div>
          <div style={{ fontSize:12, color:T.muted }}>{p.company||p.brand}</div>
          <div style={{ fontSize:11, color:T.muted }}>{p.category} · pcs</div>
          {barcode && <div style={{ fontSize:10, fontFamily:"monospace", color:T.accent, marginTop:4 }}>⌷ {barcode}</div>}
        </div>
        <div style={{ background:`${stColor}18`, border:`1.5px solid ${stColor}40`, borderRadius:14, padding:"10px 14px", textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:28, fontWeight:900, color:stColor }}>{p.stock}</div>
          <div style={{ fontSize:9, color:stColor, fontWeight:600 }}>IN STOCK</div>
        </div>
      </div>

      {/* Stock bar */}
      <div style={{ background:T.bg, borderRadius:8, height:6, overflow:"hidden", marginBottom:16 }}>
        <div style={{ height:"100%", width:`${Math.min(100,(p.stock/Math.max(p.minLevel*3,1))*100)}%`, background:stColor, borderRadius:8, transition:"width .4s" }} />
      </div>

      {/* Pricing */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, background:T.bg, borderRadius:12, padding:12, marginBottom:16 }}>
        {[["COST",fmt(p.costPrice),T.muted],["MRP",fmt(p.mrp),T.muted],["SELL",fmt(p.sellPrice),T.success]].map(([l,v,c])=>(
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, color:T.muted }}>{l}</div>
            <div style={{ fontSize:14, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Qty stepper */}
      <div style={{ fontSize:11, color:T.muted, marginBottom:8, fontWeight:600 }}>ADJUST STOCK</div>
      <div style={{ marginBottom:16 }}>
        <QtyStepper value={qtyAdj} onChange={setQtyAdj} min={1} T={T} />
      </div>

      {/* Action buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <button onClick={()=>posAdjustStock(-qtyAdj)} style={{ background:`${T.danger}18`, border:`1.5px solid ${T.danger}50`, borderRadius:14, padding:"14px", color:T.danger, fontWeight:800, fontSize:15, cursor:"pointer" }}>
          − Save Sale
        </button>
        <button onClick={()=>posAdjustStock(+qtyAdj)} style={{ background:`${T.success}18`, border:`1.5px solid ${T.success}50`, borderRadius:14, padding:"14px", color:T.success, fontWeight:800, fontSize:15, cursor:"pointer" }}>
          + Save Restock
        </button>
      </div>
      <button onClick={onClose} style={{ width:"100%", background:T.card2, border:"none", borderRadius:14, padding:"12px", color:T.muted, fontWeight:700, fontSize:13, cursor:"pointer" }}>
        Close
      </button>
    </BottomSheet>
  );
}
