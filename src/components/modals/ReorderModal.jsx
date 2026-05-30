// ─── ReorderModal.jsx ────────────────────────────────────────────────────────
// WhatsApp reorder modal. Opens when user taps Reorder on low-stock products.
// To change the WhatsApp message format → edit buildReorderWhatsApp in utils/calculations.js

import { useState, useCallback } from "react";
import { useStore, Actions }     from "@/store/AppStore.jsx";
import { BottomSheet, WaIcon }   from "@/components/shared/index.jsx";
import { buildReorderWhatsApp }  from "@/utils/calculations.js";

export default function ReorderModal({ data, T, showToast, onClose }) {
  const { company, items } = data;
  const { state: { supplierPhones, settings }, dispatch } = useStore();
  const [qtys, setQtys] = useState(() =>
    items.reduce((acc, p) => ({ ...acc, [p.id]: p.minLevel }), {})
  );
  const [phone, setPhone] = useState(supplierPhones[company] || "");

  const inp = (extra={}) => ({
    background:T.card2, border:`1px solid ${T.border}`, borderRadius:10,
    padding:"10px 12px", color:T.text, fontSize:14, outline:"none",
    width:"100%", boxSizing:"border-box", ...extra,
  });

  const savePhone = useCallback(() => {
    dispatch(Actions.setSupplierPhone(company, phone));
    showToast("Number saved ✓");
  }, [company, phone, dispatch, showToast]);

  const sendWhatsApp = useCallback(() => {
    const msg = buildReorderWhatsApp(company, items, qtys, settings.storeName || "Family Supermarket");
    const url  = phone
      ? `https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }, [company, items, qtys, phone, settings.storeName]);

  return (
    <BottomSheet T={T} onClose={onClose}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ background:"#25d36620", borderRadius:12, padding:10, color:"#25d366" }}>
          <WaIcon size={22} />
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:17 }}>Send Reorder via WhatsApp</div>
          <div style={{ fontSize:12, color:T.muted }}>{company}</div>
        </div>
      </div>

      {/* Supplier phone */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }}>SUPPLIER WHATSAPP NUMBER</div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel" placeholder="919876543210"
            style={{ ...inp(), flex:1, width:"auto" }} />
          <button onClick={savePhone}
            style={{ background:T.btnGrad, border:"none", borderRadius:10, padding:"0 14px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, flexShrink:0 }}>
            Save
          </button>
        </div>
        <div style={{ fontSize:10, color:T.muted, marginTop:4 }}>Leave blank → choose contact in WhatsApp</div>
      </div>

      {/* Items */}
      <div style={{ fontSize:11, color:T.muted, marginBottom:8, fontWeight:600 }}>ITEMS TO ORDER</div>
      {items.map(p => (
        <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, background:T.bg, borderRadius:12, padding:12, marginBottom:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
            <div style={{ fontSize:11, color:T.muted }}>pcs · {p.stock} in stock</div>
          </div>
          <div style={{ display:"flex", alignItems:"center" }}>
            <button onClick={()=>setQtys(q=>({...q,[p.id]:Math.max(1,(q[p.id]||p.minLevel)-1)}))}
              style={{ background:T.border, border:"none", borderRadius:"8px 0 0 8px", padding:"7px 11px", color:T.text, cursor:"pointer", fontSize:16, fontWeight:700 }}>−</button>
            <div style={{ background:T.card2, border:`1px solid ${T.border}`, borderLeft:"none", borderRight:"none", padding:"7px 14px", fontSize:15, fontWeight:800, color:T.accent, minWidth:36, textAlign:"center" }}>
              {qtys[p.id]||p.minLevel}
            </div>
            <button onClick={()=>setQtys(q=>({...q,[p.id]:(q[p.id]||p.minLevel)+1}))}
              style={{ background:T.border, border:"none", borderRadius:"0 8px 8px 0", padding:"7px 11px", color:T.text, cursor:"pointer", fontSize:16, fontWeight:700 }}>+</button>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div style={{ display:"flex", gap:10, marginTop:16 }}>
        <button onClick={onClose} style={{ flex:1, background:T.card2, border:"none", borderRadius:14, padding:14, color:T.muted, fontWeight:700, cursor:"pointer", fontSize:15 }}>Cancel</button>
        <button onClick={sendWhatsApp} style={{ flex:2, background:"linear-gradient(135deg,#25d366,#128c7e)", border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <WaIcon size={18} /> Send on WhatsApp
        </button>
      </div>
    </BottomSheet>
  );
}
