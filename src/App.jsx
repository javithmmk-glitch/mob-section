import { useState, useRef, useEffect, useCallback } from "react";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  midnight: {
    name: "Midnight", emoji: "🌙", dark: true,
    bg: "#0d0d14", card: "#141420", card2: "#1a1a2a", border: "#252538",
    accent: "#7c6ef5", accent2: "#a78bfa", text: "#f0f0ff", muted: "#6b6b8a",
    success: "#22c55e", danger: "#ef4444", warn: "#f59e0b",
    navBg: "#10101c", headerBg: "#0d0d14",
    btnGrad: "linear-gradient(135deg,#7c6ef5,#a78bfa)",
    dangerBg: "linear-gradient(135deg,#1f0a0a,#2d1010)",
  },
  amoled: {
    name: "AMOLED", emoji: "⬛", dark: true,
    bg: "#000000", card: "#0a0a0a", card2: "#111111", border: "#1a1a1a",
    accent: "#ffffff", accent2: "#e0e0e0", text: "#ffffff", muted: "#555555",
    success: "#00e676", danger: "#ff1744", warn: "#ffab00",
    navBg: "#000000", headerBg: "#000000",
    btnGrad: "linear-gradient(135deg,#333,#555)",
    dangerBg: "linear-gradient(135deg,#1a0000,#2a0000)",
  },
  cyberpunk: {
    name: "Cyberpunk", emoji: "⚡", dark: true,
    bg: "#0a0015", card: "#110020", card2: "#180030", border: "#2d0060",
    accent: "#f0f", accent2: "#0ff", text: "#f0e6ff", muted: "#6b4a8a",
    success: "#0ff", danger: "#f0f", warn: "#ff0",
    navBg: "#080010", headerBg: "#0a0015",
    btnGrad: "linear-gradient(135deg,#cc00cc,#00cccc)",
    dangerBg: "linear-gradient(135deg,#1a0020,#200030)",
  },
  forest: {
    name: "Forest", emoji: "🌿", dark: true,
    bg: "#0a1208", card: "#111a0e", card2: "#182414", border: "#243d1a",
    accent: "#4ade80", accent2: "#86efac", text: "#f0fdf4", muted: "#4a6a40",
    success: "#4ade80", danger: "#f87171", warn: "#fbbf24",
    navBg: "#080e06", headerBg: "#0a1208",
    btnGrad: "linear-gradient(135deg,#16a34a,#4ade80)",
    dangerBg: "linear-gradient(135deg,#1a0a0a,#2a1010)",
  },
  ocean: {
    name: "Ocean", emoji: "🌊", dark: true,
    bg: "#00090f", card: "#00121e", card2: "#001828", border: "#0a3248",
    accent: "#0ea5e9", accent2: "#38bdf8", text: "#f0f9ff", muted: "#2d6a8a",
    success: "#22d3ee", danger: "#f43f5e", warn: "#fbbf24",
    navBg: "#000609", headerBg: "#00090f",
    btnGrad: "linear-gradient(135deg,#0284c7,#0ea5e9)",
    dangerBg: "linear-gradient(135deg,#0a0015,#100020)",
  },
  sunset: {
    name: "Sunset", emoji: "🌅", dark: true,
    bg: "#0f0500", card: "#1a0a00", card2: "#251200", border: "#4a2000",
    accent: "#fb923c", accent2: "#fcd34d", text: "#fff7ed", muted: "#8a5030",
    success: "#84cc16", danger: "#ef4444", warn: "#fbbf24",
    navBg: "#0a0300", headerBg: "#0f0500",
    btnGrad: "linear-gradient(135deg,#dc2626,#fb923c,#fcd34d)",
    dangerBg: "linear-gradient(135deg,#1f0500,#2d0800)",
  },
  navy: {
    name: "Navy Pro", emoji: "🔷", dark: true,
    bg: "#020818", card: "#060f28", card2: "#0a1535", border: "#122050",
    accent: "#3b82f6", accent2: "#60a5fa", text: "#eff6ff", muted: "#3a5080",
    success: "#34d399", danger: "#f87171", warn: "#fbbf24",
    navBg: "#010510", headerBg: "#020818",
    btnGrad: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    dangerBg: "linear-gradient(135deg,#1a0510,#2a0818)",
  },
  rose: {
    name: "Rose", emoji: "🌸", dark: true,
    bg: "#0f000a", card: "#1a000f", card2: "#220015", border: "#4a0025",
    accent: "#f43f5e", accent2: "#fb7185", text: "#fff1f2", muted: "#7a3050",
    success: "#22c55e", danger: "#ef4444", warn: "#f59e0b",
    navBg: "#0a0008", headerBg: "#0f000a",
    btnGrad: "linear-gradient(135deg,#e11d48,#f43f5e)",
    dangerBg: "linear-gradient(135deg,#1f0a0a,#2d1010)",
  },
  gold: {
    name: "Gold", emoji: "✨", dark: true,
    bg: "#0a0800", card: "#150f00", card2: "#1c1400", border: "#3d2e00",
    accent: "#eab308", accent2: "#facc15", text: "#fefce8", muted: "#7a6020",
    success: "#84cc16", danger: "#ef4444", warn: "#f97316",
    navBg: "#060500", headerBg: "#0a0800",
    btnGrad: "linear-gradient(135deg,#ca8a04,#eab308)",
    dangerBg: "linear-gradient(135deg,#1a0f00,#2a1800)",
  },
  saffron: {
    name: "Saffron", emoji: "🧡", dark: true,
    bg: "#0f0800", card: "#1a1000", card2: "#241600", border: "#3d2600",
    accent: "#f97316", accent2: "#fb923c", text: "#fff7ed", muted: "#92623a",
    success: "#84cc16", danger: "#ef4444", warn: "#facc15",
    navBg: "#0a0600", headerBg: "#0f0800",
    btnGrad: "linear-gradient(135deg,#ea580c,#f97316)",
    dangerBg: "linear-gradient(135deg,#1f0a00,#2d1500)",
  },
  light: {
    name: "Clean Light", emoji: "☀️", dark: false,
    bg: "#f8fafc", card: "#ffffff", card2: "#f1f5f9", border: "#e2e8f0",
    accent: "#6366f1", accent2: "#8b5cf6", text: "#0f172a", muted: "#64748b",
    success: "#16a34a", danger: "#dc2626", warn: "#d97706",
    navBg: "#ffffff", headerBg: "#f8fafc",
    btnGrad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    dangerBg: "linear-gradient(135deg,#fef2f2,#fee2e2)",
  },
  soft: {
    name: "Soft Blue", emoji: "🩵", dark: false,
    bg: "#f0f7ff", card: "#ffffff", card2: "#e8f2ff", border: "#c8deff",
    accent: "#2563eb", accent2: "#3b82f6", text: "#1e3a5f", muted: "#6b8ab0",
    success: "#16a34a", danger: "#dc2626", warn: "#d97706",
    navBg: "#ffffff", headerBg: "#f0f7ff",
    btnGrad: "linear-gradient(135deg,#1d4ed8,#2563eb)",
    dangerBg: "linear-gradient(135deg,#fef2f2,#fee2e2)",
  },
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const initialProducts = [
  { id: 1, name: "Floor Mop", brand: "CleanPro", company: "CleanPro Distributors", category: "Mops", unit: "1 pc", costPrice: 280, mrp: 899, sellPrice: 740, stock: 10, minLevel: 5, unitsSoldMonthly: 12, lastOrdered: 3, barcode: "8901234567890", image: null },
  { id: 2, name: "Mop Refill Head", brand: "CleanPro", company: "CleanPro Distributors", category: "Mops", unit: "1 pc", costPrice: 150, mrp: 450, sellPrice: 370, stock: 8, minLevel: 5, unitsSoldMonthly: 20, lastOrdered: 7, barcode: "8901234567891", image: null },
  { id: 3, name: "Mop Bucket", brand: "HomeClean", company: "HomeClean Ltd", category: "Mops", unit: "1 pc", costPrice: 420, mrp: 1299, sellPrice: 1070, stock: 4, minLevel: 3, unitsSoldMonthly: 3, lastOrdered: 14, barcode: "8901234567892", image: null },
  { id: 4, name: "Broom", brand: "SweepIt", company: "SweepIt Agency", category: "Brooms", unit: "1 pc", costPrice: 200, mrp: 650, sellPrice: 535, stock: 6, minLevel: 4, unitsSoldMonthly: 18, lastOrdered: 6, barcode: "8901234567893", image: null },
  { id: 5, name: "Dustpan & Brush", brand: "SweepIt", company: "SweepIt Agency", category: "Brooms", unit: "Set", costPrice: 130, mrp: 399, sellPrice: 329, stock: 3, minLevel: 4, unitsSoldMonthly: 8, lastOrdered: 12, barcode: "8901234567894", image: null },
  { id: 6, name: "Floor Cleaner 1L", brand: "HygienePlus", company: "HygienePlus India", category: "Liquids", unit: "1 L", costPrice: 110, mrp: 349, sellPrice: 290, stock: 15, minLevel: 8, unitsSoldMonthly: 45, lastOrdered: 2, barcode: "8901234567895", image: null },
  { id: 7, name: "Floor Cleaner 5L", brand: "HygienePlus", company: "HygienePlus India", category: "Liquids", unit: "5 L", costPrice: 310, mrp: 899, sellPrice: 740, stock: 7, minLevel: 4, unitsSoldMonthly: 10, lastOrdered: 9, barcode: "8901234567896", image: null },
  { id: 8, name: "Disinfectant Spray", brand: "GermGuard", company: "GermGuard Pvt Ltd", category: "Liquids", unit: "500ml", costPrice: 140, mrp: 425, sellPrice: 350, stock: 2, minLevel: 6, unitsSoldMonthly: 22, lastOrdered: 8, barcode: "8901234567897", image: null },
  { id: 9, name: "Scrub Brush", brand: "ScrubMate", company: "ScrubMate Co", category: "Brushes", unit: "1 pc", costPrice: 65, mrp: 225, sellPrice: 185, stock: 12, minLevel: 5, unitsSoldMonthly: 30, lastOrdered: 4, barcode: "8901234567898", image: null },
  { id: 10, name: "Bleach 1L", brand: "BrightWhite", company: "BrightWhite India", category: "Liquids", unit: "1 L", costPrice: 70, mrp: 225, sellPrice: 185, stock: 4, minLevel: 8, unitsSoldMonthly: 25, lastOrdered: 5, barcode: "8901234567899", image: null },
];

const initialSupplierPhones = {
  "CleanPro Distributors": "", "HomeClean Ltd": "", "SweepIt Agency": "",
  "HygienePlus India": "", "GermGuard Pvt Ltd": "", "ScrubMate Co": "", "BrightWhite India": "",
};
const DEFAULT_CATEGORIES = ["Mops", "Brooms", "Liquids", "Brushes", "Protection", "Cloths"];
const CAT_ICON = { Mops: "🧹", Brooms: "🪣", Liquids: "💧", Brushes: "🪥", Protection: "🧤", Cloths: "🧻" };

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");
const calcMargin = (cost, sell) => sell > 0 ? (((sell - cost) / sell) * 100).toFixed(1) : "0.0";
const calcMarkup = (cost, sell) => cost > 0 ? (((sell - cost) / cost) * 100).toFixed(1) : "0.0";
const calcGMROI = (cost, sell) => cost > 0 ? ((sell - cost) / cost).toFixed(2) : "0.00";
const PERIOD_DAYS = { week: 7, month: 30, year: 365 };
const unitsInPeriod = (p, period) => (p.unitsSoldMonthly || 0) / 30 * PERIOD_DAYS[period];
const turnoverRate = (p, period) => unitsInPeriod(p, period) / Math.max(p.stock, 1);
const performanceScore = (p, period) => parseFloat(calcGMROI(p.costPrice, p.sellPrice)) * turnoverRate(p, period);
const profitInPeriod = (p, period) => (p.sellPrice - p.costPrice) * unitsInPeriod(p, period);
const revenueInPeriod = (p, period) => p.sellPrice * unitsInPeriod(p, period);
const PERF_THRESHOLDS = { week: { good: 1.0, avg: 0.4, low: 0.15 }, month: { good: 4.0, avg: 1.5, low: 0.5 }, year: { good: 48, avg: 18, low: 6 } };
const perfBand = (score, period) => { const t = PERF_THRESHOLDS[period]; if (score >= t.good) return "good"; if (score >= t.avg) return "average"; if (score >= t.low) return "low"; return "bad"; };
const BAND_META = { good: { label: "Good", emoji: "🚀", desc: "High profit + fast moving" }, average: { label: "Average", emoji: "✓", desc: "Steady performer" }, low: { label: "Low", emoji: "⚠", desc: "Slow returns" }, bad: { label: "Bad", emoji: "❌", desc: "Stagnant" } };
function stockStatus(p) { if (p.stock === 0) return "empty"; if (p.stock <= p.minLevel) return "low"; if (p.stock <= p.minLevel * 1.5) return "warn"; return "ok"; }

// ─── ICONS ───────────────────────────────────────────────────────────────────
const WaIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.57a.75.75 0 00.918.918l5.713-1.467A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.715 9.715 0 01-4.944-1.35l-.354-.211-3.668.941.957-3.584-.229-.368A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);


// ─── BARCODE SCANNER ─────────────────────────────────────────────────────────
// Uses QuaggaJS — works on iPhone Safari, Android Chrome, all browsers.
// Loads from CDN. Falls back to manual entry if camera unavailable.
function BarcodeScanner({ onDetected, onClose, T }) {
  const containerRef = useRef(null);
  const doneRef      = useRef(false);
  const lineRef      = useRef(null);
  const linePos      = useRef(0);
  const lineDir      = useRef(1);
  const rafRef       = useRef(null);

  const [phase,       setPhase]      = useState("loading"); // loading|scanning|success|denied|error
  const [statusMsg,   setStatusMsg]  = useState("Loading scanner…");
  const [scannedCode, setScannedCode]= useState("");
  const [manualCode,  setManualCode] = useState("");

  // Animate scan line
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

  // Load Quagga from CDN then start
  useEffect(() => {
    let cancelled = false;

    const loadQuagga = () => new Promise((resolve, reject) => {
      if (window.Quagga) { resolve(window.Quagga); return; }
      const s = document.createElement("script");
      // Use unpkg — most reliable CDN for quagga
      s.src = "https://unpkg.com/quagga@0.12.1/dist/quagga.min.js";
      s.crossOrigin = "anonymous";
      s.onload  = () => window.Quagga ? resolve(window.Quagga) : reject(new Error("Quagga not found on window"));
      s.onerror = () => {
        // Fallback to cdnjs
        const s2 = document.createElement("script");
        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js";
        s2.onload  = () => window.Quagga ? resolve(window.Quagga) : reject(new Error("Quagga load failed"));
        s2.onerror = () => reject(new Error("Could not load scanner library. Check internet connection."));
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

        // Wait for container to be in DOM
        await new Promise(r => setTimeout(r, 100));
        if (cancelled || !containerRef.current) return;

        window.Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: containerRef.current,
            constraints: {
              facingMode: "environment",   // rear camera
              width:  { min: 640, ideal: 1280 },
              height: { min: 480, ideal: 720 },
            },
            area: { // only decode center strip — faster & more accurate
              top:    "25%",
              right:  "10%",
              bottom: "25%",
              left:   "10%",
            },
          },
          locate: true,
          numOfWorkers: navigator.hardwareConcurrency > 2 ? 2 : 1,
          frequency: 10,  // scans per second
          decoder: {
            readers: [
              "ean_reader",        // EAN-13, EAN-8  ← most common in India
              "ean_8_reader",
              "code_128_reader",   // Code 128
              "code_39_reader",    // Code 39
              "upc_reader",        // UPC-A
              "upc_e_reader",      // UPC-E
              "codabar_reader",
              "i2of5_reader",      // ITF
            ],
          },
        }, (err) => {
          if (cancelled) return;
          if (err) {
            if (err.name === "NotAllowedError" || String(err).includes("NotAllowed") || String(err).includes("Permission")) {
              setPhase("denied"); setStatusMsg("Camera permission denied.");
            } else {
              setPhase("error"); setStatusMsg(String(err.message || err));
            }
            return;
          }
          if (!cancelled) {
            window.Quagga.start();
            setPhase("scanning"); setStatusMsg("Point at barcode");
          }
        });

        window.Quagga.onDetected((result) => {
          if (cancelled || doneRef.current) return;
          const code = result?.codeResult?.code;
          if (code && code.length >= 4) fireResult(code);
        });

      } catch (err) {
        if (cancelled) return;
        setPhase("error"); setStatusMsg(err.message || "Scanner failed to load.");
      }
    };

    start();
    return () => { cancelled = true; stopQuagga(); };
  }, [fireResult, stopQuagga]);

  const handleManual = () => {
    const c = manualCode.trim();
    if (c) { stopQuagga(); onDetected(c); }
  };

  const corner = (pos) => {
    const col = phase === "success" ? "#22c55e" : T.accent;
    const base = { position:"absolute", width:34, height:34, borderColor:col, borderStyle:"solid", borderWidth:0 };
    if (pos==="tl") return {...base, top:0, left:0,  borderTopWidth:3, borderLeftWidth:3,  borderRadius:"6px 0 0 0"};
    if (pos==="tr") return {...base, top:0, right:0, borderTopWidth:3, borderRightWidth:3, borderRadius:"0 6px 0 0"};
    if (pos==="bl") return {...base, bottom:0, left:0,  borderBottomWidth:3, borderLeftWidth:3,  borderRadius:"0 0 0 6px"};
    return                {...base, bottom:0, right:0, borderBottomWidth:3, borderRightWidth:3, borderRadius:"0 0 6px 0"};
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000", zIndex:3000, display:"flex", flexDirection:"column", fontFamily:"-apple-system,sans-serif" }}>

      {/* Header */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:20, padding:"50px 18px 16px", background:"linear-gradient(to bottom,rgba(0,0,0,0.92),transparent)", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:800, fontSize:19, color:"#fff" }}>Barcode Scanner</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:3 }}>
            {phase==="loading"  && statusMsg}
            {phase==="scanning" && "Point camera at barcode"}
            {phase==="success"  && "✓ Detected!"}
            {phase==="denied"   && "Camera permission denied"}
            {phase==="error"    && "Scanner error — use manual entry"}
          </div>
        </div>
        <button onClick={handleClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:12, width:42, height:42, color:"#fff", fontSize:20, fontWeight:800, cursor:"pointer", marginTop:2 }}>✕</button>
      </div>

      {/* Camera view — Quagga renders video+canvas here */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>

        {/* Quagga target container */}
        <div
          ref={containerRef}
          style={{ position:"absolute", inset:0 }}
        />

        {/* Quagga renders its own video & canvas inside containerRef.
            We add a style tag to make them fill the container */}
        <style>{`
          #quagga-container video,
          #quagga-container canvas { position:absolute!important; width:100%!important; height:100%!important; object-fit:cover!important; }
        `}</style>

        {/* Vignette */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 300px 190px at 50% 44%, transparent 50%, rgba(0,0,0,0.65) 100%)", pointerEvents:"none", zIndex:2 }} />

        {/* Viewfinder */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-56%)", width:290, height:175, zIndex:3 }}>
          <div style={corner("tl")} /><div style={corner("tr")} />
          <div style={corner("bl")} /><div style={corner("br")} />

          {phase==="scanning" && (
            <div ref={lineRef} style={{ position:"absolute", left:8, right:8, height:2.5, borderRadius:2, background:`linear-gradient(90deg,transparent,${T.accent},${T.accent},transparent)`, boxShadow:`0 0 10px 3px ${T.accent}55`, willChange:"transform", zIndex:4 }} />
          )}

          {phase==="success" && (
            <div style={{ position:"absolute", inset:0, background:"#22c55e18", border:"2.5px solid #22c55e", borderRadius:6, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, zIndex:4 }}>
              <div style={{ fontSize:40 }}>✅</div>
              <div style={{ color:"#22c55e", fontWeight:800, fontSize:14 }}>Scanned!</div>
            </div>
          )}
        </div>

        {/* Loading / error / denied overlay */}
        {(phase==="loading" || phase==="denied" || phase==="error") && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"0 30px", zIndex:5 }}>
            {phase==="loading" && (
              <>
                <div style={{ width:48, height:48, border:"3px solid rgba(255,255,255,0.1)", borderTopColor:T.accent, borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
                <div style={{ color:"#fff", fontSize:15, fontWeight:600 }}>{statusMsg}</div>
              </>
            )}
            {(phase==="denied" || phase==="error") && (
              <>
                <div style={{ fontSize:46 }}>{phase==="denied" ? "🔒" : "⚠️"}</div>
                <div style={{ color:"#fff", fontSize:16, fontWeight:800, textAlign:"center" }}>
                  {phase==="denied" ? "Camera Access Denied" : "Scanner Error"}
                </div>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:13, textAlign:"center", lineHeight:1.65 }}>
                  {phase==="denied"
                    ? "On iPhone: Settings → Safari → Camera → Allow.\nOn Android: tap the lock icon in the address bar → Camera → Allow."
                    : statusMsg + "\n\nUse manual entry below instead."}
                </div>
              </>
            )}
          </div>
        )}

        {/* Format hint pill */}
        {phase==="scanning" && (
          <div style={{ position:"absolute", bottom:14, left:0, right:0, textAlign:"center", zIndex:3 }}>
            <span style={{ background:"rgba(0,0,0,0.6)", borderRadius:20, padding:"5px 14px", fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:0.3 }}>
              EAN-13 · EAN-8 · Code128 · Code39 · UPC · ITF
            </span>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div style={{ background:"#0c0c0c", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"16px 18px 40px" }}>
        {phase==="success" && scannedCode && (
          <div style={{ background:"#22c55e14", border:"1px solid #22c55e35", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:22 }}>✅</div>
            <div>
              <div style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>Scanned successfully</div>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:14, fontFamily:"monospace", marginTop:2, letterSpacing:1 }}>{scannedCode}</div>
            </div>
          </div>
        )}
        <div style={{ color:"rgba(255,255,255,0.28)", fontSize:11, textAlign:"center", marginBottom:10 }}>— or enter barcode manually —</div>
        <div style={{ display:"flex", gap:10 }}>
          <input
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleManual()}
            placeholder="Type barcode number…"
            inputMode="numeric"
            style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"14px", color:"#fff", fontSize:16, outline:"none", fontFamily:"monospace", letterSpacing:1.5 }}
          />
          <button
            onClick={handleManual}
            disabled={!manualCode.trim()}
            style={{ background: manualCode.trim() ? T.btnGrad : "rgba(255,255,255,0.07)", border:"none", borderRadius:12, padding:"0 22px", color:"#fff", fontWeight:800, cursor: manualCode.trim() ? "pointer" : "default", fontSize:15, flexShrink:0, opacity: manualCode.trim() ? 1 : 0.35 }}>
            Find
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── LOCALSTORAGE HOOK ────────────────────────────────────────────────────────
// Persists state to localStorage so data survives refresh / app close
function useLocalState(key, defaultValue) {
  const [state, setStateRaw] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch (_) {}
    return defaultValue;
  });
  const setState = useCallback((valOrFn) => {
    setStateRaw(prev => {
      const next = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch (_) {}
      return next;
    });
  }, [key]);
  return [state, setState];
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Persisted state (survives refresh) ──────────────────────────────────────
  const [themeKey,       setThemeKey]       = useLocalState("ms_theme",       "midnight");
  const [products,       setProducts]       = useLocalState("ms_products",    initialProducts);
  const [categories,     setCategories]     = useLocalState("ms_categories",  DEFAULT_CATEGORIES);
  const [supplierPhones, setSupplierPhones] = useLocalState("ms_phones",      initialSupplierPhones);
  const [storeName,      setStoreName]      = useLocalState("ms_store",       "Family Supermarket");

  const T = THEMES[themeKey];

  // ── Session-only state (fine to reset) ──────────────────────────────────────
  const [tab,             setTab]             = useState("Dashboard");
  const [toast,           setToast]           = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Barcode scanner
  const [showScanner,   setShowScanner]   = useState(false);
  const [scannerTarget, setScannerTarget] = useState("search");

  // POS scan result modal — shows after any barcode scan
  const [posResult, setPosResult] = useState(null);
  // posResult shape: { type:"found"|"new"|"stock", product?, barcode, qty? }
  const [posQtyAdj,  setPosQtyAdj]  = useState(1); // stock adjustment qty

  // Edit modal
  const [editProduct, setEditProduct] = useState(null);
  const [editFields,  setEditFields]  = useState({});

  // Add product form
  const [newProduct, setNewProduct] = useState({ name: "", brand: "", company: "", category: "", unit: "pcs", costPrice: "", mrp: "", sellPrice: "", stock: "", minLevel: "", barcode: "", image: null, dateAdded: new Date().toISOString().slice(0,10) });
  const newImgRef  = useRef(null);
  const editImgRef = useRef(null);

  // Reorder modal
  const [reorderModal, setReorderModal] = useState(null);
  const [reorderQtys,  setReorderQtys]  = useState({});

  // Quick Sell modal — tap Sold button on any product card
  const [sellModal, setSellModal] = useState(null); // product object
  const [sellQty,   setSellQty]   = useState(1);
  const [sellNote,  setSellNote]  = useState("");
  const [sellDate,  setSellDate]  = useState(""); // YYYY-MM-DD, empty = today
  const [sellTime,  setSellTime]  = useState(""); // HH:MM, empty = now

  // Stock tab filters
  const [filterCat,       setFilterCat]       = useState("All");
  const [search,          setSearch]          = useState("");
  const [showReorderOnly, setShowReorderOnly] = useState(false);

  // Performance
  const [perfPeriod,     setPerfPeriod]     = useState("month");
  const [perfBandFilter, setPerfBandFilter] = useState("all");
  const [perfSort,       setPerfSort]       = useState("score");

  // Categories
  const [newCatName, setNewCatName] = useState("");

  // ── Sales log (persisted) ──────────────────────────────────────────────────
  // Each entry: { id, date:"YYYY-MM-DD", time:"HH:MM", productId, productName,
  //               category, qty, costPrice, sellPrice, profit, barcode }
  const [salesLog, setSalesLog] = useLocalState("ms_saleslog", []);

  // Calendar / Sales UI state
  const [calYear,        setCalYear]        = useState(new Date().getFullYear());
  const [calMonth,       setCalMonth]       = useState(new Date().getMonth()); // 0-11
  const [calSelected,    setCalSelected]    = useState(null); // "YYYY-MM-DD" or null
  const [salesRange,     setSalesRange]     = useState("month"); // today|week|month|custom
  const [salesRangeFrom, setSalesRangeFrom] = useState("");
  const [salesRangeTo,   setSalesRangeTo]   = useState("");
  const [salesDetailProd,setSalesDetailProd]= useState(null); // productId filter in sales view
  const [reportView,     setReportView]     = useState("summary"); // "summary" | "detailed"
  const [showReport,     setShowReport]     = useState(false); // full report modal
  const reportRef = useRef(null); // DOM ref for PDF/image capture

  // ── Settings (persisted) ──────────────────────────────────────────────────
  const [settings, setSettings] = useLocalState("ms_settings", {
    storeName:        "Family Supermarket",
    storeAddress:     "",
    ownerName:        "",
    currency:         "₹",
    lowStockAlert:    true,
    soundEnabled:     true,
    autoBackup:       true,
    compactView:      false,
    showBarcode:      true,
    showGMROI:        true,
    defaultTab:       "Dashboard",
    taxRate:          0,
    gstEnabled:       false,
  });
  const setSetting = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2600); };

  // ── Derived ────────────────────────────────────────────────────────────────
  const needsReorder = products.filter(p => p.stock <= p.minLevel);
  const outOfStock = products.filter(p => p.stock === 0);
  const totalCostValue = products.reduce((s, p) => s + p.costPrice * p.stock, 0);
  const totalSellValue = products.reduce((s, p) => s + p.sellPrice * p.stock, 0);
  const totalProfit = totalSellValue - totalCostValue;
  const avgMargin = products.length ? (products.reduce((s, p) => s + parseFloat(calcMargin(p.costPrice, p.sellPrice)), 0) / products.length).toFixed(1) : 0;
  const lowestStock = [...needsReorder].sort((a, b) => a.stock - b.stock)[0];
  const reorderBySupplier = {};
  needsReorder.forEach(p => { const k = p.company || p.brand || "Unknown"; if (!reorderBySupplier[k]) reorderBySupplier[k] = []; reorderBySupplier[k].push(p); });

  // ── Barcode handler (POS-style) ───────────────────────────────────────────
  // IMPORTANT: always use productsRef.current (not products) here — scanner
  // callbacks are async and would otherwise see stale state, causing wrong matches.
  const handleBarcodeDetected = useCallback((rawCode) => {
    setShowScanner(false);

    // Normalise: trim whitespace, uppercase for reliable matching
    const code = String(rawCode).trim();
    if (!code) return;

    // Always read from ref for up-to-date list
    const currentProducts = productsRef.current;

    // Find by exact barcode match (case-insensitive fallback)
    const found = currentProducts.find(
      p => p.barcode && (p.barcode.trim() === code || p.barcode.trim().toLowerCase() === code.toLowerCase())
    );

    if (scannerTarget === "pos" || scannerTarget === "search") {
      if (found) {
        setPosQtyAdj(1);
        // Use fresh product from state via id to guarantee latest values
        const freshProduct = currentProducts.find(p => p.id === found.id);
        setPosResult({ type: "found", product: freshProduct, barcode: code });
      } else {
        setPosResult({ type: "new", barcode: code });
      }
    } else if (scannerTarget === "addProduct") {
      if (found) {
        showToast(`⚠ Already used by: ${found.name}`, "error");
      } else {
        setNewProduct(p => ({ ...p, barcode: code }));
        showToast(`Barcode set: ${code} ✓`);
      }
    } else if (scannerTarget === "editProduct") {
      setEditFields(f => ({ ...f, barcode: code }));
      showToast(`Barcode set: ${code} ✓`);
    }
  }, [scannerTarget]); // scannerTarget is stable during a scan session

  const openScanner = (target) => { setScannerTarget(target); setShowScanner(true); };

  // ── POS stock adjustment ─────────────────────────────────────────────────
  const posAdjustStock = (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    setProducts(ps => ps.map(p =>
      p.id === product.id ? { ...p, stock: newStock } : p
    ));
    // Update posResult so the modal immediately reflects new stock
    setPosResult(prev => prev ? {
      ...prev,
      product: { ...prev.product, stock: newStock }
    } : null);

    // Record sale (negative delta = sold/used, positive = received/restocked)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = now.toTimeString().slice(0, 5);  // HH:MM
    const absQty  = Math.abs(delta);
    const entry = {
      id:          `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      date:        dateStr,
      time:        timeStr,
      productId:   product.id,
      productName: product.name,
      category:    product.category || "",
      barcode:     product.barcode  || "",
      qty:         absQty,
      type:        delta < 0 ? "sale" : "restock",
      costPrice:   product.costPrice,
      sellPrice:   product.sellPrice,
      profit:      delta < 0 ? (product.sellPrice - product.costPrice) * absQty : 0,
      revenue:     delta < 0 ? product.sellPrice * absQty : 0,
    };
    setSalesLog(prev => [entry, ...prev].slice(0, 5000)); // keep max 5000 entries

    const label = delta < 0 ? `Sold ${absQty}` : `Restocked +${absQty}`;
    showToast(`${product.name}: ${label} → ${newStock} left`);
  };

  // ── Quick Sell ────────────────────────────────────────────────────────────
  const openSellModal = (product) => {
    const now = new Date();
    setSellModal(product);
    setSellQty(1);
    setSellNote("");
    setSellDate(now.toISOString().slice(0, 10));   // default = today
    setSellTime(now.toTimeString().slice(0, 5));    // default = now
  };

  const confirmSell = () => {
    if (!sellModal) return;
    const qty = parseInt(sellQty);
    if (!qty || qty < 1) return showToast("Enter valid quantity", "error");
    if (qty > sellModal.stock) return showToast(`Only ${sellModal.stock} in stock`, "error");

    const newStock = sellModal.stock - qty;

    // Update stock
    setProducts(ps => ps.map(p =>
      p.id === sellModal.id ? { ...p, stock: newStock } : p
    ));

    // Record sale in log — use the user-chosen date/time (defaults to now)
    const dateStr = sellDate || new Date().toISOString().slice(0, 10);
    const timeStr = sellTime || new Date().toTimeString().slice(0, 5);
    const entry = {
      id:          `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      date:        dateStr,
      time:        timeStr,
      productId:   sellModal.id,
      productName: sellModal.name,
      category:    sellModal.category || "",
      barcode:     sellModal.barcode  || "",
      qty,
      type:        "sale",
      costPrice:   sellModal.costPrice,
      sellPrice:   sellModal.sellPrice,
      profit:      (sellModal.sellPrice - sellModal.costPrice) * qty,
      revenue:     sellModal.sellPrice * qty,
      note:        sellNote.trim(),
    };
    setSalesLog(prev => [entry, ...prev].slice(0, 5000));

    showToast(`✓ Sold ${qty}× ${sellModal.name} — ${newStock} left`);
    setSellModal(null);
  };

  // After adding a product via barcode, show it in POS view
  const posAddNewFromBarcode = (barcode) => {
    setNewProduct(p => ({ ...p, barcode }));
    setTab("Add");
    setPosResult(null);
    showToast("Fill details then tap Add — it will appear here");
  };

  // showJustAdded removed — addProduct now navigates to Stock tab directly

  // ── Image helpers ──────────────────────────────────────────────────────────
  const handleImageUpload = (file, target) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (target === "newProduct") setNewProduct(p => ({ ...p, image: dataUrl }));
      else if (target === "editProduct") setEditFields(f => ({ ...f, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // ── Edit handlers ──────────────────────────────────────────────────────────
  const openEdit = (p) => {
    setEditProduct(p);
    setEditFields({ name: p.name, brand: p.brand, company: p.company, category: p.category, unit: p.unit, costPrice: p.costPrice, mrp: p.mrp, sellPrice: p.sellPrice, stock: p.stock, minLevel: p.minLevel, barcode: p.barcode || "", image: p.image || null, dateAdded: p.dateAdded || "" });
  };
  const saveEdit = () => {
    const cost = parseFloat(editFields.costPrice), mrp = parseFloat(editFields.mrp), sell = parseFloat(editFields.sellPrice), stock = parseInt(editFields.stock), minLevel = parseInt(editFields.minLevel);
    if ([cost, mrp, sell, stock, minLevel].some(isNaN)) return showToast("Enter valid numbers", "error");
    if (sell > mrp) return showToast("Sell > MRP not allowed", "error");
    setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, ...editFields, costPrice: cost, mrp, sellPrice: sell, stock, minLevel, dateAdded: editFields.dateAdded || p.dateAdded || "" } : p));
    setEditProduct(null); showToast("Updated ✓");
  };
  const deleteProduct = (id) => { setProducts(ps => ps.filter(p => p.id !== id)); showToast("Removed", "error"); };

  const addProduct = () => {
    const { name, costPrice, mrp, sellPrice, stock, minLevel, category } = newProduct;
    if (!name || !costPrice || !mrp || !sellPrice || !stock || !minLevel || !category) return showToast("Fill all required fields", "error");
    if (parseFloat(sellPrice) > parseFloat(mrp)) return showToast("Sell > MRP", "error");
    const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const addedProduct = { id, ...newProduct, costPrice: parseFloat(costPrice), mrp: parseFloat(mrp), sellPrice: parseFloat(sellPrice), stock: parseInt(stock), minLevel: parseInt(minLevel), unitsSoldMonthly: 0, lastOrdered: 0, dateAdded: newProduct.dateAdded || new Date().toISOString().slice(0,10) };
    setProducts(ps => [...ps, addedProduct]);
    if (!supplierPhones[newProduct.company]) setSupplierPhones(s => ({ ...s, [newProduct.company]: "" }));
    setNewProduct({ name: "", brand: "", company: "", category: "", unit: "pcs", costPrice: "", mrp: "", sellPrice: "", stock: "", minLevel: "", barcode: "", image: null, dateAdded: new Date().toISOString().slice(0,10) });
    showToast(`${name} added! ✓`);
    setTab("Stock");    // go straight to Stock so the new product is visible
    setFilterCat("All"); // make sure filter shows it
    setSearch("");       // clear any search so it's not hidden
  };

  const addCategory = () => {
    const c = newCatName.trim();
    if (!c || categories.includes(c)) return showToast(c ? "Category exists" : "Enter name", "error");
    setCategories(cs => [...cs, c]); setNewCatName(""); showToast(`"${c}" added`);
  };
  const deleteCategory = (cat) => {
    if (products.some(p => p.category === cat)) return showToast("Remove products first", "error");
    setCategories(cs => cs.filter(c => c !== cat)); showToast(`"${cat}" removed`);
  };

  const openReorderModal = (company, items) => {
    const qtys = {}; items.forEach(p => { qtys[p.id] = Math.max(p.minLevel * 2 - p.stock, p.minLevel); });
    setReorderQtys(qtys); setReorderModal({ company, items });
  };
  const sendWhatsApp = () => {
    const { company, items } = reorderModal;
    const phone = (supplierPhones[company] || "").replace(/\D/g, "");
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    let msg = `🛒 *REORDER REQUEST*\n📅 ${today}\n🏪 ${storeName}\n🏭 ${company}\n─────────────────`;
    items.forEach((p, i) => { const qty = reorderQtys[p.id] || p.minLevel; msg += `\n\n${i + 1}. *${p.name}*\n   Unit: ${p.unit} | Stock: ${p.stock} | Order: *${qty}*`; });
    msg += `\n\n─────────────────\nItems: ${items.length}\n\nPlease confirm. Thank you! 🙏`;
    window.open((phone ? `https://wa.me/${phone}` : `https://wa.me/`) + `?text=${encodeURIComponent(msg)}`, "_blank");
    showToast("Opening WhatsApp 📲");
  };

  // ── Shared input style ─────────────────────────────────────────────────────
  const inp = (extra = {}) => ({ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 14px", color: T.text, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box", ...extra });

  const allCats = ["All", ...categories];
  const filtered = products.filter(p => {
    const mCat = filterCat === "All" || p.category === filterCat;
    const mSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand||"").toLowerCase().includes(search.toLowerCase()) || (p.company||"").toLowerCase().includes(search.toLowerCase()) || (p.barcode||"").includes(search);
    const mReorder = !showReorderOnly || p.stock <= p.minLevel;
    return mCat && mSearch && mReorder;
  });
  const catHealth = categories.map(cat => { const items = products.filter(p => p.category === cat); if (!items.length) return null; const low = items.filter(p => p.stock <= p.minLevel).length; return { cat, items, low, total: items.length }; }).filter(Boolean);

  // ─── PRODUCT IMAGE COMPONENT ──────────────────────────────────────────────
  const ProductThumb = ({ product, size = 52 }) => (
    product.image
      ? <img src={product.image} alt={product.name} style={{ width: size, height: size, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
      : <div style={{ background: T.card2, borderRadius: 14, width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>{CAT_ICON[product.category] || "📦"}</div>
  );

  return (
    <div style={{ fontFamily: "-apple-system,'SF Pro Display','Segoe UI',sans-serif", background: T.bg, minHeight: "100vh", color: T.text, maxWidth: 430, margin: "0 auto", position: "relative", overflowX: "hidden" }}>

      {/* ── BARCODE SCANNER ─────────────────────────────────────────── */}
      {showScanner && <BarcodeScanner onDetected={handleBarcodeDetected} onClose={() => setShowScanner(false)} T={T} />}

      {/* ── POS SCAN RESULT MODAL ────────────────────────────────────── */}
      {posResult && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:2500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:T.card, borderRadius:"24px 24px 0 0", padding:"20px 20px 40px", width:"100%", maxWidth:430, border:`1px solid ${T.border}` }}>
            <div style={{ width:40, height:4, background:T.border, borderRadius:2, margin:"0 auto 20px" }} />

            {posResult.type === "found" && posResult.product && (() => {
              const p = posResult.product;
              const st = stockStatus(p);
              const stColor = { ok:T.success, warn:T.warn, low:T.danger, empty:T.muted }[st];
              return (
                <div>
                  {/* Just Added badge */}
                  {posResult.justAdded && (
                    <div style={{ background:`${T.success}18`, border:`1px solid ${T.success}40`, borderRadius:12, padding:"8px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:18 }}>✅</span>
                      <div>
                        <div style={{ color:T.success, fontWeight:700, fontSize:13 }}>Product Added Successfully!</div>
                        <div style={{ fontSize:11, color:T.muted }}>Scan the same barcode anytime to view & update stock</div>
                      </div>
                    </div>
                  )}

                  {/* Product found header */}
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                    <div style={{ background:`${T.accent}15`, borderRadius:14, width:60, height:60, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0, overflow:"hidden" }}>
                      {p.image ? <img src={p.image} style={{ width:60, height:60, borderRadius:14, objectFit:"cover" }} /> : (CAT_ICON[p.category] || "📦")}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:800, fontSize:18, lineHeight:1.2 }}>{p.name}</div>
                      <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{p.company || p.brand}</div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{p.category} · {p.unit}</div>
                      {posResult.barcode ? <div style={{ fontSize:10, fontFamily:"monospace", color:T.accent, marginTop:4, background:`${T.accent}12`, padding:"2px 8px", borderRadius:6, display:"inline-block" }}>⌷ {posResult.barcode}</div> : null}
                    </div>
                    <div style={{ background:`${stColor}18`, border:`1.5px solid ${stColor}40`, borderRadius:14, padding:"10px 14px", textAlign:"center", flexShrink:0 }}>
                      <div style={{ fontSize:28, fontWeight:900, color:stColor, lineHeight:1 }}>{p.stock}</div>
                      <div style={{ fontSize:9, color:stColor, fontWeight:600, marginTop:2 }}>IN STOCK</div>
                    </div>
                  </div>

                  {/* Status bar */}
                  <div style={{ background:T.bg, borderRadius:8, height:6, overflow:"hidden", marginBottom:16 }}>
                    <div style={{ height:"100%", width:`${Math.min(100,(p.stock / Math.max(p.minLevel*3,1))*100)}%`, background:stColor, borderRadius:8, transition:"width 0.4s ease" }} />
                  </div>

                  {/* Pricing row */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, background:T.bg, borderRadius:12, padding:12, marginBottom:16 }}>
                    {[["COST", fmt(p.costPrice), T.muted],["MRP", fmt(p.mrp), T.muted],["SELL", fmt(p.sellPrice), T.success]].map(([l,v,c]) => (
                      <div key={l} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:9, color:T.muted }}>{l}</div>
                        <div style={{ fontSize:14, fontWeight:800, color:c }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stock adjustment */}
                  <div style={{ fontSize:11, color:T.muted, marginBottom:8, fontWeight:600 }}>ADJUST STOCK</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                    <button onClick={() => setPosQtyAdj(q => Math.max(1, q - 1))} style={{ background:T.border, border:"none", borderRadius:"10px 0 0 10px", padding:"12px 18px", color:T.text, cursor:"pointer", fontSize:20, fontWeight:700 }}>−</button>
                    <div style={{ flex:1, background:T.bg, border:`1px solid ${T.border}`, borderLeft:"none", borderRight:"none", padding:"12px", fontSize:20, fontWeight:900, color:T.accent, textAlign:"center" }}>{posQtyAdj}</div>
                    <button onClick={() => setPosQtyAdj(q => q + 1)} style={{ background:T.border, border:"none", borderRadius:"0 10px 10px 0", padding:"12px 18px", color:T.text, cursor:"pointer", fontSize:20, fontWeight:700 }}>+</button>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                    <button onClick={() => posAdjustStock(p, -posQtyAdj)}
                      style={{ background:`${T.danger}18`, border:`1.5px solid ${T.danger}50`, borderRadius:14, padding:"14px", color:T.danger, fontWeight:800, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Save Sale
                    </button>
                    <button onClick={() => posAdjustStock(p, +posQtyAdj)}
                      style={{ background:`${T.success}18`, border:`1.5px solid ${T.success}50`, borderRadius:14, padding:"14px", color:T.success, fontWeight:800, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Save Restock
                    </button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <button onClick={() => { openEdit(p); setPosResult(null); }}
                      style={{ background:`${T.accent}18`, border:`1.5px solid ${T.accent}40`, borderRadius:14, padding:"12px", color:T.accent, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      Edit Product
                    </button>
                    <button onClick={() => setPosResult(null)}
                      style={{ background:T.card2, border:"none", borderRadius:14, padding:"12px", color:T.muted, fontWeight:700, fontSize:13, cursor:"pointer" }}>
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}

            {posResult.type === "new" && (
              <div>
                <div style={{ textAlign:"center", marginBottom:20 }}>
                  <div style={{ fontSize:50, marginBottom:10 }}>📦</div>
                  <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>New Product</div>
                  <div style={{ fontSize:12, color:T.muted }}>This barcode isn't in your inventory yet</div>
                  <div style={{ fontFamily:"monospace", fontSize:14, color:T.accent, marginTop:8, background:T.bg, borderRadius:10, padding:"8px 16px", display:"inline-block" }}>
                    ⌷ {posResult.barcode}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button onClick={() => posAddNewFromBarcode(posResult.barcode)}
                    style={{ background:T.btnGrad, border:"none", borderRadius:14, padding:"16px", color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer" }}>
                    ➕ Add This Product
                  </button>
                  <button onClick={() => { openScanner("pos"); setPosResult(null); }}
                    style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:14, padding:"14px", color:T.muted, fontWeight:700, fontSize:14, cursor:"pointer" }}>
                    🔄 Scan Again
                  </button>
                  <button onClick={() => setPosResult(null)}
                    style={{ background:"transparent", border:"none", borderRadius:14, padding:"10px", color:T.muted, fontWeight:600, fontSize:13, cursor:"pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TOAST ───────────────────────────────────────────────────── */}
      {toast && (
        <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: toast.type === "error" ? T.danger : T.success, color: "#fff", padding: "10px 20px", borderRadius: 20, fontWeight: 700, fontSize: 13, boxShadow: "0 4px 24px rgba(0,0,0,0.5)", whiteSpace: "nowrap", animation: "slideDown .2s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* ── THEME PICKER ────────────────────────────────────────────── */}
      {showThemePicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: T.card, borderRadius: "24px 24px 0 0", padding: "20px 20px 40px", width: "100%", maxWidth: 430 }}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Choose Theme</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {Object.entries(THEMES).map(([key, th]) => (
                <button key={key} onClick={() => { setThemeKey(key); setShowThemePicker(false); }}
                  style={{ background: th.bg, border: `2px solid ${themeKey === key ? th.accent : th.border}`, borderRadius: 16, padding: "14px 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: th.btnGrad, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{th.emoji} {th.name}</div>
                    <div style={{ fontSize: 10, color: th.muted }}>Tap to apply</div>
                  </div>
                  {themeKey === key && <div style={{ marginLeft: "auto", color: th.accent, fontWeight: 800 }}>✓</div>}
                </button>
              ))}
            </div>
            <button onClick={() => setShowThemePicker(false)} style={{ width: "100%", background: T.card2, border: "none", borderRadius: 14, padding: 14, color: T.muted, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Close</button>
          </div>
        </div>
      )}

      {/* ── REORDER MODAL ───────────────────────────────────────────── */}
      {reorderModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: T.card, borderRadius: "24px 24px 0 0", padding: "20px 20px 36px", width: "100%", maxWidth: 430, maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "#25d36620", borderRadius: 12, padding: 10, color: "#25d366" }}><WaIcon size={22} /></div>
              <div><div style={{ fontWeight: 800, fontSize: 17 }}>Send Reorder via WhatsApp</div><div style={{ fontSize: 12, color: T.muted }}>{reorderModal.company}</div></div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>STORE NAME</div>
              <input value={storeName} onChange={e => setStoreName(e.target.value)} style={inp()} placeholder="Family Supermarket"
                onBlur={() => showToast("Store name saved ✓")} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>SUPPLIER WHATSAPP NUMBER</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={supplierPhones[reorderModal.company] || ""} onChange={e => setSupplierPhones(s => ({ ...s, [reorderModal.company]: e.target.value }))}
                  type="tel" style={{ ...inp(), flex: 1, width: "auto" }} placeholder="919876543210" />
                <button onClick={() => showToast(`Number saved ✓`)}
                  style={{ background: T.btnGrad, border: "none", borderRadius: 10, padding: "0 14px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13, flexShrink: 0 }}>Save</button>
              </div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>Leave blank → choose contact in WhatsApp</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontWeight: 600 }}>ITEMS TO ORDER</div>
            {reorderModal.items.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.bg, borderRadius: 12, padding: 12, marginBottom: 8 }}>
                <ProductThumb product={p} size={44} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 11, color: T.muted }}>pcs · {p.stock} in stock</div></div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button onClick={() => setReorderQtys(q => ({ ...q, [p.id]: Math.max(1, (q[p.id] || p.minLevel) - 1) }))} style={{ background: T.border, border: "none", borderRadius: "8px 0 0 8px", padding: "7px 11px", color: T.text, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
                  <div style={{ background: T.card2, border: `1px solid ${T.border}`, borderLeft: "none", borderRight: "none", padding: "7px 14px", fontSize: 15, fontWeight: 800, color: T.accent, minWidth: 36, textAlign: "center" }}>{reorderQtys[p.id] || p.minLevel}</div>
                  <button onClick={() => setReorderQtys(q => ({ ...q, [p.id]: (q[p.id] || p.minLevel) + 1 }))} style={{ background: T.border, border: "none", borderRadius: "0 8px 8px 0", padding: "7px 11px", color: T.text, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setReorderModal(null)} style={{ flex: 1, background: T.card2, border: "none", borderRadius: 14, padding: 14, color: T.muted, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Cancel</button>
              <button onClick={sendWhatsApp} style={{ flex: 2, background: "linear-gradient(135deg,#25d366,#128c7e)", border: "none", borderRadius: 14, padding: 14, color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <WaIcon size={18} /> Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QUICK SELL MODAL ───────────────────────────────────────── */}
      {sellModal && (() => {
        const p       = sellModal;
        const revenue = p.sellPrice * sellQty;
        const cost    = p.costPrice * sellQty;
        const profit  = revenue - cost;
        const now     = new Date();
        const dateStr = now.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
        const timeStr = now.toTimeString().slice(0,5);
        const stColor = p.stock <= p.minLevel ? T.danger : p.stock <= p.minLevel*1.5 ? T.warn : T.success;
        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
            <div style={{background:T.card,borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",width:"100%",maxWidth:430,maxHeight:"92vh",overflowY:"auto"}}>
              <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 20px"}}/>

              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                <div style={{background:`${T.success}18`,borderRadius:14,width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,overflow:"hidden"}}>
                  {p.image ? <img src={p.image} style={{width:56,height:56,borderRadius:14,objectFit:"cover"}}/> : (CAT_ICON[p.category]||"📦")}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:18,lineHeight:1.2}}>{p.name}</div>
                  <div style={{fontSize:12,color:T.muted,marginTop:2}}>{p.company||p.brand} · pcs</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:stColor}}>{p.stock} in stock</span>
                    <span style={{fontSize:11,color:T.muted}}>· min {p.minLevel}</span>
                  </div>
                </div>
              </div>

              {/* Date & Time — editable */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.muted,marginBottom:6,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span>🕐 SALE DATE & TIME</span>
                  <button onClick={()=>{const n=new Date();setSellDate(n.toISOString().slice(0,10));setSellTime(n.toTimeString().slice(0,5));}}
                    style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:8,padding:"3px 10px",color:T.muted,cursor:"pointer",fontSize:11,fontWeight:600}}>
                    Reset to Now
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <div>
                    <div style={{fontSize:10,color:T.muted,marginBottom:4,fontWeight:600}}>DATE</div>
                    <input type="date" value={sellDate} onChange={e=>setSellDate(e.target.value)}
                      max={new Date().toISOString().slice(0,10)}
                      style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",fontWeight:600}}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:T.muted,marginBottom:4,fontWeight:600}}>TIME</div>
                    <input type="time" value={sellTime} onChange={e=>setSellTime(e.target.value)}
                      style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",color:T.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",fontWeight:600}}/>
                  </div>
                </div>
                {sellDate !== new Date().toISOString().slice(0,10) && (
                  <div style={{marginTop:6,fontSize:11,color:T.warn,display:"flex",alignItems:"center",gap:5}}>
                    <span>⚠</span> Recording sale for a past date
                  </div>
                )}
              </div>

              {/* Quantity picker */}
              <div style={{fontSize:11,color:T.muted,marginBottom:8,fontWeight:600}}>QUANTITY SOLD</div>
              <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:16}}>
                <button onClick={()=>setSellQty(q=>Math.max(1,q-1))}
                  style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:"12px 0 0 12px",padding:"14px 20px",color:T.text,cursor:"pointer",fontSize:22,fontWeight:700,flexShrink:0}}>−</button>
                <div style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,borderLeft:"none",borderRight:"none",padding:"14px",fontSize:24,fontWeight:900,color:T.accent,textAlign:"center"}}>{sellQty}</div>
                <button onClick={()=>setSellQty(q=>Math.min(p.stock,q+1))}
                  style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:"0 12px 12px 0",padding:"14px 20px",color:T.text,cursor:"pointer",fontSize:22,fontWeight:700,flexShrink:0}}>+</button>
              </div>

              {/* Quick qty presets */}
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                {[1,2,5,10,20,50].filter(n=>n<=p.stock).map(n=>(
                  <button key={n} onClick={()=>setSellQty(n)}
                    style={{background:sellQty===n?T.btnGrad:T.card2,border:`1px solid ${sellQty===n?T.accent:T.border}`,borderRadius:10,padding:"7px 14px",cursor:"pointer",fontSize:13,fontWeight:700,color:sellQty===n?"#fff":T.muted}}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>setSellQty(p.stock)}
                  style={{background:sellQty===p.stock?T.btnGrad:T.card2,border:`1px solid ${sellQty===p.stock?T.accent:T.border}`,borderRadius:10,padding:"7px 14px",cursor:"pointer",fontSize:13,fontWeight:700,color:sellQty===p.stock?"#fff":T.muted}}>
                  All ({p.stock})
                </button>
              </div>

              {/* Sale preview */}
              <div style={{background:T.bg,borderRadius:14,padding:14,marginBottom:14}}>
                <div style={{fontSize:11,color:T.muted,marginBottom:10,fontWeight:600}}>SALE PREVIEW</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,textAlign:"center",marginBottom:10}}>
                  {[
                    {l:"Revenue",v:fmt(revenue),c:T.success},
                    {l:"Cost",   v:fmt(cost),   c:T.warn},
                    {l:"Profit", v:fmt(profit),  c:T.success},
                  ].map(x=>(
                    <div key={x.l}>
                      <div style={{fontSize:15,fontWeight:800,color:x.c}}>{x.v}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>{x.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted,padding:"8px 0",borderTop:`1px solid ${T.border}`}}>
                  <span>Sell price: <b style={{color:T.text}}>{fmt(p.sellPrice)}/unit</b></span>
                  <span>Stock after: <b style={{color:p.stock-sellQty<=p.minLevel?T.danger:T.success}}>{p.stock-sellQty}</b></span>
                </div>
              </div>

              {/* Optional note */}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,color:T.muted,marginBottom:6,fontWeight:600}}>NOTE (optional)</div>
                <input value={sellNote} onChange={e=>setSellNote(e.target.value)}
                  placeholder="e.g. Walk-in customer, discount given..."
                  style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"}}/>
              </div>

              {/* Action buttons */}
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setSellModal(null)}
                  style={{flex:1,background:T.card2,border:"none",borderRadius:14,padding:14,color:T.muted,fontWeight:700,cursor:"pointer",fontSize:15}}>
                  Cancel
                </button>
                <button onClick={confirmSell}
                  style={{flex:2,background:"linear-gradient(135deg,#22c55e,#16a34a)",border:"none",borderRadius:14,padding:14,color:"#fff",fontWeight:800,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Save Sale
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── EDIT MODAL ──────────────────────────────────────────────── */}
      {editProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: T.card, borderRadius: "24px 24px 0 0", padding: "20px 20px 36px", width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto" }}>
            <div style={{ width: 40, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Edit Product</div>
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>{editProduct.name}</div>

            {/* Image upload */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontWeight: 600 }}>PRODUCT IMAGE</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, overflow: "hidden", background: T.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0, border: `2px dashed ${T.border}`, cursor: "pointer" }} onClick={() => editImgRef.current?.click()}>
                  {editFields.image ? <img src={editFields.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{CAT_ICON[editProduct.category] || "📦"}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <button onClick={() => editImgRef.current?.click()} style={{ display: "block", width: "100%", background: T.card2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px", color: T.text, cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📷 Change Photo</button>
                  {editFields.image && <button onClick={() => setEditFields(f => ({ ...f, image: null }))} style={{ display: "block", width: "100%", background: "transparent", border: `1px solid ${T.danger}40`, borderRadius: 10, padding: "8px", color: T.danger, cursor: "pointer", fontSize: 12 }}>Remove Image</button>}
                </div>
                <input ref={editImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImageUpload(e.target.files[0], "editProduct")} />
              </div>
            </div>

            {[["Product Name", "name", "text"], ["Brand", "brand", "text"], ["Company", "company", "text"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{label.toUpperCase()}</div>
                <input type={type} value={editFields[key] || ""} onChange={e => setEditFields(f => ({ ...f, [key]: e.target.value }))} style={inp()} />
              </div>
            ))}

            {/* Barcode */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>BARCODE</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={editFields.barcode || ""} onChange={e => setEditFields(f => ({ ...f, barcode: e.target.value }))} style={inp({ flex: 1, width: "auto" })} placeholder="Scan or type barcode" />
                <button onClick={() => openScanner("editProduct")} style={{ background: T.btnGrad, border: "none", borderRadius: 10, padding: "0 14px", color: "#fff", cursor: "pointer", fontSize: 18, flexShrink: 0 }}>⌷</button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[["Cost ₹", "costPrice"], ["MRP ₹", "mrp"], ["Sell ₹", "sellPrice"]].map(([l, k]) => (
                <div key={k}><div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l}</div>
                  <input type="number" value={editFields[k] || ""} onChange={e => setEditFields(f => ({ ...f, [k]: e.target.value }))} style={inp({ padding: "10px" })} /></div>
              ))}
            </div>
            {editFields.costPrice && editFields.sellPrice && (
              <div style={{ background: T.bg, borderRadius: 12, padding: 12, marginBottom: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, textAlign: "center" }}>
                {[{ l: "Margin", v: `${calcMargin(parseFloat(editFields.costPrice), parseFloat(editFields.sellPrice))}%`, c: parseFloat(calcMargin(editFields.costPrice, editFields.sellPrice)) >= 25 ? T.success : T.danger }, { l: "Markup", v: `${calcMarkup(parseFloat(editFields.costPrice), parseFloat(editFields.sellPrice))}%`, c: T.accent }, { l: "Profit/unit", v: fmt((editFields.sellPrice || 0) - (editFields.costPrice || 0)), c: T.success }].map(x => (
                  <div key={x.l}><div style={{ fontSize: 10, color: T.muted }}>{x.l}</div><div style={{ fontSize: 15, fontWeight: 800, color: x.c }}>{x.v}</div></div>
                ))}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[["Stock", "stock"], ["Min Level", "minLevel"]].map(([l, k]) => (
                <div key={k}><div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l.toUpperCase()}</div>
                  <input type="number" value={editFields[k] || ""} onChange={e => setEditFields(f => ({ ...f, [k]: e.target.value }))} style={inp({ padding: "10px" })} /></div>
              ))}
            </div>

            {/* Date Added — editable */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>📅 DATE ADDED TO INVENTORY</span>
                <button onClick={() => setEditFields(f => ({ ...f, dateAdded: new Date().toISOString().slice(0,10) }))}
                  style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "3px 10px", color: T.muted, cursor: "pointer", fontSize: 11 }}>Today</button>
              </div>
              <input type="date" value={editFields.dateAdded || ""} onChange={e => setEditFields(f => ({ ...f, dateAdded: e.target.value }))}
                max={new Date().toISOString().slice(0,10)}
                style={inp()} />
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>You can backdate this if the product was added earlier</div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditProduct(null)} style={{ flex: 1, background: T.card2, border: "none", borderRadius: 14, padding: 14, color: T.muted, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>✕ Discard</button>
              <button onClick={saveEdit} style={{ flex: 2, background: T.btnGrad, border: "none", borderRadius: 14, padding: 14, color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>💾 Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div style={{ background: T.headerBg, padding: "52px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: T.text }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>Mob Section</div>
            <div style={{ fontSize: 12, color: T.muted }}>Stock Manager • Family Supermarket</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* POS Scan button — main action in header */}
          <button onClick={() => openScanner("pos")} style={{ background: T.btnGrad, border: "none", borderRadius: 12, height: 38, padding: "0 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 13, boxShadow: `0 2px 12px ${T.accent}50` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="5" height="16" rx="1"/><rect x="9" y="4" width="2" height="16" rx="0.5"/><rect x="13" y="4" width="4" height="16" rx="0.5"/><rect x="19" y="4" width="3" height="16" rx="1"/></svg>
            Scan
          </button>
          {/* Theme picker */}
          <button onClick={() => setShowThemePicker(true)} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
            🎨
          </button>
          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            </button>
            {needsReorder.length > 0 && <div style={{ position: "absolute", top: -4, right: -4, background: T.danger, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{needsReorder.length}</div>}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ paddingBottom: 100, overflowY: "auto" }}>

        {/* ════════ DASHBOARD ════════ */}
        {tab === "Dashboard" && (
          <div style={{ padding: "16px 16px 0" }}>
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
                  <button onClick={() => setTab("Stock")} style={{ background: T.danger, border: "none", borderRadius: 12, padding: "10px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Review Items ›</button>
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
                  <button onClick={() => setTab("Stock")} style={{ background: "none", border: "none", color: T.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>View all</button>
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
                <button onClick={() => setTab("Stock")} style={{ background: "none", border: "none", color: T.accent, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>View all</button>
              </div>
              <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                {catHealth.map(({ cat, total, low }, i) => (
                  <div key={cat} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: i < catHealth.length - 1 ? `1px solid ${T.border}` : "none", gap: 14, cursor: "pointer" }} onClick={() => { setTab("Stock"); setFilterCat(cat); }}>
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

        {/* ════════ STOCK ════════ */}
        {tab === "Stock" && (
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input placeholder="Search name, brand, barcode..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp(), flex: 1, borderRadius: 14 }} />
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

        {/* ════════ ADD PRODUCT ════════ */}
        {tab === "Add" && (
          <div style={{ padding: "16px" }}>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 20 }}>Add New Product</div>

            {/* Image upload */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontWeight: 600 }}>PRODUCT IMAGE</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 90, height: 90, borderRadius: 18, overflow: "hidden", background: T.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0, border: `2px dashed ${T.border}`, cursor: "pointer" }} onClick={() => newImgRef.current?.click()}>
                  {newProduct.image ? <img src={newProduct.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📷"}
                </div>
                <div style={{ flex: 1 }}>
                  <button onClick={() => newImgRef.current?.click()} style={{ display: "block", width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px", color: T.text, cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Upload Photo</button>
                  <div style={{ fontSize: 11, color: T.muted }}>Take a photo or choose from gallery</div>
                </div>
                <input ref={newImgRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleImageUpload(e.target.files[0], "newProduct")} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Product Name *", "name", "text", "e.g. Floor Mop"], ["Brand", "brand", "text", "e.g. CleanPro"], ["Company / Agency", "company", "text", "e.g. CleanPro Distributors"]].map(([l, k, t, ph]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l}</div>
                  <input type={t} placeholder={ph} value={newProduct[k]} onChange={e => setNewProduct(p => ({ ...p, [k]: e.target.value }))} style={inp()} />
                </div>
              ))}

              {/* Barcode field */}
              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>BARCODE</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newProduct.barcode} onChange={e => setNewProduct(p => ({ ...p, barcode: e.target.value }))} placeholder="Scan or type barcode" style={inp({ flex: 1, width: "auto" })} />
                  <button onClick={() => openScanner("addProduct")} style={{ background: T.btnGrad, border: "none", borderRadius: 12, padding: "0 16px", color: "#fff", cursor: "pointer", fontSize: 20, flexShrink: 0 }}>⌷</button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>CATEGORY *</div>
                <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{ ...inp(), appearance: "none" }}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["Cost ₹ *", "costPrice"], ["MRP ₹ *", "mrp"], ["Sell ₹ *", "sellPrice"]].map(([l, k]) => (
                  <div key={k}><div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l}</div>
                    <input type="number" value={newProduct[k]} onChange={e => setNewProduct(p => ({ ...p, [k]: e.target.value }))} style={inp({ padding: "10px" })} /></div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Stock *", "stock"], ["Min Level *", "minLevel"]].map(([l, k]) => (
                  <div key={k}><div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l}</div>
                    <input type="number" value={newProduct[k]} onChange={e => setNewProduct(p => ({ ...p, [k]: e.target.value }))} style={inp({ padding: "10px" })} /></div>
                ))}
              </div>

              {/* Date Added — editable */}
              <div>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>📅 DATE ADDED TO INVENTORY</span>
                  <button onClick={() => setNewProduct(p => ({ ...p, dateAdded: new Date().toISOString().slice(0,10) }))}
                    style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "3px 10px", color: T.muted, cursor: "pointer", fontSize: 11 }}>
                    Today
                  </button>
                </div>
                <input type="date" value={newProduct.dateAdded || ""} onChange={e => setNewProduct(p => ({ ...p, dateAdded: e.target.value }))}
                  max={new Date().toISOString().slice(0,10)}
                  style={inp()} />
                <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>When this product was first added to your store (optional)</div>
              </div>

              {newProduct.costPrice && newProduct.sellPrice && (
                <div style={{ background: T.card, borderRadius: 14, padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center", border: `1px solid ${T.border}` }}>
                  <div><div style={{ fontSize: 10, color: T.muted }}>MARGIN</div><div style={{ fontSize: 18, fontWeight: 900, color: T.success }}>{calcMargin(newProduct.costPrice, newProduct.sellPrice)}%</div></div>
                  <div><div style={{ fontSize: 10, color: T.muted }}>MARKUP</div><div style={{ fontSize: 18, fontWeight: 900, color: T.accent }}>{calcMarkup(newProduct.costPrice, newProduct.sellPrice)}%</div></div>
                  <div><div style={{ fontSize: 10, color: T.muted }}>PROFIT/UNIT</div><div style={{ fontSize: 18, fontWeight: 900, color: T.success }}>{fmt(newProduct.sellPrice - newProduct.costPrice)}</div></div>
                </div>
              )}

              <button onClick={addProduct} style={{ background: T.btnGrad, border: "none", borderRadius: 16, padding: 16, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                Add to Inventory
              </button>
            </div>
          </div>
        )}

        {/* ════════ REPORTS / PERFORMANCE ════════ */}
        {tab === "Reports" && (() => {
          const period = perfPeriod;
          const scored = products.map(p => { const score = performanceScore(p, period), profit = profitInPeriod(p, period), revenue = revenueInPeriod(p, period), turn = turnoverRate(p, period), units = unitsInPeriod(p, period), band = perfBand(score, period); return { ...p, _score: score, _profit: profit, _revenue: revenue, _turn: turn, _units: units, _band: band }; });
          const bandCounts = { good: 0, average: 0, low: 0, bad: 0 };
          scored.forEach(p => bandCounts[p._band]++);
          const totalP = scored.reduce((s, p) => s + p._profit, 0), totalR = scored.reduce((s, p) => s + p._revenue, 0), avgScore = scored.length ? scored.reduce((s, p) => s + p._score, 0) / scored.length : 0;
          let visible = perfBandFilter === "all" ? scored : scored.filter(p => p._band === perfBandFilter);
          if (perfSort === "score") visible = [...visible].sort((a, b) => b._score - a._score);
          else if (perfSort === "profit") visible = [...visible].sort((a, b) => b._profit - a._profit);
          else if (perfSort === "turnover") visible = [...visible].sort((a, b) => b._turn - a._turn);
          const bColor = b => ({ good: T.success, average: T.accent, low: T.warn, bad: T.danger })[b];
          return (
            <div style={{ padding: "16px" }}>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>Inventory Performance</div>
              <div style={{ background: T.card, borderRadius: 18, padding: 14, marginBottom: 14, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontWeight: 600 }}>TIME PERIOD</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["week","Week"],["month","Month"],["year","Year"]].map(([k,l]) => (
                    <button key={k} onClick={() => setPerfPeriod(k)} style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, background: perfPeriod === k ? T.btnGrad : T.card2, color: perfPeriod === k ? "#fff" : T.muted }}>{l}</button>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 10, lineHeight: 1.6 }}>Score = GMROI × Stock Turnover · Higher = faster profit generation</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[{l:"Period Profit",v:fmt(totalP),c:T.success,icon:"💰"},{l:"Period Revenue",v:fmt(totalR),c:T.accent,icon:"📊"},{l:"Avg Perf Score",v:avgScore.toFixed(2),c:T.warn,icon:"⚡"},{l:"Products Tracked",v:products.length,c:T.accent2,icon:"📦"}].map((s,i) => (
                  <div key={i} style={{ background: T.card, borderRadius: 16, padding: 14, border: `1px solid ${T.border}` }}><div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div><div style={{ fontSize: 18, fontWeight: 900, color: s.c }}>{s.v}</div><div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s.l}</div></div>
                ))}
              </div>
              <div style={{ background: T.card, borderRadius: 18, padding: 14, border: `1px solid ${T.border}`, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontWeight: 600 }}>PERFORMANCE BANDS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["good",T.success],["average",T.accent],["low",T.warn],["bad",T.danger]].map(([k,c]) => {
                    const m = BAND_META[k], active = perfBandFilter === k;
                    return (<button key={k} onClick={() => setPerfBandFilter(active ? "all" : k)} style={{ background: active ? `${c}20` : T.bg, border: `2px solid ${active ? c : "transparent"}`, borderRadius: 14, padding: 12, cursor: "pointer", textAlign: "left" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><span style={{ fontSize: 18 }}>{m.emoji}</span><span style={{ fontSize: 24, fontWeight: 900, color: c }}>{bandCounts[k]}</span></div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: c }}>{m.label}</div>
                      <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{m.desc}</div>
                    </button>);
                  })}
                </div>
                {perfBandFilter !== "all" && <button onClick={() => setPerfBandFilter("all")} style={{ marginTop: 10, width: "100%", background: T.card2, border: "none", borderRadius: 10, padding: "8px", color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Show All</button>}
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>Sort:</span>
                {[["score","Performance"],["profit","Profit"],["turnover","Turnover"]].map(([k,l]) => (
                  <button key={k} onClick={() => setPerfSort(k)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: perfSort === k ? T.accent : T.card2, color: perfSort === k ? "#fff" : T.muted }}>{l}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, marginBottom: 10 }}>PROFIT PER ITEM · {visible.length} PRODUCTS</div>
              {visible.map((p, idx) => {
                const c = bColor(p._band), meta = BAND_META[p._band];
                return (
                  <div key={p.id} style={{ background: T.card, borderRadius: 16, padding: 14, marginBottom: 10, borderLeft: `4px solid ${c}`, border: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <ProductThumb product={p} size={44} />
                      <div style={{ background: `${c}20`, color: c, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 800 }}>#{idx+1}</div>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</div><div style={{ fontSize: 11, color: T.muted }}>{p.category} · stock: {p.stock}</div></div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: `${c}20`, color: c }}>{meta.emoji} {meta.label}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, background: T.bg, borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      {[["SCORE",p._score.toFixed(2),c],["PROFIT",fmt(p._profit),T.success],["UNITS",p._units.toFixed(1),T.text],["TURN",`${p._turn.toFixed(2)}x`,T.accent]].map(([l,v,col]) => (
                        <div key={l}><div style={{ fontSize: 9, color: T.muted }}>{l}</div><div style={{ fontSize: 13, fontWeight: 800, color: col }}>{v}</div></div>
                      ))}
                    </div>
                    <div style={{ background: T.bg, borderRadius: 6, height: 5, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min(100, (p._score / (PERF_THRESHOLDS[period].good * 1.5)) * 100)}%`, background: c, borderRadius: 6 }} /></div>
                  </div>
                );
              })}
              {visible.length === 0 && <div style={{ textAlign: "center", color: T.muted, padding: 40 }}>No products in this band</div>}
            </div>
          );
        })()}

      </div>


      {/* ════════ SALES CALENDAR & ANALYTICS ════════ */}
      {tab === "Sales" && (() => {
        const today      = new Date().toISOString().slice(0,10);
        const fmtDate    = (d) => { const [y,m,day]=d.split("-"); return `${day}/${m}/${y}`; };
        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

        // ── Range filter ──────────────────────────────────────────────────
        const getRangeLog = () => {
          const now = new Date(); let from, to;
          if (salesRange==="today") { from=to=today; }
          else if (salesRange==="week") { const d=new Date(now); d.setDate(d.getDate()-6); from=d.toISOString().slice(0,10); to=today; }
          else if (salesRange==="month") { from=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-01`; to=today; }
          else { from=salesRangeFrom||"2000-01-01"; to=salesRangeTo||today; }
          return salesLog.filter(e=>e.type==="sale"&&e.date>=from&&e.date<=to);
        };
        const allSalesLog = salesLog.filter(e=>e.type==="sale");
        const rangeLog    = getRangeLog();

        // ── Totals ────────────────────────────────────────────────────────
        const totalUnits   = rangeLog.reduce((s,e)=>s+e.qty,0);
        const totalRev     = rangeLog.reduce((s,e)=>s+e.revenue,0);
        const totalCost    = rangeLog.reduce((s,e)=>s+(e.costPrice*e.qty),0);
        const totalProfit2 = rangeLog.reduce((s,e)=>s+e.profit,0);
        const avgGMROI     = (totalRev-totalProfit2)>0 ? (totalProfit2/(totalRev-totalProfit2)).toFixed(2) : "0.00";
        const profitMargin = totalRev>0 ? ((totalProfit2/totalRev)*100).toFixed(1) : "0.0";

        // All-time totals
        const allUnits   = allSalesLog.reduce((s,e)=>s+e.qty,0);
        const allRev     = allSalesLog.reduce((s,e)=>s+e.revenue,0);
        const allCost    = allSalesLog.reduce((s,e)=>s+(e.costPrice*e.qty),0);
        const allProfit  = allSalesLog.reduce((s,e)=>s+e.profit,0);

        // ── By product ────────────────────────────────────────────────────
        const byProduct = {};
        rangeLog.forEach(e=>{
          if(!byProduct[e.productId]) byProduct[e.productId]={name:e.productName,category:e.category,barcode:e.barcode,qty:0,revenue:0,cost:0,profit:0,entries:[]};
          byProduct[e.productId].qty+=e.qty;
          byProduct[e.productId].revenue+=e.revenue;
          byProduct[e.productId].cost+=e.costPrice*e.qty;
          byProduct[e.productId].profit+=e.profit;
          byProduct[e.productId].entries.push(e);
        });
        const topProducts = Object.values(byProduct).sort((a,b)=>b.revenue-a.revenue);

        // ── By category ───────────────────────────────────────────────────
        const byCat={};
        rangeLog.forEach(e=>{
          if(!byCat[e.category]) byCat[e.category]={qty:0,revenue:0,cost:0,profit:0};
          byCat[e.category].qty+=e.qty; byCat[e.category].revenue+=e.revenue;
          byCat[e.category].cost+=e.costPrice*e.qty; byCat[e.category].profit+=e.profit;
        });
        const catList = Object.entries(byCat).sort((a,b)=>b[1].revenue-a[1].revenue);

        // ── By date ───────────────────────────────────────────────────────
        const byDate={};
        allSalesLog.forEach(e=>{
          if(!byDate[e.date]) byDate[e.date]={qty:0,revenue:0,profit:0,items:[]};
          byDate[e.date].qty+=e.qty; byDate[e.date].revenue+=e.revenue;
          byDate[e.date].profit+=e.profit; byDate[e.date].items.push(e);
        });
        const maxDayRevenue = Math.max(...Object.values(byDate).map(d=>d.revenue),1);

        // ── Calendar ──────────────────────────────────────────────────────
        const firstDay    = new Date(calYear,calMonth,1).getDay();
        const daysInMonth = new Date(calYear,calMonth+1,0).getDate();
        const calCells    = [];
        for(let i=0;i<firstDay;i++) calCells.push(null);
        for(let d=1;d<=daysInMonth;d++) calCells.push(d);
        const selData  = calSelected ? byDate[calSelected] : null;
        const selGMROI = selData&&selData.revenue>0 ? (selData.profit/Math.max(selData.revenue-selData.profit,1)).toFixed(2) : "0.00";

        // ── Report generator ──────────────────────────────────────────────
        const rangeLabel = salesRange==="today"?"Today":salesRange==="week"?"Last 7 Days":salesRange==="month"?"This Month":
          salesRangeFrom&&salesRangeTo ? `${fmtDate(salesRangeFrom)} – ${fmtDate(salesRangeTo)}` : "All Time";

        const generateReportHTML = (mode) => {
          const now = new Date().toLocaleString("en-IN");
          const rows = mode==="detailed"
            ? rangeLog.map(e=>`<tr><td>${fmtDate(e.date)}</td><td>${e.time}</td><td>${e.productName}</td><td>${e.category}</td><td style="text-align:center">${e.qty}</td><td style="text-align:right">₹${e.revenue.toLocaleString("en-IN")}</td><td style="text-align:right">₹${e.profit.toLocaleString("en-IN")}</td><td style="text-align:right">${e.revenue>0?((e.profit/(e.revenue-e.profit))*100).toFixed(1):0}%</td></tr>`).join("")
            : topProducts.map(p=>`<tr><td colspan="2">${p.name}</td><td>${p.category}</td><td style="text-align:center">${p.qty}</td><td style="text-align:right">₹${p.revenue.toLocaleString("en-IN")}</td><td style="text-align:right">₹${p.profit.toLocaleString("en-IN")}</td><td style="text-align:right">${p.revenue>0?((p.profit/p.revenue)*100).toFixed(1):0}%</td><td style="text-align:right">${p.revenue>0?(p.profit/Math.max(p.revenue-p.profit,1)).toFixed(2):0}x</td></tr>`).join("");
          const thead = mode==="detailed"
            ? `<tr><th>Date</th><th>Time</th><th>Product</th><th>Category</th><th>Qty</th><th>Revenue</th><th>Profit</th><th>Margin</th></tr>`
            : `<tr><th colspan="2">Product</th><th>Category</th><th>Qty</th><th>Revenue</th><th>Profit</th><th>Margin%</th><th>GMROI</th></tr>`;
          return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sales Report</title><style>
            body{font-family:-apple-system,Arial,sans-serif;margin:0;padding:20px;color:#1a1a2e;background:#fff}
            .header{background:linear-gradient(135deg,#7c6ef5,#a78bfa);color:#fff;padding:20px 24px;border-radius:12px;margin-bottom:20px}
            .header h1{margin:0;font-size:22px}.header p{margin:4px 0 0;opacity:.8;font-size:13px}
            .summary{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}
            .card{background:#f8f7ff;border:1px solid #e0e0f0;border-radius:10px;padding:14px}
            .card .val{font-size:22px;font-weight:900;color:#7c6ef5}.card .lbl{font-size:11px;color:#666;margin-top:3px}
            .profit-card{background:#f0fff4;border-color:#b2dfdb}.profit-card .val{color:#16a34a}
            .cost-card{background:#fff8f0;border-color:#ffd180}.cost-card .val{color:#d97706}
            table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
            th{background:#7c6ef5;color:#fff;padding:8px 10px;text-align:left;font-size:11px}
            td{padding:7px 10px;border-bottom:1px solid #f0f0f0}
            tr:nth-child(even)td{background:#fafafa}
            .section{font-weight:700;font-size:14px;margin:18px 0 8px;padding-bottom:6px;border-bottom:2px solid #7c6ef5;color:#7c6ef5}
            .footer{margin-top:24px;text-align:center;font-size:11px;color:#999}
            @media print{body{padding:0}.no-print{display:none}}
          </style></head><body>
          <div class="header"><h1>🧹 Sales Report</h1><p>${storeName||"Family Supermarket"} &nbsp;·&nbsp; Period: ${rangeLabel} &nbsp;·&nbsp; Generated: ${now}</p></div>
          <div class="summary">
            <div class="card"><div class="val">${totalUnits}</div><div class="lbl">Units Sold</div></div>
            <div class="card"><div class="val">₹${totalRev.toLocaleString("en-IN")}</div><div class="lbl">Total Revenue</div></div>
            <div class="cost-card card"><div class="val">₹${totalCost.toLocaleString("en-IN")}</div><div class="lbl">Total Cost</div></div>
            <div class="profit-card card"><div class="val">₹${totalProfit2.toLocaleString("en-IN")}</div><div class="lbl">True Profit</div></div>
            <div class="card"><div class="val">${profitMargin}%</div><div class="lbl">Profit Margin</div></div>
            <div class="card"><div class="val">${avgGMROI}x</div><div class="lbl">GMROI</div></div>
          </div>
          <div class="section">${mode==="detailed"?"All Transactions":"Product Summary"}</div>
          <table><thead>${thead}</thead><tbody>${rows}</tbody></table>
          ${catList.length>0?`<div class="section">By Category</div><table><thead><tr><th>Category</th><th>Units</th><th>Revenue</th><th>Cost</th><th>Profit</th><th>Margin%</th></tr></thead><tbody>${catList.map(([cat,d])=>`<tr><td>${cat||"Other"}</td><td style="text-align:center">${d.qty}</td><td style="text-align:right">₹${d.revenue.toLocaleString("en-IN")}</td><td style="text-align:right">₹${d.cost.toLocaleString("en-IN")}</td><td style="text-align:right">₹${d.profit.toLocaleString("en-IN")}</td><td style="text-align:right">${d.revenue>0?((d.profit/d.revenue)*100).toFixed(1):0}%</td></tr>`).join("")}</tbody></table>`:""}
          <div class="footer">Mob Section Stock Manager &nbsp;·&nbsp; ${storeName||"Family Supermarket"}</div>
          </body></html>`;
        };

        const downloadPDF = (mode) => {
          const html = generateReportHTML(mode);
          const blob = new Blob([html], {type:"text/html"});
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement("a");
          a.href=url; a.download=`sales-report-${rangeLabel.replace(/\s/g,"-")}.html`; a.click();
          URL.revokeObjectURL(url);
          showToast("Report downloaded — open in browser then Print → Save as PDF");
        };

        const shareWhatsApp = (mode) => {
          const now = new Date().toLocaleString("en-IN");
          let msg = `🧹 *Sales Report — ${storeName||"Family Supermarket"}*\n`;
          msg += `📅 Period: ${rangeLabel}\n`;
          msg += `🕐 Generated: ${now}\n\n`;
          msg += `━━━━━━━━━━━━━━━━\n`;
          msg += `📦 Units Sold: *${totalUnits}*\n`;
          msg += `💰 Revenue: *₹${totalRev.toLocaleString("en-IN")}*\n`;
          msg += `🏷 Cost: *₹${totalCost.toLocaleString("en-IN")}*\n`;
          msg += `📈 True Profit: *₹${totalProfit2.toLocaleString("en-IN")}*\n`;
          msg += `📊 Margin: *${profitMargin}%* | GMROI: *${avgGMROI}x*\n\n`;
          if (mode==="detailed") {
            msg += `━━━━━━━━━━━━━━━━\n*Transactions*\n`;
            rangeLog.slice(0,20).forEach((e,i)=>{
              msg += `${i+1}. ${e.productName} ×${e.qty} — ₹${e.revenue.toLocaleString("en-IN")} (${fmtDate(e.date)} ${e.time})\n`;
            });
            if(rangeLog.length>20) msg+=`...and ${rangeLog.length-20} more\n`;
          } else {
            msg += `━━━━━━━━━━━━━━━━\n*Top Products*\n`;
            topProducts.slice(0,10).forEach((p,i)=>{
              msg += `${i+1}. ${p.name} — ₹${p.revenue.toLocaleString("en-IN")} (${p.qty} units)\n`;
            });
          }
          msg += `\n_Mob Section Stock Manager_`;
          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
        };

        const shareNative = async (mode) => {
          const text = `Sales Report — ${storeName||"Family Supermarket"}\nPeriod: ${rangeLabel}\nUnits: ${totalUnits} | Revenue: ₹${totalRev.toLocaleString("en-IN")} | Profit: ₹${totalProfit2.toLocaleString("en-IN")} | Margin: ${profitMargin}% | GMROI: ${avgGMROI}x`;
          if (navigator.share) {
            try { await navigator.share({ title:`Sales Report`, text }); }
            catch(_) {}
          } else {
            navigator.clipboard?.writeText(text);
            showToast("Report copied to clipboard!");
          }
        };

        return (
          <div style={{padding:"16px 16px 20px"}}>
            <div style={{fontWeight:800,fontSize:22,marginBottom:2}}>Sales</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:16}}>Tap any date · export reports · track true profit</div>

            {/* ── View toggle: Summary / Detailed ─────────────────────── */}
            <div style={{display:"flex",background:T.card2,borderRadius:14,padding:3,marginBottom:14}}>
              {[["summary","📊 Summary"],["detailed","📋 Detailed"]].map(([k,l])=>(
                <button key={k} onClick={()=>setReportView(k)}
                  style={{flex:1,padding:"10px",borderRadius:11,border:"none",cursor:"pointer",fontSize:13,fontWeight:800,background:reportView===k?T.btnGrad:"transparent",color:reportView===k?"#fff":T.muted,transition:"all .2s"}}>
                  {l}
                </button>
              ))}
            </div>

            {/* ── Range selector ─────────────────────────────────────── */}
            <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
              {[["today","Today"],["week","7 Days"],["month","This Month"],["custom","Custom"]].map(([k,l])=>(
                <button key={k} onClick={()=>setSalesRange(k)}
                  style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap",background:salesRange===k?T.accent:T.card2,color:salesRange===k?"#fff":T.muted,flexShrink:0}}>
                  {l}
                </button>
              ))}
            </div>
            {salesRange==="custom"&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[["From",salesRangeFrom,setSalesRangeFrom],["To",salesRangeTo,setSalesRangeTo]].map(([l,v,fn])=>(
                  <div key={l}>
                    <div style={{fontSize:10,color:T.muted,marginBottom:4,fontWeight:600}}>{l.toUpperCase()}</div>
                    <input type="date" value={v} onChange={e=>fn(e.target.value)}
                      style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
            )}

            {/* ── All-time banner ────────────────────────────────────── */}
            <div style={{background:`linear-gradient(135deg,${T.accent}22,${T.accent2}11)`,border:`1px solid ${T.accent}40`,borderRadius:16,padding:14,marginBottom:14}}>
              <div style={{fontSize:11,color:T.accent,fontWeight:700,marginBottom:8}}>ALL TIME TOTALS</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {[["Units",allUnits,T.text],["Revenue",fmt(allRev),T.success],["Cost",fmt(allCost),T.warn],["Profit",fmt(allProfit),T.success]].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:900,color:c}}>{v}</div>
                    <div style={{fontSize:9,color:T.muted,marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Period summary cards ───────────────────────────────── */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
              {[
                {label:"Units Sold",    value:totalUnits,        color:T.accent,  icon:"📦"},
                {label:"Revenue",       value:fmt(totalRev),     color:T.success, icon:"💰"},
                {label:"Total Cost",    value:fmt(totalCost),    color:T.warn,    icon:"🏷"},
                {label:"True Profit",   value:fmt(totalProfit2), color:T.success, icon:"📈"},
                {label:"Profit Margin", value:`${profitMargin}%`,color:T.accent2, icon:"📊"},
                {label:"GMROI",         value:`${avgGMROI}x`,   color:T.warn,    icon:"⚡"},
              ].map((s,i)=>(
                <div key={i} style={{background:T.card,borderRadius:14,padding:14,border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontSize:i<2?20:17,fontWeight:900,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Export / Share bar ─────────────────────────────────── */}
            {rangeLog.length>0&&(
              <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,padding:14,marginBottom:14}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:700,marginBottom:10}}>EXPORT / SHARE — {reportView==="summary"?"Summary":"Detailed"} Report</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <button onClick={()=>downloadPDF(reportView)}
                    style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <span style={{fontSize:24}}>📄</span>
                    <span style={{fontSize:12,fontWeight:700,color:T.text}}>Save as PDF</span>
                    <span style={{fontSize:10,color:T.muted}}>Opens in browser</span>
                  </button>
                  <button onClick={()=>shareWhatsApp(reportView)}
                    style={{background:"#25d36618",border:"1px solid #25d36640",borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <span style={{fontSize:24}}>📲</span>
                    <span style={{fontSize:12,fontWeight:700,color:"#25d366"}}>Send on WhatsApp</span>
                    <span style={{fontSize:10,color:T.muted}}>Pre-filled message</span>
                  </button>
                  <button onClick={()=>shareNative(reportView)}
                    style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <span style={{fontSize:24}}>📤</span>
                    <span style={{fontSize:12,fontWeight:700,color:T.text}}>Share / Copy</span>
                    <span style={{fontSize:10,color:T.muted}}>Any app</span>
                  </button>
                  <button onClick={()=>{ navigator.clipboard?.writeText(generateReportHTML(reportView)); showToast("HTML copied!"); }}
                    style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <span style={{fontSize:24}}>📋</span>
                    <span style={{fontSize:12,fontWeight:700,color:T.text}}>Copy Report</span>
                    <span style={{fontSize:10,color:T.muted}}>Paste anywhere</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── Calendar ───────────────────────────────────────────── */}
            <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,padding:14,marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <button onClick={()=>{let m=calMonth-1,y=calYear;if(m<0){m=11;y--;}setCalMonth(m);setCalYear(y);setCalSelected(null);}}
                  style={{background:T.card2,border:"none",borderRadius:10,width:36,height:36,color:T.text,cursor:"pointer",fontSize:18,fontWeight:700}}>‹</button>
                <div style={{fontWeight:800,fontSize:16}}>{monthNames[calMonth]} {calYear}</div>
                <button onClick={()=>{let m=calMonth+1,y=calYear;if(m>11){m=0;y++;}setCalMonth(m);setCalYear(y);setCalSelected(null);}}
                  style={{background:T.card2,border:"none",borderRadius:10,width:36,height:36,color:T.text,cursor:"pointer",fontSize:18,fontWeight:700}}>›</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
                {dayNames.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:T.muted,padding:"4px 0"}}>{d}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                {calCells.map((day,idx)=>{
                  if(!day) return <div key={`e${idx}`}/>;
                  const dateStr=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                  const data=byDate[dateStr], isToday=dateStr===today, isSel=dateStr===calSelected;
                  const heat=data?Math.min(1,data.revenue/maxDayRevenue):0;
                  const hexAlpha=Math.round(heat*180+30).toString(16).padStart(2,"0");
                  const cellBg=isSel?T.accent:data?`${T.accent}${hexAlpha}`:"transparent";
                  return (
                    <button key={dateStr} onClick={()=>setCalSelected(isSel?null:dateStr)}
                      style={{aspectRatio:"1",borderRadius:10,border:isToday?`2px solid ${T.accent}`:"none",background:cellBg,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:2}}>
                      <span style={{fontSize:12,fontWeight:isToday||isSel?900:500,color:isSel?"#fff":data?T.text:T.muted}}>{day}</span>
                      {data&&!isSel&&<div style={{width:4,height:4,borderRadius:"50%",background:T.accent,marginTop:1}}/>}
                    </button>
                  );
                })}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10,justifyContent:"flex-end"}}>
                <div style={{fontSize:9,color:T.muted}}>Low</div>
                {[0.15,0.35,0.6,0.8,1].map(h=>(
                  <div key={h} style={{width:12,height:12,borderRadius:3,background:`${T.accent}${Math.round(h*180+30).toString(16).padStart(2,"0")}`}}/>
                ))}
                <div style={{fontSize:9,color:T.muted}}>High</div>
              </div>
            </div>

            {/* ── Selected date detail ───────────────────────────────── */}
            {calSelected&&(
              <div style={{background:T.card,borderRadius:16,border:`2px solid ${T.accent}50`,padding:14,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:16}}>📅 {fmtDate(calSelected)}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>{selData?`${selData.items.length} transaction${selData.items.length!==1?"s":""}` : "No sales"}</div>
                  </div>
                  <button onClick={()=>setCalSelected(null)} style={{background:T.card2,border:"none",borderRadius:8,padding:"5px 10px",color:T.muted,cursor:"pointer",fontSize:13}}>✕</button>
                </div>
                {selData?(
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,background:T.bg,borderRadius:12,padding:12,marginBottom:10}}>
                      {[["Units",selData.qty,T.accent],["Revenue",fmt(selData.revenue),T.success],["Profit",fmt(selData.profit),T.success],["GMROI",`${selGMROI}x`,T.warn]].map(([l,v,c])=>(
                        <div key={l} style={{textAlign:"center"}}>
                          <div style={{fontSize:13,fontWeight:800,color:c}}>{v}</div>
                          <div style={{fontSize:9,color:T.muted}}>{l}</div>
                        </div>
                      ))}
                    </div>
                    {selData.items.sort((a,b)=>b.time.localeCompare(a.time)).map(e=>(
                      <div key={e.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:13}}>{e.productName}</div>
                          <div style={{fontSize:10,color:T.muted}}>{e.category} · {e.time}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontWeight:700,fontSize:13,color:T.accent}}>×{e.qty}</div>
                          <div style={{fontSize:10,color:T.success}}>{fmt(e.revenue)}</div>
                          <div style={{fontSize:10,color:T.muted}}>profit {fmt(e.profit)}</div>
                        </div>
                      </div>
                    ))}
                  </>
                ):(
                  <div style={{textAlign:"center",padding:"20px 0",color:T.muted,fontSize:14}}>No sales on this date.</div>
                )}
              </div>
            )}

            {/* ── SUMMARY view ──────────────────────────────────────── */}
            {reportView==="summary"&&(
              <>
                {topProducts.length>0&&(
                  <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14}}>
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontWeight:700,fontSize:14}}>🏆 Top Products</div>
                      <div style={{fontSize:11,color:T.muted}}>by revenue</div>
                    </div>
                    {topProducts.map((prod,idx)=>{
                      const prodGMROI=prod.revenue>0?(prod.profit/Math.max(prod.revenue-prod.profit,1)).toFixed(2):"0.00";
                      const prodMargin=prod.revenue>0?((prod.profit/prod.revenue)*100).toFixed(1):"0.0";
                      const pct=prod.revenue/Math.max(topProducts[0].revenue,1)*100;
                      return (
                        <div key={idx} style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{background:`${T.accent}20`,color:T.accent,borderRadius:8,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>#{idx+1}</div>
                              <div>
                                <div style={{fontWeight:700,fontSize:13}}>{prod.name}</div>
                                <div style={{fontSize:10,color:T.muted}}>{prod.category} · {prod.qty} units</div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontWeight:800,fontSize:13,color:T.success}}>{fmt(prod.revenue)}</div>
                              <div style={{fontSize:10,color:T.muted}}>profit {fmt(prod.profit)}</div>
                              <div style={{fontSize:10,color:T.warn}}>GMROI {prodGMROI}x · {prodMargin}%</div>
                            </div>
                          </div>
                          <div style={{background:T.bg,borderRadius:4,height:4,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pct}%`,background:T.btnGrad,borderRadius:4}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {catList.length>0&&(
                  <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14}}>
                    <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{fontWeight:700,fontSize:14}}>📂 By Category</div>
                    </div>
                    {catList.map(([cat,data])=>{
                      const catMargin=data.revenue>0?((data.profit/data.revenue)*100).toFixed(1):"0.0";
                      return (
                        <div key={cat} style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:18}}>{CAT_ICON[cat]||"📦"}</span>
                              <div>
                                <div style={{fontWeight:600,fontSize:13}}>{cat||"Other"}</div>
                                <div style={{fontSize:10,color:T.muted}}>{data.qty} units</div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontWeight:700,color:T.success,fontSize:13}}>{fmt(data.revenue)}</div>
                              <div style={{fontSize:10,color:T.muted}}>cost {fmt(data.cost)} · profit {fmt(data.profit)}</div>
                              <div style={{fontSize:10,color:T.accent}}>margin {catMargin}%</div>
                            </div>
                          </div>
                          <div style={{background:T.bg,borderRadius:4,height:4,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${data.revenue/Math.max(catList[0][1].revenue,1)*100}%`,background:T.btnGrad,borderRadius:4}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── DETAILED view ─────────────────────────────────────── */}
            {reportView==="detailed"&&(
              <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontWeight:700,fontSize:14}}>📋 All Transactions</div>
                  <div style={{fontSize:11,color:T.muted}}>{rangeLog.length} entries</div>
                </div>
                {rangeLog.length===0&&(
                  <div style={{padding:"30px",textAlign:"center",color:T.muted}}>No transactions in this period</div>
                )}
                {rangeLog.slice(0,100).map(e=>{
                  const txMargin=e.revenue>0?((e.profit/e.revenue)*100).toFixed(1):"0.0";
                  return (
                    <div key={e.id} style={{padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:13}}>{e.productName}</div>
                          <div style={{fontSize:10,color:T.muted}}>{e.category} · {fmtDate(e.date)} {e.time}</div>
                          {e.barcode&&<div style={{fontSize:9,color:T.muted,fontFamily:"monospace"}}>⌷ {e.barcode}</div>}
                        </div>
                        <div style={{textAlign:"right",flexShrink:0,marginLeft:10}}>
                          <div style={{fontWeight:700,color:T.accent}}>×{e.qty}</div>
                          <div style={{fontSize:12,color:T.success,fontWeight:600}}>{fmt(e.revenue)}</div>
                          <div style={{fontSize:10,color:T.muted}}>cost {fmt(e.costPrice*e.qty)}</div>
                          <div style={{fontSize:10,color:T.success}}>profit {fmt(e.profit)} ({txMargin}%)</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {rangeLog.length>100&&(
                  <div style={{padding:"10px 16px",textAlign:"center",color:T.muted,fontSize:12}}>
                    Showing 100 of {rangeLog.length} — use PDF export to see all
                  </div>
                )}
              </div>
            )}

            {rangeLog.length===0&&allSalesLog.length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",background:T.card,borderRadius:18,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:48,marginBottom:12}}>📊</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No Sales Yet</div>
                <div style={{fontSize:13,color:T.muted,lineHeight:1.6}}>
                  Tap <b>Scan</b> in the header → scan a product → tap <b>− Sold</b> to record a sale.
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── SETTINGS TAB ────────────────────────────────────────────── */}
      {tab === "Settings" && (
        <div style={{ padding: "16px 16px 20px" }}>
          <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Settings</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
            <span style={{ fontSize: 12, color: T.muted }}>Toggles & theme save automatically · Store info & contacts need Save</span>
          </div>

          {/* ── Store Info ── */}
          {(() => {
            const [draftStore, setDraftStore] = useState({ storeName: settings.storeName||"", ownerName: settings.ownerName||"", storeAddress: settings.storeAddress||"" });
            const storeChanged = draftStore.storeName !== (settings.storeName||"") || draftStore.ownerName !== (settings.ownerName||"") || draftStore.storeAddress !== (settings.storeAddress||"");
            const saveStore = () => { Object.entries(draftStore).forEach(([k,v]) => setSetting(k,v)); showToast("Store info saved ✓"); };
            return (
              <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${storeChanged ? T.warn : T.border}`, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>🏪</span>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Store Information</span>
                    {storeChanged && <span style={{ fontSize: 10, background: `${T.warn}25`, color: T.warn, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>Unsaved</span>}
                  </div>
                  {storeChanged && (
                    <button onClick={saveStore} style={{ background: T.btnGrad, border: "none", borderRadius: 10, padding: "6px 14px", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Save</button>
                  )}
                </div>
                {[
                  { label: "Store Name", key: "storeName", placeholder: "Family Supermarket" },
                  { label: "Owner Name", key: "ownerName", placeholder: "Your name" },
                  { label: "Store Address", key: "storeAddress", placeholder: "Address" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 11, color: T.muted, marginBottom: 5, fontWeight: 600 }}>{label.toUpperCase()}</div>
                    <input value={draftStore[key] || ""} onChange={e => setDraftStore(d => ({ ...d, [key]: e.target.value }))} placeholder={placeholder}
                      style={{ background: "transparent", border: "none", color: T.text, fontSize: 15, outline: "none", width: "100%", fontWeight: 500 }} />
                  </div>
                ))}
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 11, color: T.muted, marginBottom: 5, fontWeight: 600 }}>CURRENCY SYMBOL</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["₹", "$", "€", "£", "¥"].map(c => (
                      <button key={c} onClick={() => setSetting("currency", c)}
                        style={{ background: settings.currency === c ? T.btnGrad : T.card2, border: `1px solid ${settings.currency === c ? T.accent : T.border}`, borderRadius: 10, padding: "8px 14px", color: settings.currency === c ? "#fff" : T.text, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                {storeChanged && (
                  <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
                    <button onClick={() => setDraftStore({ storeName: settings.storeName||"", ownerName: settings.ownerName||"", storeAddress: settings.storeAddress||"" })}
                      style={{ flex: 1, background: T.card2, border: "none", borderRadius: 12, padding: "11px", color: T.muted, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Discard</button>
                    <button onClick={saveStore}
                      style={{ flex: 2, background: T.btnGrad, border: "none", borderRadius: 12, padding: "11px", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 14 }}>💾 Save Store Info</button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── Themes ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🎨</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Appearance</span>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontWeight: 600 }}>THEME</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(THEMES).map(([key, th]) => (
                  <button key={key} onClick={() => setThemeKey(key)}
                    style={{ background: th.bg, border: `2px solid ${themeKey === key ? th.accent : th.border}`, borderRadius: 14, padding: "12px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: th.btnGrad, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: th.text }}>{th.emoji} {th.name}</div>
                      <div style={{ fontSize: 9, color: th.muted }}>{th.dark ? "Dark" : "Light"}</div>
                    </div>
                    {themeKey === key && <div style={{ marginLeft: "auto", color: th.accent, fontWeight: 900, fontSize: 14 }}>✓</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Notifications & Alerts ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔔</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Alerts & Display</span>
            </div>
            {[
              { label: "Low Stock Alerts", sub: "Show reorder warnings on dashboard", key: "lowStockAlert" },
              { label: "Compact View", sub: "Smaller product cards in stock list", key: "compactView" },
              { label: "Show Barcode", sub: "Display barcode number on product cards", key: "showBarcode" },
              { label: "Show GMROI", sub: "Show profitability metric on cards", key: "showGMROI" },
            ].map(({ label, sub, key }) => (
              <div key={key} style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{sub}</div>
                </div>
                <div onClick={() => setSetting(key, !settings[key])}
                  style={{ width: 46, height: 26, borderRadius: 13, background: settings[key] ? T.accent : T.border, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ position: "absolute", top: 3, left: settings[key] ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Tax / GST ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🧾</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Tax & GST</span>
            </div>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>GST Enabled</div>
                <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Show GST calculations</div>
              </div>
              <div onClick={() => setSetting("gstEnabled", !settings.gstEnabled)}
                style={{ width: 46, height: 26, borderRadius: 13, background: settings.gstEnabled ? T.accent : T.border, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: settings.gstEnabled ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
            {settings.gstEnabled && (
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontWeight: 600 }}>DEFAULT TAX RATE (%)</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[0, 5, 12, 18, 28].map(r => (
                    <button key={r} onClick={() => setSetting("taxRate", r)}
                      style={{ background: settings.taxRate === r ? T.btnGrad : T.card2, border: `1px solid ${settings.taxRate === r ? T.accent : T.border}`, borderRadius: 10, padding: "8px 14px", color: settings.taxRate === r ? "#fff" : T.text, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Categories ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📂</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Categories</span>
            </div>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="New category name..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyDown={e => e.key === "Enter" && addCategory()}
                  style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14, outline: "none" }} />
                <button onClick={addCategory} style={{ background: T.btnGrad, border: "none", borderRadius: 10, padding: "10px 16px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Add</button>
              </div>
            </div>
            {categories.map(cat => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <div key={cat} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{CAT_ICON[cat] || "📦"}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{cat}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{count} product{count !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteCategory(cat)} style={{ background: `${T.danger}15`, border: "none", borderRadius: 8, padding: "6px 12px", color: T.danger, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Remove</button>
                </div>
              );
            })}
          </div>

          {/* ── Suppliers ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🏭</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Supplier Contacts</span>
            </div>
            {[...new Set(products.map(p => p.company).filter(Boolean))].map(company => {
              const saved = supplierPhones[company] || "";
              const [draft, setDraft] = useState(saved);
              const changed = draft !== saved;
              return (
                <div key={company} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{company}</div>
                    {changed && <span style={{ fontSize: 10, background: `${T.warn}25`, color: T.warn, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>Unsaved</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={draft} onChange={e => setDraft(e.target.value)}
                      placeholder="WhatsApp number (e.g. 919876543210)" type="tel"
                      style={{ flex: 1, background: T.bg, border: `1px solid ${changed ? T.warn : T.border}`, borderRadius: 10, padding: "9px 12px", color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    <button onClick={() => { setSupplierPhones(s => ({ ...s, [company]: draft })); showToast(`${company} number saved ✓`); }}
                      disabled={!changed}
                      style={{ background: changed ? T.btnGrad : T.border, border: "none", borderRadius: 10, padding: "9px 14px", color: "#fff", fontWeight: 700, cursor: changed ? "pointer" : "default", fontSize: 13, flexShrink: 0, opacity: changed ? 1 : 0.4 }}>
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Data Management ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>💾</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Data Management</span>
            </div>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Export Data</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>Download all products as JSON backup</div>
              <button onClick={() => {
                const data = { products, categories, supplierPhones, exportedAt: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "mob-section-backup.json"; a.click();
                showToast("Exported ✓");
              }} style={{ background: T.btnGrad, border: "none", borderRadius: 12, padding: "10px 18px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                ⬇ Download Backup
              </button>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: T.danger }}>Reset All Data</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>Clear all products and restore defaults</div>
              <button onClick={() => {
                if (window.confirm("Reset ALL data? This cannot be undone.")) {
                  setProducts(initialProducts); setCategories(DEFAULT_CATEGORIES);
                  localStorage.clear(); showToast("Reset complete", "error");
                }
              }} style={{ background: `${T.danger}18`, border: `1px solid ${T.danger}40`, borderRadius: 12, padding: "10px 18px", color: T.danger, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                🗑 Reset Data
              </button>
            </div>
          </div>

          {/* ── App Info ── */}
          <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, padding: "16px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🧹</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Mob Section</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Stock Manager v2.0</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Family Supermarket · {products.length} products</div>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ──────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.navBg, borderTop: `1px solid ${T.border}`, padding: "10px 0 24px", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 500 }}>
        {[
          { key:"Dashboard", label:"Home", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
          { key:"Stock", label:"Stock", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
          { key:"Add", label:"Add", isAdd:true, icon:(
            <div style={{ background: T.btnGrad, borderRadius:"50%", width:52, height:52, display:"flex", alignItems:"center", justifyContent:"center", marginTop:-16, boxShadow:`0 4px 20px ${T.accent}60` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          )},
          { key:"Sales", label:"Sales", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14" strokeWidth="3" strokeLinecap="round"/><line x1="12" y1="14" x2="12" y2="14" strokeWidth="3" strokeLinecap="round"/><line x1="16" y1="14" x2="16" y2="14" strokeWidth="3" strokeLinecap="round"/></svg> },
          { key:"Settings", label:"Settings", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
        ].map(({ key, label, icon, isAdd }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 10px", color: isAdd ? "transparent" : active ? T.accent : T.muted }}>
              {icon}
              {!isAdd && <span style={{ fontSize:9, fontWeight: active ? 800 : 600, color: active ? T.accent : T.muted }}>{label}</span>}
            </button>
          );
        })}
      </div>

      {/* ── SYNC STATUS ─────────────────────────────────────────────── */}
      <div style={{ position:"fixed", bottom:82, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:T.navBg, borderTop:`1px solid ${T.border}`, padding:"5px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:499 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={T.success}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
          <span style={{ fontSize:11, color:T.muted }}>Last sync: Just now</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:11, color:T.muted }}>Data is up to date</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={T.success}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
        </div>
      </div>

      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-10px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { border-radius: 3px; }
        select option { background: #141420; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}
