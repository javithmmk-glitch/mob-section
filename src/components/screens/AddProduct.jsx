// ─── AddProduct.jsx ──────────────────────────────────────────────────────────
// Add new product form. Barcode can be pre-filled from scanner.
// On submit → dispatches ADD_PRODUCT action → navigates to Stock tab.
// To add a new field: add to BLANK_PRODUCT + add input below.

import { useState, useCallback } from "react";
import { useStore, Actions }     from "@/store/AppStore.jsx";
import { fmt, calcMargin, calcMarkup, calcProfit, todayStr, nextId } from "@/utils/calculations.js";
import { CAT_ICON }              from "@/constants/app.js";
import ScannerModal               from "@/components/modals/ScannerModal.jsx";

const BLANK = { name:"", brand:"", company:"", category:"", costPrice:"", mrp:"", sellPrice:"", stock:"", minLevel:"", barcode:"", image:null, dateAdded:todayStr() };

export default function AddProduct({ T, showToast, setTab, openScanner }) {
  const { state: { products, categories, supplierPhones }, dispatch } = useStore();
  const [form, setForm]       = useState(BLANK);
  const [showScan, setShowScan] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inp = (extra={}) => ({
    background:T.card2, border:`1px solid ${T.border}`, borderRadius:10,
    padding:"10px 12px", color:T.text, fontSize:14, outline:"none",
    width:"100%", boxSizing:"border-box", ...extra,
  });

  const margin  = calcMargin(form.costPrice, form.sellPrice);
  const markup  = calcMarkup(form.costPrice, form.sellPrice);
  const profit  = calcProfit(parseFloat(form.costPrice)||0, parseFloat(form.sellPrice)||0);
  const marginColor = parseFloat(margin) < 15 ? T.danger : parseFloat(margin) < 25 ? T.warn : T.success;

  const handleImage = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("image", ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleScan = (code) => {
    const exists = products.find(p => p.barcode?.trim() === code.trim());
    if (exists) showToast(`Already used by: ${exists.name}`, "error");
    else set("barcode", code);
    setShowScan(false);
  };

  const submit = useCallback(() => {
    const { name, costPrice, mrp, sellPrice, stock, minLevel, category } = form;
    if (!name || !costPrice || !mrp || !sellPrice || !stock || !minLevel || !category)
      return showToast("Fill all required fields (*)", "error");
    if (parseFloat(sellPrice) > parseFloat(mrp))
      return showToast("Sell price cannot exceed MRP", "error");
    const id = nextId(products);
    const product = {
      id, ...form,
      unit: "pcs",
      costPrice: parseFloat(costPrice), mrp: parseFloat(mrp), sellPrice: parseFloat(sellPrice),
      stock: parseInt(stock), minLevel: parseInt(minLevel),
      unitsSoldMonthly: 0, lastOrdered: 0,
      dateAdded: form.dateAdded || todayStr(),
    };
    dispatch(Actions.addProduct(product));
    if (form.company && !supplierPhones[form.company])
      dispatch(Actions.setSupplierPhone(form.company, ""));
    showToast(`${name} added! ✓`);
    setForm(BLANK);
    setTab("Stock");
  }, [form, products, supplierPhones, dispatch, showToast, setTab]);

  return (
    <div style={ padding:"16px 16px 20px" }>
      {showScan && <ScannerModal onDetected={handleScan} onClose={()=>setShowScan(false)} T={T} />}
      <div style={ fontWeight:800, fontSize:22, marginBottom:4 }>Add Product</div>
      <div style={ fontSize:12, color:T.muted, marginBottom:20 }>* required fields</div>

      {/* Image */}
      <div style={ marginBottom:16 }>
        <div style={ fontSize:11, color:T.muted, marginBottom:6, fontWeight:600 }>PRODUCT IMAGE</div>
        <div style={ display:"flex", gap:10 }>
          {form.image && <img src={form.image} style={ width:64, height:64, borderRadius:12, objectFit:"cover" }/>}
          <label style={ flex:1, background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px", textAlign:"center", cursor:"pointer", color:T.text, fontSize:13, fontWeight:600 }>
            📷 Add Photo
            <input type="file" accept="image/*" onChange={handleImage} style={ display:"none" }/>
          </label>
        </div>
      </div>

      {/* Text fields */}
      {[["PRODUCT NAME *","name","text","e.g. Floor Mop"],["BRAND","brand","text","e.g. CleanPro"],["COMPANY / AGENCY","company","text","e.g. CleanPro Distributors"]].map(([l,k,t,ph])=>(
        <div key={k} style={ marginBottom:12 }>
          <div style={ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }>{l}</div>
          <input type={t} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp()}/>
        </div>
      ))}

      {/* Category */}
      <div style={ marginBottom:12 }>
        <div style={ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }>CATEGORY *</div>
        <select value={form.category} onChange={e=>set("category",e.target.value)} style={inp()}>
          <option value="">Select category…</option>
          {categories.map(c=><option key={c} value={c}>{CAT_ICON[c]||"📦"} {c}</option>)}
        </select>
      </div>

      {/* Barcode */}
      <div style={ marginBottom:12 }>
        <div style={ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600 }>BARCODE</div>
        <div style={ display:"flex", gap:8 }>
          <input value={form.barcode} onChange={e=>set("barcode",e.target.value)} placeholder="Scan or type barcode" style={{...inp(), flex:1, width:"auto"}}/>
          <button onClick={()=>setShowScan(true)} style={ background:T.btnGrad, border:"none", borderRadius:10, padding:"0 14px", color:"#fff", cursor:"pointer", fontSize:16, flexShrink:0 }>⌷</button>
        </div>
      </div>

      {/* Pricing */}
      <div style={ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }>
        {[["Cost ₹ *","costPrice"],["MRP ₹ *","mrp"],["Sell ₹ *","sellPrice"]].map(([l,k])=>(
          <div key={k}>
            <div style={ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }>{l}</div>
            <input type="number" value={form[k]} onChange={e=>set(k,e.target.value)} style={inp({padding:"10px"})}/>
          </div>
        ))}
      </div>

      {/* Pricing preview */}
      <div style={ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, background:T.bg, borderRadius:12, padding:12, marginBottom:12, textAlign:"center" }>
        {[["Margin",`${margin}%`,marginColor],["Markup",`${markup}%`,T.accent],["Profit/pc",fmt(profit),profit>0?T.success:T.danger]].map(([l,v,c])=>(
          <div key={l}>
            <div style={ fontSize:9, color:T.muted }>{l}</div>
            <div style={ fontSize:14, fontWeight:800, color:c }>{v}</div>
          </div>
        ))}
      </div>

      {/* Stock */}
      <div style={ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }>
        {[["Stock *","stock"],["Min Level *","minLevel"]].map(([l,k])=>(
          <div key={k}>
            <div style={ fontSize:10, color:T.muted, marginBottom:4, fontWeight:600 }>{l}</div>
            <input type="number" value={form[k]} onChange={e=>set(k,e.target.value)} style={inp({padding:"10px"})}/>
          </div>
        ))}
      </div>

      {/* Date Added */}
      <div style={ marginBottom:20 }>
        <div style={ fontSize:11, color:T.muted, marginBottom:4, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"space-between" }>
          <span>📅 DATE ADDED TO INVENTORY</span>
          <button onClick={()=>set("dateAdded",todayStr())} style={ background:T.card2, border:`1px solid ${T.border}`, borderRadius:8, padding:"3px 10px", color:T.muted, cursor:"pointer", fontSize:11 }>Today</button>
        </div>
        <input type="date" value={form.dateAdded} onChange={e=>set("dateAdded",e.target.value)} max={todayStr()} style={inp()}/>
        <div style={ fontSize:10, color:T.muted, marginTop:4 }>When this product was first added to your store</div>
      </div>

      <button onClick={submit} style={ width:"100%", background:T.btnGrad, border:"none", borderRadius:16, padding:16, color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        Add to Inventory
      </button>
    </div>
  );
}
