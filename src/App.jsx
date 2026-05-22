import { useState, useRef, useEffect, useCallback } from "react";

// ─── THEMES ──────────────────────────────────────────────────────────────────
const THEMES = {
  midnight: {
    name: "Midnight", emoji: "🌙",
    bg: "#0d0d14", card: "#141420", card2: "#1a1a2a", border: "#252538",
    accent: "#7c6ef5", accent2: "#a78bfa", text: "#f0f0ff", muted: "#6b6b8a",
    success: "#22c55e", danger: "#ef4444", warn: "#f59e0b",
    navBg: "#10101c", headerBg: "#0d0d14",
    btnGrad: "linear-gradient(135deg,#7c6ef5,#a78bfa)",
    dangerBg: "linear-gradient(135deg,#1f0a0a,#2d1010)",
  },
  saffron: {
    name: "Saffron", emoji: "🧡",
    bg: "#0f0800", card: "#1a1000", card2: "#241600", border: "#3d2600",
    accent: "#f97316", accent2: "#fb923c", text: "#fff7ed", muted: "#92623a",
    success: "#84cc16", danger: "#ef4444", warn: "#facc15",
    navBg: "#0a0600", headerBg: "#0f0800",
    btnGrad: "linear-gradient(135deg,#ea580c,#f97316)",
    dangerBg: "linear-gradient(135deg,#1f0a00,#2d1500)",
  },
  emerald: {
    name: "Emerald", emoji: "💚",
    bg: "#020f0a", card: "#051a10", card2: "#082216", border: "#0f3d20",
    accent: "#10b981", accent2: "#34d399", text: "#ecfdf5", muted: "#4a7a60",
    success: "#10b981", danger: "#f43f5e", warn: "#fbbf24",
    navBg: "#010a06", headerBg: "#020f0a",
    btnGrad: "linear-gradient(135deg,#059669,#10b981)",
    dangerBg: "linear-gradient(135deg,#1a0a10,#2d0818)",
  },
  ocean: {
    name: "Ocean", emoji: "🌊",
    bg: "#00090f", card: "#00121e", card2: "#001828", border: "#0a3248",
    accent: "#0ea5e9", accent2: "#38bdf8", text: "#f0f9ff", muted: "#2d6a8a",
    success: "#22d3ee", danger: "#f43f5e", warn: "#fbbf24",
    navBg: "#000609", headerBg: "#00090f",
    btnGrad: "linear-gradient(135deg,#0284c7,#0ea5e9)",
    dangerBg: "linear-gradient(135deg,#0a0015,#100020)",
  },
  rose: {
    name: "Rose", emoji: "🌸",
    bg: "#0f000a", card: "#1a000f", card2: "#220015", border: "#4a0025",
    accent: "#f43f5e", accent2: "#fb7185", text: "#fff1f2", muted: "#7a3050",
    success: "#22c55e", danger: "#ef4444", warn: "#f59e0b",
    navBg: "#0a0008", headerBg: "#0f000a",
    btnGrad: "linear-gradient(135deg,#e11d48,#f43f5e)",
    dangerBg: "linear-gradient(135deg,#1f0a0a,#2d1010)",
  },
  gold: {
    name: "Gold", emoji: "✨",
    bg: "#0a0800", card: "#150f00", card2: "#1c1400", border: "#3d2e00",
    accent: "#eab308", accent2: "#facc15", text: "#fefce8", muted: "#7a6020",
    success: "#84cc16", danger: "#ef4444", warn: "#f97316",
    navBg: "#060500", headerBg: "#0a0800",
    btnGrad: "linear-gradient(135deg,#ca8a04,#eab308)",
    dangerBg: "linear-gradient(135deg,#1a0f00,#2a1800)",
  },
  light: {
    name: "Light", emoji: "☀️",
    bg: "#f8fafc", card: "#ffffff", card2: "#f1f5f9", border: "#e2e8f0",
    accent: "#6366f1", accent2: "#8b5cf6", text: "#0f172a", muted: "#64748b",
    success: "#16a34a", danger: "#dc2626", warn: "#d97706",
    navBg: "#ffffff", headerBg: "#f8fafc",
    btnGrad: "linear-gradient(135deg,#6366f1,#8b5cf6)",
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
// Uses native BarcodeDetector API (built into Chrome 83+, Android WebView, Safari 17.4+)
// + canvas RAF loop for continuous scanning from live camera stream.
// No external library required — works fully offline in sandboxed environments.
function BarcodeScanner({ onDetected, onClose, T }) {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const doneRef     = useRef(false);   // prevent double-fire
  const lineRef     = useRef(null);
  const linePos     = useRef(0);
  const lineDir     = useRef(1);

  const [phase,       setPhase]      = useState("starting"); // starting|scanning|success|denied|unsupported|error
  const [statusMsg,   setStatusMsg]  = useState("Starting camera…");
  const [scannedCode, setScannedCode]= useState("");
  const [manualCode,  setManualCode] = useState("");
  const [torchOn,     setTorchOn]    = useState(false);
  const [torchOK,     setTorchOK]    = useState(false);
  const [frameCount,  setFrameCount] = useState(0); // heartbeat so user sees activity

  // ── stop everything cleanly ───────────────────────────────────────────────
  const stopAll = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const handleClose = useCallback(() => { stopAll(); onClose(); }, [stopAll, onClose]);

  const fireResult = useCallback((code) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setScannedCode(code);
    setPhase("success");
    // vibrate if available
    try { navigator.vibrate?.(120); } catch (_) {}
    setTimeout(() => { stopAll(); onDetected(code); }, 900);
  }, [stopAll, onDetected]);

  // ── main camera + scan loop ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // 1. Check BarcodeDetector support
      if (!("BarcodeDetector" in window)) {
        setPhase("unsupported");
        setStatusMsg("BarcodeDetector not supported in this browser.");
        return;
      }

      // 2. Open camera — prefer rear camera, high res for better detection
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width:  { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 },
            focusMode: "continuous",       // auto-focus where supported
          },
          audio: false,
        });
      } catch (err) {
        if (cancelled) return;
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPhase("denied"); setStatusMsg("Camera permission denied.");
        } else {
          setPhase("error"); setStatusMsg("Could not open camera: " + err.message);
        }
        return;
      }

      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;

      // 3. Torch support check
      const vtrack = stream.getVideoTracks()[0];
      try {
        const caps = vtrack.getCapabilities?.() ?? {};
        if (caps.torch) setTorchOK(true);
      } catch (_) {}

      // 4. Attach to video element
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      video.muted = true;
      try { await video.play(); } catch (_) {}
      if (cancelled) return;

      // 5. Create BarcodeDetector — list all supported formats
      let detector;
      try {
        const supported = await BarcodeDetector.getSupportedFormats().catch(() => []);
        const wantedFormats = ["ean_13","ean_8","code_128","code_39","code_93",
          "upc_a","upc_e","qr_code","data_matrix","itf","codabar","aztec","pdf417"];
        const formats = supported.length > 0
          ? wantedFormats.filter(f => supported.includes(f))
          : wantedFormats;
        detector = new BarcodeDetector({ formats: formats.length > 0 ? formats : ["ean_13","code_128","qr_code"] });
      } catch (e) {
        setPhase("unsupported"); setStatusMsg("BarcodeDetector init failed: " + e.message);
        return;
      }

      setPhase("scanning"); setStatusMsg("Point camera at barcode");

      // 6. Canvas for frame capture (gives BarcodeDetector a crisp ImageBitmap)
      const canvas  = canvasRef.current;
      const ctx     = canvas.getContext("2d", { willReadFrequently: true });
      let frameN    = 0;
      let lastScan  = 0;

      const tick = async (ts) => {
        if (cancelled || doneRef.current) return;
        rafRef.current = requestAnimationFrame(tick);

        // Animate scan line
        linePos.current += lineDir.current * 2;
        if (linePos.current >= 140 || linePos.current <= 0) lineDir.current *= -1;
        if (lineRef.current) lineRef.current.style.transform = `translateY(${linePos.current}px)`;

        // Heartbeat counter every ~30 frames
        frameN++;
        if (frameN % 30 === 0) setFrameCount(n => n + 1);

        // Scan at ~12 fps (every 80 ms) — enough for real-time, not heavy on CPU
        if (ts - lastScan < 80) return;
        lastScan = ts;

        if (video.readyState < 2 || video.videoWidth === 0) return;

        // Draw full video frame to canvas
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        // Detect
        try {
          const codes = await detector.detect(canvas);
          if (codes.length > 0 && !doneRef.current) {
            const best = codes.reduce((a, b) => {
              const scoreA = a.rawValue.length + (a.format === "ean_13" || a.format === "code_128" ? 5 : 0);
              const scoreB = b.rawValue.length + (b.format === "ean_13" || b.format === "code_128" ? 5 : 0);
              return scoreB > scoreA ? b : a;
            });
            if (best.rawValue) fireResult(best.rawValue);
          }
        } catch (_) {
          // DetectorError on bad frames is normal — ignore
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    run();
    return () => { cancelled = true; stopAll(); };
  }, [fireResult, stopAll]);

  // ── Torch toggle ─────────────────────────────────────────────────────────
  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn(v => !v);
    } catch (_) {}
  };

  // ── Manual entry ─────────────────────────────────────────────────────────
  const handleManual = () => {
    const c = manualCode.trim();
    if (c) { stopAll(); onDetected(c); }
  };

  // ── Corner bracket helper ─────────────────────────────────────────────────
  const corner = (pos) => {
    const base = { position:"absolute", width:32, height:32, borderColor: phase==="success" ? "#22c55e" : T.accent, borderStyle:"solid", borderWidth:0 };
    if (pos==="tl") return { ...base, top:0, left:0, borderTopWidth:3, borderLeftWidth:3, borderRadius:"6px 0 0 0" };
    if (pos==="tr") return { ...base, top:0, right:0, borderTopWidth:3, borderRightWidth:3, borderRadius:"0 6px 0 0" };
    if (pos==="bl") return { ...base, bottom:0, left:0, borderBottomWidth:3, borderLeftWidth:3, borderRadius:"0 0 0 6px" };
    return { ...base, bottom:0, right:0, borderBottomWidth:3, borderRightWidth:3, borderRadius:"0 0 6px 0" };
  };

  const isActive = phase === "scanning";

  return (
    <div style={{ position:"fixed", inset:0, background:"#000", zIndex:3000, display:"flex", flexDirection:"column" }}>

      {/* Hidden canvas used for frame extraction */}
      <canvas ref={canvasRef} style={{ display:"none" }} />

      {/* ── Header ── */}
      <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:20, padding:"48px 18px 18px", background:"linear-gradient(to bottom,rgba(0,0,0,0.9) 60%,transparent)", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:800, fontSize:19, color:"#fff", letterSpacing:-0.3 }}>Barcode Scanner</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:3 }}>
            {phase==="starting"  && "Starting camera…"}
            {phase==="scanning"  && (frameCount > 0 ? `Scanning… (frame ${frameCount * 30})` : "Scanning…")}
            {phase==="success"   && `✓ Got it!`}
            {phase==="denied"    && "Camera permission denied"}
            {phase==="unsupported" && "BarcodeDetector not supported"}
            {phase==="error"     && statusMsg}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:2 }}>
          {torchOK && (
            <button onClick={toggleTorch} style={{ background: torchOn ? "#facc15" : "rgba(255,255,255,0.14)", border:"none", borderRadius:12, width:42, height:42, fontSize:18, cursor:"pointer", color: torchOn ? "#000" : "#fff" }}>🔦</button>
          )}
          <button onClick={handleClose} style={{ background:"rgba(255,255,255,0.14)", border:"none", borderRadius:12, width:42, height:42, color:"#fff", fontSize:19, fontWeight:800, cursor:"pointer" }}>✕</button>
        </div>
      </div>

      {/* ── Camera view ── */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <video ref={videoRef} style={{ width:"100%", height:"100%", objectFit:"cover" }} playsInline muted autoPlay />

        {/* Vignette — keeps corners dark so viewfinder pops */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 310px 195px at 50% 44%, transparent 52%, rgba(0,0,0,0.68) 100%)", pointerEvents:"none" }} />

        {/* Viewfinder */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-56%)", width:290, height:175 }}>
          <div style={corner("tl")} /><div style={corner("tr")} />
          <div style={corner("bl")} /><div style={corner("br")} />

          {/* Scan line — only when actively scanning */}
          {isActive && (
            <div ref={lineRef} style={{ position:"absolute", left:8, right:8, height:2, borderRadius:2, background:`linear-gradient(90deg,transparent,${T.accent}cc,${T.accent},${T.accent}cc,transparent)`, boxShadow:`0 0 10px 2px ${T.accent}66`, willChange:"transform" }} />
          )}

          {/* Success overlay */}
          {phase==="success" && (
            <div style={{ position:"absolute", inset:0, background:"#22c55e18", border:"2.5px solid #22c55e", borderRadius:6, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6 }}>
              <div style={{ fontSize:38, lineHeight:1 }}>✅</div>
              <div style={{ color:"#22c55e", fontWeight:800, fontSize:13 }}>Detected!</div>
            </div>
          )}
        </div>

        {/* State overlays */}
        {(phase==="starting" || phase==="denied" || phase==="unsupported" || phase==="error") && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.78)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:"0 32px" }}>
            {phase==="starting" && (
              <>
                <div style={{ width:46, height:46, border:`3px solid rgba(255,255,255,0.12)`, borderTopColor:T.accent, borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />
                <div style={{ color:"#fff", fontSize:15, fontWeight:600 }}>Opening camera…</div>
              </>
            )}
            {(phase==="denied" || phase==="unsupported" || phase==="error") && (
              <>
                <div style={{ fontSize:44 }}>{phase==="denied" ? "🔒" : "⚠️"}</div>
                <div style={{ color:"#fff", fontSize:16, fontWeight:800, textAlign:"center" }}>
                  {phase==="denied" ? "Camera Access Denied" : phase==="unsupported" ? "Scanner Not Supported" : "Camera Error"}
                </div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, textAlign:"center", lineHeight:1.6 }}>
                  {phase==="denied" && "Go to browser Settings → Site permissions → Camera → Allow, then re-open the scanner."}
                  {phase==="unsupported" && "BarcodeDetector requires Chrome 83+, Edge 83+, or Safari 17.4+. Use manual entry below."}
                  {phase==="error" && statusMsg}
                </div>
              </>
            )}
          </div>
        )}

        {/* Format pill */}
        {isActive && (
          <div style={{ position:"absolute", bottom:14, left:0, right:0, textAlign:"center" }}>
            <span style={{ background:"rgba(0,0,0,0.65)", borderRadius:20, padding:"5px 14px", fontSize:10, color:"rgba(255,255,255,0.55)", letterSpacing:0.3 }}>
              EAN-13 · EAN-8 · Code128 · Code39 · UPC · QR · DataMatrix
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom panel ── */}
      <div style={{ background:"#0c0c0c", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"16px 18px 38px" }}>

        {/* Success result display */}
        {phase==="success" && scannedCode && (
          <div style={{ background:"#22c55e15", border:"1px solid #22c55e35", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontSize:22 }}>✅</div>
            <div>
              <div style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>Scanned successfully</div>
              <div style={{ color:"rgba(255,255,255,0.65)", fontSize:13, fontFamily:"monospace", marginTop:2 }}>{scannedCode}</div>
            </div>
          </div>
        )}

        <div style={{ color:"rgba(255,255,255,0.28)", fontSize:11, textAlign:"center", marginBottom:10 }}>— or enter barcode manually —</div>
        <div style={{ display:"flex", gap:10 }}>
          <input
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handleManual()}
            placeholder="Type or paste barcode…"
            inputMode="numeric"
            style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.11)", borderRadius:12, padding:"13px 14px", color:"#fff", fontSize:15, outline:"none", fontFamily:"monospace", letterSpacing:1 }}
          />
          <button
            onClick={handleManual}
            disabled={!manualCode.trim()}
            style={{ background: manualCode.trim() ? T.btnGrad : "rgba(255,255,255,0.07)", border:"none", borderRadius:12, padding:"0 22px", color:"#fff", fontWeight:800, cursor: manualCode.trim() ? "pointer" : "default", fontSize:15, flexShrink:0, opacity: manualCode.trim() ? 1 : 0.35, transition:"opacity .15s" }}>
            Find
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [themeKey, setThemeKey] = useState("midnight");
  const T = THEMES[themeKey];

  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [supplierPhones, setSupplierPhones] = useState(initialSupplierPhones);
  const [tab, setTab] = useState("Dashboard");
  const [toast, setToast] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Barcode scanner
  const [showScanner, setShowScanner] = useState(false);
  const [scannerTarget, setScannerTarget] = useState("search"); // "search" | "addProduct"

  // Edit modal
  const [editProduct, setEditProduct] = useState(null);
  const [editFields, setEditFields] = useState({});

  // Add product form
  const [newProduct, setNewProduct] = useState({ name: "", brand: "", company: "", category: "", unit: "1 pc", costPrice: "", mrp: "", sellPrice: "", stock: "", minLevel: "", unitsSoldMonthly: "", barcode: "", image: null });
  const newImgRef = useRef(null);
  const editImgRef = useRef(null);

  // Reorder modal
  const [reorderModal, setReorderModal] = useState(null);
  const [reorderQtys, setReorderQtys] = useState({});
  const [storeName, setStoreName] = useState("Family Supermarket");

  // Stock tab
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showReorderOnly, setShowReorderOnly] = useState(false);

  // Performance
  const [perfPeriod, setPerfPeriod] = useState("month");
  const [perfBandFilter, setPerfBandFilter] = useState("all");
  const [perfSort, setPerfSort] = useState("score");

  // Categories
  const [newCatName, setNewCatName] = useState("");

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

  // ── Barcode handler ────────────────────────────────────────────────────────
  const handleBarcodeDetected = (code) => {
    setShowScanner(false);
    if (scannerTarget === "search") {
      const found = products.find(p => p.barcode === code);
      if (found) { setTab("Stock"); setSearch(found.name); showToast(`Found: ${found.name} ✓`); }
      else { showToast(`Barcode ${code} not found`, "error"); setSearch(code); setTab("Stock"); }
    } else if (scannerTarget === "addProduct") {
      const found = products.find(p => p.barcode === code);
      if (found) showToast(`Barcode already used by: ${found.name}`, "error");
      else { setNewProduct(p => ({ ...p, barcode: code })); showToast(`Barcode scanned: ${code} ✓`); }
    } else if (scannerTarget === "editProduct") {
      setEditFields(f => ({ ...f, barcode: code })); showToast(`Barcode scanned: ${code} ✓`);
    }
  };

  const openScanner = (target) => { setScannerTarget(target); setShowScanner(true); };

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
    setEditFields({ name: p.name, brand: p.brand, company: p.company, category: p.category, unit: p.unit, costPrice: p.costPrice, mrp: p.mrp, sellPrice: p.sellPrice, stock: p.stock, minLevel: p.minLevel, unitsSoldMonthly: p.unitsSoldMonthly || 0, barcode: p.barcode || "", image: p.image || null });
  };
  const saveEdit = () => {
    const cost = parseFloat(editFields.costPrice), mrp = parseFloat(editFields.mrp), sell = parseFloat(editFields.sellPrice), stock = parseInt(editFields.stock), minLevel = parseInt(editFields.minLevel);
    if ([cost, mrp, sell, stock, minLevel].some(isNaN)) return showToast("Enter valid numbers", "error");
    if (sell > mrp) return showToast("Sell > MRP not allowed", "error");
    setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, ...editFields, costPrice: cost, mrp, sellPrice: sell, stock, minLevel, unitsSoldMonthly: parseFloat(editFields.unitsSoldMonthly) || 0 } : p));
    setEditProduct(null); showToast("Updated ✓");
  };
  const deleteProduct = (id) => { setProducts(ps => ps.filter(p => p.id !== id)); showToast("Removed", "error"); };

  const addProduct = () => {
    const { name, costPrice, mrp, sellPrice, stock, minLevel, category } = newProduct;
    if (!name || !costPrice || !mrp || !sellPrice || !stock || !minLevel || !category) return showToast("Fill all required fields", "error");
    if (parseFloat(sellPrice) > parseFloat(mrp)) return showToast("Sell > MRP", "error");
    const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts(ps => [...ps, { id, ...newProduct, costPrice: parseFloat(costPrice), mrp: parseFloat(mrp), sellPrice: parseFloat(sellPrice), stock: parseInt(stock), minLevel: parseInt(minLevel), unitsSoldMonthly: parseFloat(newProduct.unitsSoldMonthly) || 0, lastOrdered: 0 }]);
    if (!supplierPhones[newProduct.company]) setSupplierPhones(s => ({ ...s, [newProduct.company]: "" }));
    setNewProduct({ name: "", brand: "", company: "", category: "", unit: "1 pc", costPrice: "", mrp: "", sellPrice: "", stock: "", minLevel: "", unitsSoldMonthly: "", barcode: "", image: null });
    setTab("Stock"); showToast(`${name} added!`);
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
              <input value={storeName} onChange={e => setStoreName(e.target.value)} style={inp()} placeholder="Family Supermarket" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>SUPPLIER WHATSAPP NUMBER</div>
              <input value={supplierPhones[reorderModal.company] || ""} onChange={e => setSupplierPhones(s => ({ ...s, [reorderModal.company]: e.target.value }))} type="tel" style={inp()} placeholder="919876543210" />
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>Leave blank → choose contact in WhatsApp</div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontWeight: 600 }}>ITEMS TO ORDER</div>
            {reorderModal.items.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.bg, borderRadius: 12, padding: 12, marginBottom: 8 }}>
                <ProductThumb product={p} size={44} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 11, color: T.muted }}>{p.unit} · {p.stock} in stock</div></div>
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

            {[["Product Name", "name", "text"], ["Brand", "brand", "text"], ["Company", "company", "text"], ["Unit", "unit", "text"]].map(([label, key, type]) => (
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
              {[["Stock", "stock"], ["Min Level", "minLevel"], ["Sold/Month", "unitsSoldMonthly"]].map(([l, k]) => (
                <div key={k}><div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l.toUpperCase()}</div>
                  <input type="number" value={editFields[k] || ""} onChange={e => setEditFields(f => ({ ...f, [k]: e.target.value }))} style={inp({ padding: "10px" })} /></div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditProduct(null)} style={{ flex: 1, background: T.card2, border: "none", borderRadius: 14, padding: 14, color: T.muted, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Cancel</button>
              <button onClick={saveEdit} style={{ flex: 2, background: T.btnGrad, border: "none", borderRadius: 14, padding: 14, color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 15 }}>Save Changes</button>
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
          {/* Barcode scan from header */}
          <button onClick={() => openScanner("search")} style={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="5" height="16" rx="1"/><rect x="9" y="4" width="2" height="16" rx="0.5"/><rect x="13" y="4" width="4" height="16" rx="0.5"/><rect x="19" y="4" width="3" height="16" rx="1"/></svg>
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
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Min: {p.minLevel} · Last ordered: {p.lastOrdered} days ago</div>
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
                          <div style={{ fontSize: 12, color: T.muted }}>{p.company || p.brand} · {p.unit}</div>
                          {p.barcode && <div style={{ fontSize: 10, color: T.muted, marginTop: 2, fontFamily: "monospace" }}>⌷ {p.barcode}</div>}
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
                        <button onClick={() => openEdit(p)} style={{ flex: 1, background: `${T.accent}18`, border: `1px solid ${T.accent}40`, borderRadius: 10, padding: "8px", color: T.accent, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✏ Edit</button>
                        {(st === "low" || st === "empty") && (
                          <button onClick={() => openReorderModal(p.company || p.brand, [p])} style={{ flex: 2, background: "#25d36615", border: "1px solid #25d36640", borderRadius: 10, padding: "8px", color: "#25d366", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><WaIcon size={12} /> Reorder</button>
                        )}
                        <button onClick={() => deleteProduct(p.id)} style={{ background: `${T.danger}15`, border: `1px solid ${T.danger}30`, borderRadius: 10, padding: "8px 12px", color: T.danger, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✕</button>
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
              {[["Product Name *", "name", "text", "e.g. Floor Mop"], ["Brand", "brand", "text", "e.g. CleanPro"], ["Company / Agency", "company", "text", "e.g. CleanPro Distributors"], ["Unit Size", "unit", "text", "e.g. 1 pc, 1 L, Set"]].map(([l, k, t, ph]) => (
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["Stock *", "stock"], ["Min Level *", "minLevel"], ["Sold/Month", "unitsSoldMonthly"]].map(([l, k]) => (
                  <div key={k}><div style={{ fontSize: 10, color: T.muted, marginBottom: 4, fontWeight: 600 }}>{l}</div>
                    <input type="number" value={newProduct[k]} onChange={e => setNewProduct(p => ({ ...p, [k]: e.target.value }))} style={inp({ padding: "10px" })} /></div>
                ))}
              </div>

              {newProduct.costPrice && newProduct.sellPrice && (
                <div style={{ background: T.card, borderRadius: 14, padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center", border: `1px solid ${T.border}` }}>
                  <div><div style={{ fontSize: 10, color: T.muted }}>MARGIN</div><div style={{ fontSize: 18, fontWeight: 900, color: T.success }}>{calcMargin(newProduct.costPrice, newProduct.sellPrice)}%</div></div>
                  <div><div style={{ fontSize: 10, color: T.muted }}>MARKUP</div><div style={{ fontSize: 18, fontWeight: 900, color: T.accent }}>{calcMarkup(newProduct.costPrice, newProduct.sellPrice)}%</div></div>
                  <div><div style={{ fontSize: 10, color: T.muted }}>PROFIT/UNIT</div><div style={{ fontSize: 18, fontWeight: 900, color: T.success }}>{fmt(newProduct.sellPrice - newProduct.costPrice)}</div></div>
                </div>
              )}

              <button onClick={addProduct} style={{ background: T.btnGrad, border: "none", borderRadius: 16, padding: 16, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Add to Stock List</button>
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

      {/* ── BOTTOM NAV ──────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.navBg, borderTop: `1px solid ${T.border}`, padding: "10px 0 24px", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 500 }}>
        {[
          { key:"Dashboard", label:"Dashboard", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> },
          { key:"Stock", label:"Stock", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
          { key:"Add", label:"Add Product", isAdd:true, icon:(
            <div style={{ background: T.btnGrad, borderRadius:"50%", width:52, height:52, display:"flex", alignItems:"center", justifyContent:"center", marginTop:-16, boxShadow:`0 4px 20px ${T.accent}60` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          )},
          { key:"Reports", label:"Reports", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
        ].map(({ key, label, icon, isAdd }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 18px", color: isAdd ? "transparent" : active ? T.accent : T.muted }}>
              {icon}
              <span style={{ fontSize:10, fontWeight: active ? 800 : 600, color: isAdd ? T.muted : active ? T.accent : T.muted }}>{label}</span>
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
