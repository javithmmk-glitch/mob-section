// ─── SettingsScreen.jsx ──────────────────────────────────────────────────────
// All app settings. Toggles save instantly. Store info needs Save button.
// To add a new setting: add to DEFAULT_SETTINGS in constants/app.js, then here.

import { useState, useEffect, useCallback } from "react";
import { useStore, Actions }   from "@/store/AppStore.jsx";
import { useTheme }            from "@/hooks/index.js";
import { Toggle }              from "@/components/shared/index.jsx";
import { THEMES }              from "@/constants/themes.js";
import { CAT_ICON }            from "@/constants/app.js";

export default function SettingsScreen({ T, showToast }) {
  const { state: { products, categories, supplierPhones, settings, salesLog }, dispatch } = useStore();
  const { themeKey, setTheme } = useTheme();
  const [newCatName, setNewCatName] = useState("");

  const [draft, setDraft] = useState({
    storeName: settings.storeName || "",
    ownerName: settings.ownerName || "",
    storeAddress: settings.storeAddress || "",
  });
  useEffect(() => {
    setDraft({ storeName: settings.storeName||"", ownerName: settings.ownerName||"", storeAddress: settings.storeAddress||"" });
  }, [settings.storeName, settings.ownerName, settings.storeAddress]);

  const setSetting = useCallback((k, v) => dispatch(Actions.updateSetting(k, v)), [dispatch]);
  const storeChanged = draft.storeName !== (settings.storeName||"") || draft.ownerName !== (settings.ownerName||"") || draft.storeAddress !== (settings.storeAddress||"");

  const saveStore = () => {
    setSetting("storeName", draft.storeName);
    setSetting("ownerName", draft.ownerName);
    setSetting("storeAddress", draft.storeAddress);
    showToast("Store info saved ✓");
  };

  const addCategory = () => {
    const c = newCatName.trim();
    if (!c || categories.includes(c)) return showToast("Invalid or duplicate", "error");
    dispatch(Actions.addCategory(c)); setNewCatName(""); showToast('"' + c + '" added');
  };

  const delCategory = (cat) => {
    if (products.some(p => p.category === cat)) return showToast("Remove products first", "error");
    dispatch(Actions.deleteCategory(cat)); showToast('"' + cat + '" removed');
  };

  const exportData = () => {
    const data = { products, categories, supplierPhones, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mob-section-backup.json"; a.click();
    showToast("Exported ✓");
  };

  const resetAll = () => {
    if (window.confirm("Reset ALL data? This cannot be undone.")) {
      dispatch(Actions.resetAll()); showToast("Reset complete", "error");
    }
  };

  const toggle = (label, sub, key) => (
    <div key={key} style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontWeight:600, fontSize:14 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{sub}</div>}
      </div>
      <Toggle value={settings[key]} onChange={v => setSetting(key, v)} T={T} />
    </div>
  );

  return (
    <div style={{ padding:"16px 16px 20px" }}>
      <div style={{ fontWeight:800, fontSize:22, marginBottom:6 }}>Settings</div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
        <span style={{ fontSize:12, color:T.muted }}>Toggles & theme save automatically · Store info needs Save</span>
      </div>

      {/* Store Info */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${storeChanged?T.warn:T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>🏪</span>
            <span style={{ fontWeight:700, fontSize:14 }}>Store Information</span>
            {storeChanged && <span style={{ fontSize:10, background:`${T.warn}25`, color:T.warn, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>Unsaved</span>}
          </div>
          {storeChanged && <button onClick={saveStore} style={{ background:T.btnGrad, border:"none", borderRadius:10, padding:"6px 14px", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>Save</button>}
        </div>
        {[["STORE NAME","storeName","Family Supermarket"],["OWNER NAME","ownerName","Your name"],["STORE ADDRESS","storeAddress","Address"]].map(([l, k, ph]) => (
          <div key={k} style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:600 }}>{l}</div>
            <input value={draft[k]||""} onChange={e => setDraft(d => ({ ...d, [k]: e.target.value }))} placeholder={ph}
              style={{ background:"transparent", border:"none", color:T.text, fontSize:15, outline:"none", width:"100%", fontWeight:500 }} />
          </div>
        ))}
        <div style={{ padding:"12px 16px" }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:5, fontWeight:600 }}>CURRENCY SYMBOL</div>
          <div style={{ display:"flex", gap:8 }}>
            {["₹","$","€","£","¥"].map(c => (
              <button key={c} onClick={() => setSetting("currency", c)}
                style={{ background:settings.currency===c?T.btnGrad:T.card2, border:`1px solid ${settings.currency===c?T.accent:T.border}`, borderRadius:10, padding:"8px 14px", color:settings.currency===c?"#fff":T.text, fontWeight:700, fontSize:15, cursor:"pointer" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {storeChanged && (
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
            <button onClick={() => setDraft({ storeName:settings.storeName||"", ownerName:settings.ownerName||"", storeAddress:settings.storeAddress||"" })}
              style={{ flex:1, background:T.card2, border:"none", borderRadius:12, padding:"11px", color:T.muted, fontWeight:700, cursor:"pointer", fontSize:14 }}>Discard</button>
            <button onClick={saveStore} style={{ flex:2, background:T.btnGrad, border:"none", borderRadius:12, padding:"11px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:14 }}>💾 Save Store Info</button>
          </div>
        )}
      </div>

      {/* Themes */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>🎨</span><span style={{ fontWeight:700, fontSize:14 }}>Appearance</span>
        </div>
        <div style={{ padding:14 }}>
          <div style={{ fontSize:11, color:T.muted, marginBottom:10, fontWeight:600 }}>THEME</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {Object.entries(THEMES).map(([key, th]) => (
              <button key={key} onClick={() => setTheme(key)}
                style={{ background:th.bg, border:`2px solid ${themeKey===key?th.accent:th.border}`, borderRadius:14, padding:"12px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:8, textAlign:"left" }}>
                <div style={{ width:26, height:26, borderRadius:8, background:th.btnGrad, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:th.text }}>{th.emoji} {th.name}</div>
                  <div style={{ fontSize:9, color:th.muted }}>{th.dark?"Dark":"Light"}</div>
                </div>
                {themeKey===key && <div style={{ marginLeft:"auto", color:th.accent, fontWeight:900, fontSize:14 }}>✓</div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
          <span>🔔</span><span style={{ fontWeight:700, fontSize:14 }}>Alerts & Display</span>
        </div>
        {toggle("Low Stock Alerts", "Show reorder warnings on dashboard", "lowStockAlert")}
        {toggle("Compact View", "Smaller product cards in stock list", "compactView")}
        {toggle("Show Barcode", "Display barcode number on product cards", "showBarcode")}
        {toggle("Show GMROI", "Show profitability metric on cards", "showGMROI")}
      </div>

      {/* GST */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
          <span>🧾</span><span style={{ fontWeight:700, fontSize:14 }}>Tax & GST</span>
        </div>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div><div style={{ fontWeight:600, fontSize:14 }}>GST Enabled</div><div style={{ fontSize:11, color:T.muted }}>Show GST calculations</div></div>
          <Toggle value={settings.gstEnabled} onChange={v => setSetting("gstEnabled", v)} T={T} />
        </div>
        {settings.gstEnabled && (
          <div style={{ padding:"12px 16px" }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:8, fontWeight:600 }}>DEFAULT TAX RATE (%)</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[0,5,12,18,28].map(r => (
                <button key={r} onClick={() => setSetting("taxRate", r)}
                  style={{ background:settings.taxRate===r?T.btnGrad:T.card2, border:`1px solid ${settings.taxRate===r?T.accent:T.border}`, borderRadius:10, padding:"8px 14px", color:settings.taxRate===r?"#fff":T.text, fontWeight:700, fontSize:14, cursor:"pointer" }}>
                  {r}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
          <span>📂</span><span style={{ fontWeight:700, fontSize:14 }}>Categories</span>
        </div>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", gap:8 }}>
            <input placeholder="New category name..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => e.key==="Enter" && addCategory()}
              style={{ flex:1, background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 12px", color:T.text, fontSize:14, outline:"none" }} />
            <button onClick={addCategory} style={{ background:T.btnGrad, border:"none", borderRadius:10, padding:"10px 16px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14 }}>Add</button>
          </div>
        </div>
        {categories.map(cat => {
          const count = products.filter(p => p.category === cat).length;
          return (
            <div key={cat} style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{CAT_ICON[cat]||"📦"}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{cat}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{count} product{count!==1?"s":""}</div>
                </div>
              </div>
              <button onClick={() => delCategory(cat)} style={{ background:`${T.danger}15`, border:"none", borderRadius:8, padding:"6px 12px", color:T.danger, cursor:"pointer", fontSize:12, fontWeight:700 }}>Remove</button>
            </div>
          );
        })}
      </div>

      {/* Supplier contacts */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
          <span>🏭</span><span style={{ fontWeight:700, fontSize:14 }}>Supplier Contacts</span>
        </div>
        {[...new Set(products.map(p => p.company).filter(Boolean))].map(company => (
          <div key={company} style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontWeight:600, fontSize:14, marginBottom:6 }}>{company}</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={supplierPhones[company]||""} onChange={e => dispatch(Actions.setSupplierPhone(company, e.target.value))}
                placeholder="WhatsApp number (e.g. 919876543210)" type="tel"
                style={{ flex:1, background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box" }} />
              <button onClick={() => showToast(company + " saved ✓")}
                style={{ background:T.btnGrad, border:"none", borderRadius:10, padding:"9px 14px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, flexShrink:0 }}>Save</button>
            </div>
          </div>
        ))}
      </div>

      {/* Data Management */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8 }}>
          <span>💾</span><span style={{ fontWeight:700, fontSize:14 }}>Data Management</span>
        </div>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Export Data</div>
          <div style={{ fontSize:12, color:T.muted, marginBottom:10 }}>Download all products as JSON backup</div>
          <button onClick={exportData} style={{ background:T.btnGrad, border:"none", borderRadius:12, padding:"10px 18px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14 }}>⬇ Download Backup</button>
        </div>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:4, color:T.danger }}>Reset All Data</div>
          <div style={{ fontSize:12, color:T.muted, marginBottom:10 }}>Clear all products and restore defaults</div>
          <button onClick={resetAll} style={{ background:`${T.danger}18`, border:`1px solid ${T.danger}40`, borderRadius:12, padding:"10px 18px", color:T.danger, fontWeight:700, cursor:"pointer", fontSize:14 }}>🗑 Reset Data</button>
        </div>
      </div>

      {/* App info */}
      <div style={{ background:T.card, borderRadius:18, border:`1px solid ${T.border}`, padding:16, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🧹</div>
        <div style={{ fontWeight:800, fontSize:16 }}>Mob Section v2.0</div>
        <div style={{ fontSize:12, color:T.muted, marginTop:4 }}>{settings.storeName||"Family Supermarket"} · {products.length} products · {salesLog.filter(e=>e.type==="sale").length} sales recorded</div>
      </div>
    </div>
  );
}
