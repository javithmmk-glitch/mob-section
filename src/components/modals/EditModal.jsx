// ─── EditModal.jsx ────────────────────────────────────────────────────────────
// Edit product modal. Opens when user taps Edit on any product card.
// To add a new editable field: add it to editFields state + add input below.

import { useState, useCallback } from "react";
import { useStore, Actions }     from "@/store/AppStore.jsx";
import { BottomSheet }           from "@/components/shared/index.jsx";
import { fmt, calcMargin, calcMarkup, calcProfit, todayStr } from "@/utils/calculations.js";
import { DEFAULT_CATEGORIES, CAT_ICON } from "@/constants/app.js";

export default function EditModal({ product: initial, T, showToast, onClose }) {
  const { state: { categories }, dispatch } = useStore();
  const [fields, setFields] = useState({
    name:      initial.name,
    brand:     initial.brand      || "",
    company:   initial.company    || "",
    category:  initial.category   || "",
    barcode:   initial.barcode    || "",
    costPrice: initial.costPrice,
    mrp:       initial.mrp,
    sellPrice: initial.sellPrice,
    stock:     initial.stock,
    minLevel:  initial.minLevel,
    image:     initial.image      || null,
    dateAdded: initial.dateAdded  || "",
  });

  const set = (key, val) => setFields(f => ({ ...f, [key]: val }));

  const inp = (extra = {}) => ({
    background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10,
    padding: "10px 12px", color: T.text, fontSize: 14, outline: "none",
    width: "100%", boxSizing: "border-box", ...extra,
  });

  const margin  = calcMargin(fields.costPrice, fields.sellPrice);
  const markup  = calcMarkup(fields.costPrice, fields.sellPrice);
  const profit  = calcProfit(parseFloat(fields.costPrice)||0, parseFloat(fields.sellPrice)||0);
  const marginColor = parseFloat(margin) < 15 ? T.danger : parseFloat(margin) < 25 ? T.warn : T.success;

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("image", ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = useCallback(() => {
    const cost = parseFloat(fields.costPrice), mrp = parseFloat(fields.mrp);
    const sell = parseFloat(fields.sellPrice), stock = parseInt(fields.stock);
    const minLevel = parseInt(fields.minLevel);
    if ([cost, mrp, sell, stock, minLevel].some(isNaN)) return showToast("Enter valid numbers", "error");
    if (sell > mrp) return showToast("Sell price cannot exceed MRP", "error");
    dispatch(Actions.updateProduct({
      ...initial, ...fields,
      costPrice: cost, mrp, sellPrice: sell, stock, minLevel,
      dateAdded: fields.dateAdded || initial.dateAdded || "",
    }));
    showToast("Updated ✓");
    onClose();
  }, [fields, initial, dispatch, showToast, onClose]);

  return (
    <BottomSheet T={T} onClose={onClose}>
      <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>Edit Product</div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:16 }}>{initial.name}</div>

      {/* Image */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:6, fontWeight:600 }}>PRODUCT IMAGE</div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {fields.image && <img src={fields.image} style={{ width:64, height:64, borderRadius:12, objectFit:"cover" }} />}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px", textAlign:"center", cursor:"pointer", color:T.text, fontSize:13, fontWeight:600 }}>
              📷 Change Photo
              <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
            </label>
            {fields.image && <button onClick={()=>set("image",null)} style={{ background:`${T.danger}15`, border:`1px solid ${T.danger}30`, borderRadius:10, padding:"8px", color:T.danger, fontSize:12, fontWeight:700, cursor:"pointer" }}>Remove Image</button>}
          </div>
        </div>
      </div>

      {/* Text fields */}
      {[["PRODUCT NAME","name","text"],["BRAND","brand","text"],["COMPANY","company","text"]].map(([l,k,t])=>(
        <div key={k} style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }}>{l}</div>
          <input type={t} value={fields[k]||""} onChange={e=>set(k,e.target.value)} style={inp()} />
        </div>
      ))}

      {/* Category */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }}>CATEGORY</div>
        <select value={fields.category} onChange={e=>set("category",e.target.value)} style={inp()}>
          <option value="">Select…</option>
          {categories.map(c=><option key={c} value={c}>{CAT_ICON[c]||"📦"} {c}</option>)}
        </select>
      </div>

      {/* Barcode */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }}>BARCODE</div>
        <input value={fields.barcode} onChange={e=>set("barcode",e.target.value)} style={inp()} placeholder="Scan or type barcode" />
      </div>

      {/* Pricing */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
        {[["Cost ₹","costPrice"],["MRP ₹","mrp"],["Sell ₹","sellPrice"]].map(([l,k])=>(
          <div key={k}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }}>{l}</div>
            <input type="number" value={fields[k]||""} onChange={e=>set(k,e.target.value)} style={inp({padding:"10px"})} />
          </div>
        ))}
      </div>

      {/* Pricing preview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, background:T.bg, borderRadius:12, padding:12, marginBottom:12, textAlign:"center" }}>
        {[["Margin",`${margin}%`,marginColor],["Markup",`${markup}%`,T.accent],["Profit/pc",fmt(profit),profit>0?T.success:T.danger]].map(([l,v,c])=>(
          <div key={l}><div style={{ fontSize:10, color:T.muted }}>{l}</div><div style={{ fontSize:15, fontWeight:800, color:c }}>{v}</div></div>
        ))}
      </div>

      {/* Stock */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        {[["STOCK","stock"],["MIN LEVEL","minLevel"]].map(([l,k])=>(
          <div key={k}>
            <div style={{ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }}>{l}</div>
            <input type="number" value={fields[k]||""} onChange={e=>set(k,e.target.value)} style={inp({padding:"10px"})} />
          </div>
        ))}
      </div>

      {/* Date Added */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span>📅 DATE ADDED</span>
          <button onClick={()=>set("dateAdded",todayStr())} style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:8, padding:"3px 10px", color:T.muted, cursor:"pointer", fontSize:11 }}>Today</button>
        </div>
        <input type="date" value={fields.dateAdded||""} onChange={e=>set("dateAdded",e.target.value)} max={todayStr()} style={inp()} />
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ flex:1, background:T.card2, border:"none", borderRadius:14, padding:14, color:T.muted, fontWeight:700, cursor:"pointer", fontSize:15 }}>✕ Discard</button>
        <button onClick={save} style={{ flex:2, background:T.btnGrad, border:"none", borderRadius:14, padding:14, color:"#fff", fontWeight:800, cursor:"pointer", fontSize:15 }}>💾 Save Changes</button>
      </div>
    </BottomSheet>
  );
}
