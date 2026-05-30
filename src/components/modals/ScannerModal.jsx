// ─── ScannerModal.jsx ─────────────────────────────────────────────────────────
// Barcode scanner using QuaggaJS loaded from CDN.
// To change scanner behaviour: edit this file only.
// To change which barcode formats are supported: find `readers:` array below.
// To change camera settings: find `constraints:` object below.

import { useState, useRef, useEffect, useCallback } from "react";

export default function ScannerModal({ onDetected, onClose, T }) {
  const containerRef = useRef(null);
  const doneRef      = useRef(false);
  const lineRef      = useRef(null);
  const linePos      = useRef(0);
  const lineDir      = useRef(1);
  const rafRef       = useRef(null);

  const [phase,       setPhase]      = useState("loading");
  const [statusMsg,   setStatusMsg]  = useState("Loading scanner…");
  const [scannedCode, setScannedCode]= useState("");
  const [manualCode,  setManualCode] = useState("");

  useEffect(() => {
    const tick = () => {
      linePos.current += lineDir.current * 2;
      if (linePos.current >= 145 || linePos.current <= 0) lineDir.current *= -1;
      if (lineRef.current) lineRef.current.style.transform = `translateY(${linePos.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const stopQuagga = useCallback(() => {
    try { window.Quagga && window.Quagga.stop(); } catch (_) {}
  }, []);

  const handleClose = useCallback(() => { stopQuagga(); onClose(); }, [stopQuagga, onClose]);

  const fireResult = useCallback((code) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setScannedCode(code);
    setPhase("success");
    try { navigator.vibrate?.(150); } catch (_) {}
    setTimeout(() => { stopQuagga(); onDetected(code); }, 800);
  }, [stopQuagga, onDetected]);

  useEffect(() => {
    let cancelled = false;
    const loadQuagga = () => new Promise((resolve, reject) => {
      if (window.Quagga) { resolve(window.Quagga); return; }
      const s = document.createElement("script");
      s.src = "https://unpkg.com/quagga@0.12.1/dist/quagga.min.js";
      s.crossOrigin = "anonymous";
      s.onload  = () => window.Quagga ? resolve(window.Quagga) : reject(new Error("Quagga not found"));
      s.onerror = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js";
        s2.onload  = () => window.Quagga ? resolve(window.Quagga) : reject(new Error("Load failed"));
        s2.onerror = () => reject(new Error("Could not load scanner. Check internet."));
        document.head.appendChild(s2);
      };
      document.head.appendChild(s);
    });

    const start = async () => {
      setPhase("loading"); setStatusMsg("Loading scanner…");
      try {
        await loadQuagga();
        if (cancelled) return;
        setStatusMsg("Starting camera…");
        await new Promise(r => setTimeout(r, 100));
        if (cancelled || !containerRef.current) return;

        window.Quagga.init({
          inputStream: {
            name: "Live", type: "LiveStream",
            target: containerRef.current,
            constraints: { facingMode: "environment", width: { min: 640, ideal: 1280 }, height: { min: 480, ideal: 720 } },
            area: { top: "25%", right: "10%", bottom: "25%", left: "10%" },
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency > 2 ? 2 : 1,
          frequency: 10,
          decoder: {
            readers: ["ean_reader","ean_8_reader","code_128_reader","code_39_reader","upc_reader","upc_e_reader","codabar_reader","i2of5_reader"],
          },
        }, (err) => {
          if (cancelled) return;
          if (err) {
            const msg = String(err.name || err.message || err);
            if (msg.includes("NotAllowed") || msg.includes("Permission")) { setPhase("denied"); }
            else { setPhase("error"); setStatusMsg(String(err.message || err)); }
            return;
          }
          if (!cancelled) { window.Quagga.start(); setPhase("scanning"); }
        });

        window.Quagga.onDetected((result) => {
          if (cancelled || doneRef.current) return;
          const code = result?.codeResult?.code;
          if (code && code.length >= 4) fireResult(code);
        });
      } catch (err) {
        if (cancelled) return;
        setPhase("error"); setStatusMsg(err.message || "Scanner failed.");
      }
    };
    start();
    return () => { cancelled = true; stopQuagga(); };
  }, [fireResult, stopQuagga]);

  const handleManual = () => { const c = manualCode.trim(); if (c) { stopQuagga(); onDetected(c); } };

  const corner = (pos) => {
    const col = phase === "success" ? "#22c55e" : T.accent;
    const base = { position:"absolute", width:34, height:34, borderColor:col, borderStyle:"solid", borderWidth:0 };
    if (pos==="tl") return {...base, top:0, left:0, borderTopWidth:3, borderLeftWidth:3, borderRadius:"6px 0 0 0"};
    if (pos==="tr") return {...base, top:0, right:0, borderTopWidth:3, borderRightWidth:3, borderRadius:"0 6px 0 0"};
    if (pos==="bl") return {...base, bottom:0, left:0, borderBottomWidth:3, borderLeftWidth:3, borderRadius:"0 0 0 6px"};
    return {...base, bottom:0, right:0, borderBottomWidth:3, borderRightWidth:3, borderRadius:"0 0 6px 0"};
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000", zIndex:3000, display:"flex", flexDirection:"column" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:20, padding:"50px 18px 16px", background:"linear-gradient(to bottom,rgba(0,0,0,0.92),transparent)", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:800, fontSize:19, color:"#fff" }}>Barcode Scanner</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:3 }}>
            {phase==="scanning" && "Point camera at barcode"}
            {phase==="success"  && "✓ Detected!"}
            {phase==="denied"   && "Camera permission denied"}
            {(phase==="loading"||phase==="error") && statusMsg}
          </div>
        </div>
        <button onClick={handleClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:12, width:42, height:42, color:"#fff", fontSize:20, fontWeight:800, cursor:"pointer" }}>✕</button>
      </div>

      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <div ref={containerRef} style={{ position:"absolute", inset:0 }} />
        <style>{`#quagga-container video,#quagga-container canvas{position:absolute!important;width:100%!important;height:100%!important;object-fit:cover!important;}`}</style>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 300px 190px at 50% 44%,transparent 50%,rgba(0,0,0,0.65) 100%)", pointerEvents:"none", zIndex:2 }} />

        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-56%)", width:290, height:175, zIndex:3 }}>
          <div style={corner("tl")}/><div style={corner("tr")}/><div style={corner("bl")}/><div style={corner("br")}/>
          {phase==="scanning" && <div ref={lineRef} style={{ position:"absolute", left:8, right:8, height:2.5, borderRadius:2, background:`linear-gradient(90deg,transparent,${T.accent},${T.accent},transparent)`, boxShadow:`0 0 10px 3px ${T.accent}55`, willChange:"transform", zIndex:4 }} />}
          {phase==="success"  && <div style={{ position:"absolute", inset:0, background:"#22c55e18", border:"2.5px solid #22c55e", borderRadius:6, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, zIndex:4 }}><div style={{ fontSize:40 }}>✅</div><div style={{ color:"#22c55e", fontWeight:800 }}>Scanned!</div></div>}
        </div>

        {(phase==="loading"||phase==="denied"||phase==="error") && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"0 30px", zIndex:5 }}>
            {phase==="loading" && <><div style={{ width:48, height:48, border:"3px solid rgba(255,255,255,0.1)", borderTopColor:T.accent, borderRadius:"50%", animation:"spin 0.75s linear infinite" }} /><div style={{ color:"#fff", fontSize:15 }}>{statusMsg}</div></>}
            {(phase==="denied"||phase==="error") && <><div style={{ fontSize:46 }}>{phase==="denied"?"🔒":"⚠️"}</div><div style={{ color:"#fff", fontSize:16, fontWeight:800, textAlign:"center" }}>{phase==="denied"?"Camera Access Denied":"Scanner Error"}</div><div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, textAlign:"center", lineHeight:1.65 }}>{phase==="denied"?"Settings → Safari → Camera → Allow":statusMsg}</div></>}
          </div>
        )}
      </div>

      <div style={{ background:"#0c0c0c", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"16px 18px 40px" }}>
        {phase==="success" && scannedCode && (
          <div style={{ background:"#22c55e14", border:"1px solid #22c55e35", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:22 }}>✅</div>
            <div><div style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>Scanned successfully</div><div style={{ color:"rgba(255,255,255,0.65)", fontSize:14, fontFamily:"monospace", marginTop:2 }}>{scannedCode}</div></div>
          </div>
        )}
        <div style={{ color:"rgba(255,255,255,0.28)", fontSize:11, textAlign:"center", marginBottom:10 }}>— or enter barcode manually —</div>
        <div style={{ display:"flex", gap:10 }}>
          <input value={manualCode} onChange={e=>setManualCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleManual()} placeholder="Type barcode number…" inputMode="numeric"
            style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"14px", color:"#fff", fontSize:16, outline:"none", fontFamily:"monospace", letterSpacing:1.5 }} />
          <button onClick={handleManual} disabled={!manualCode.trim()} style={{ background:manualCode.trim()?T.btnGrad:"rgba(255,255,255,0.07)", border:"none", borderRadius:12, padding:"0 22px", color:"#fff", fontWeight:800, cursor:manualCode.trim()?"pointer":"default", fontSize:15, opacity:manualCode.trim()?1:0.35 }}>Find</button>
        </div>
      </div>
    </div>
  );
}
