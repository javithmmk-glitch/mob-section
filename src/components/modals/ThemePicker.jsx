// ─── ThemePicker.jsx ──────────────────────────────────────────────────────────
// Theme selection modal. To add a new theme: add it to constants/themes.js only.

import { THEMES } from "@/constants/themes.js";

export default function ThemePicker({ T, themeKey, setTheme, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:2500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:T.card, borderRadius:"24px 24px 0 0", padding:"20px 20px 40px", width:"100%", maxWidth:430 }}>
        <div style={{ width:40, height:4, background:T.border, borderRadius:2, margin:"0 auto 20px" }} />
        <div style={{ fontWeight:800, fontSize:18, marginBottom:16 }}>Choose Theme</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {Object.entries(THEMES).map(([key, th]) => (
            <button key={key} onClick={() => { setTheme(key); onClose(); }}
              style={{ background:th.bg, border:`2px solid ${themeKey===key?th.accent:th.border}`, borderRadius:16, padding:"14px 12px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:th.btnGrad, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:th.text }}>{th.emoji} {th.name}</div>
                <div style={{ fontSize:10, color:th.muted }}>{th.dark?"Dark":"Light"}</div>
              </div>
              {themeKey===key && <div style={{ marginLeft:"auto", color:th.accent, fontWeight:800 }}>✓</div>}
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ width:"100%", background:T.card2, border:"none", borderRadius:14, padding:14, color:T.muted, fontWeight:700, cursor:"pointer", fontSize:15 }}>Close</button>
      </div>
    </div>
  );
}
