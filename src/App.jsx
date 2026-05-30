// ─── APP.JSX ──────────────────────────────────────────────────────────────────
// This file is the ORCHESTRATION LAYER only.
// It wires together: store → hooks → screens → modals.
// No business logic here. No calculations. No long JSX trees.
// If this file grows beyond ~100 lines, something is in the wrong place.
//
// ARCHITECTURE OVERVIEW:
//
//   App.jsx           ← You are here (orchestration)
//   ├── store/        ← Global state (AppStore.jsx)
//   ├── hooks/        ← Reusable logic (useToast, useTheme, useSaleActions…)
//   ├── constants/    ← Config values (themes.js, app.js)
//   ├── utils/        ← Pure math functions (calculations.js)
//   ├── styles/       ← CSS (global.css)
//   └── components/
//       ├── shared/   ← Reusable UI atoms (Button, Toggle, Modal…)
//       ├── modals/   ← Full-screen modals (Sell, Edit, Reorder, Scanner…)
//       └── screens/  ← Tab screens (Dashboard, Stock, Sales, Settings…)

import { useState, useCallback } from "react";
import { StoreProvider, useStore, Actions } from "./store/AppStore.jsx";
import { THEMES }                           from "./constants/themes.js";
import { CAT_ICON }                         from "./constants/app.js";
import { useToast, useTheme, useTabNavigation } from "./hooks/index.js";
import { ErrorBoundary, Toast }             from "./components/shared/index.jsx";

// ── Screen imports ─────────────────────────────────────────────────────────────
import Dashboard  from "./components/screens/Dashboard.jsx";
import StockScreen from "./components/screens/StockScreen.jsx";
import SalesScreen from "./components/screens/SalesScreen.jsx";
import AddProduct  from "./components/screens/AddProduct.jsx";
import SettingsScreen from "./components/screens/SettingsScreen.jsx";

// ── Modal imports ──────────────────────────────────────────────────────────────
import SellModal     from "./components/modals/SellModal.jsx";
import EditModal     from "./components/modals/EditModal.jsx";
import ReorderModal  from "./components/modals/ReorderModal.jsx";
import POSModal      from "./components/modals/POSModal.jsx";
import ScannerModal  from "./components/modals/ScannerModal.jsx";
import ThemePicker   from "./components/modals/ThemePicker.jsx";

// ── Navigation items ───────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "Dashboard", label: "Home",     icon: "grid"     },
  { key: "Stock",     label: "Stock",    icon: "box"      },
  { key: "Add",       label: "Add",      icon: "plus",    isAdd: true },
  { key: "Sales",     label: "Sales",    icon: "calendar" },
  { key: "Settings",  label: "Settings", icon: "gear"     },
];

// ── SVG icon map ──────────────────────────────────────────────────────────────
const NavIcon = ({ name, size = 22 }) => {
  const icons = {
    grid:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    box:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    gear:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  };
  return icons[name] || null;
};

// ── Inner App (has access to StoreProvider) ────────────────────────────────────
function AppInner() {
  const { state, dispatch }       = useStore();
  const { T, themeKey, setTheme } = useTheme();
  const { tab, setTab }           = useTabNavigation("Dashboard");
  const { toast, showToast }      = useToast();

  // ── Modal visibility state ──────────────────────────────────────────────────
  const [sellModal,    setSellModal]    = useState(null);  // product | null
  const [editModal,    setEditModal]    = useState(null);  // product | null
  const [reorderModal, setReorderModal] = useState(null);  // { company, items } | null
  const [posModal,     setPosModal]     = useState(null);  // { product, barcode } | null
  const [showScanner,  setShowScanner]  = useState(false);
  const [scanTarget,   setScanTarget]   = useState("pos"); // "pos"|"add"|"edit"
  const [showThemes,   setShowThemes]   = useState(false);

  // ── Scanner result routing ──────────────────────────────────────────────────
  const handleScan = useCallback((code) => {
    setShowScanner(false);
    const found = state.products.find(
      (p) => p.barcode && p.barcode.trim() === code.trim()
    );
    if (scanTarget === "pos") {
      if (found) setPosModal({ product: found, barcode: code });
      else       setPosModal({ product: null,  barcode: code });  // new product flow
    }
    // "add" and "edit" targets are handled via callbacks passed to those modals
  }, [state.products, scanTarget]);

  const openScanner = useCallback((target) => {
    setScanTarget(target);
    setShowScanner(true);
  }, []);

  // ── Derived: how many items need reorder (for badge) ────────────────────────
  const reorderCount = state.products.filter((p) => p.stock <= p.minLevel).length;

  // ── Shared props passed to all screens ──────────────────────────────────────
  const screenProps = {
    T, showToast, setTab,
    openSell:    setSellModal,
    openEdit:    setEditModal,
    openReorder: setReorderModal,
    openScanner,
    openPOS:     () => openScanner("pos"),
  };

  return (
    <div style={{
      fontFamily: "-apple-system,'SF Pro Display','Segoe UI',sans-serif",
      background: T.bg, minHeight: "100vh", color: T.text,
      maxWidth: 430, margin: "0 auto", position: "relative", overflowX: "hidden",
    }}>

      {/* ── TOAST ─────────────────────────────────────────────────────── */}
      <Toast toast={toast} T={T} />

      {/* ── MODALS ────────────────────────────────────────────────────── */}
      {showScanner  && <ScannerModal  onDetected={handleScan} onClose={() => setShowScanner(false)} T={T} />}
      {showThemes   && <ThemePicker   T={T} themeKey={themeKey} setTheme={setTheme} onClose={() => setShowThemes(false)} />}
      {sellModal    && <SellModal     product={sellModal}    T={T} showToast={showToast} onClose={() => setSellModal(null)} />}
      {editModal    && <EditModal     product={editModal}    T={T} showToast={showToast} onClose={() => setEditModal(null)} />}
      {reorderModal && <ReorderModal  data={reorderModal}    T={T} showToast={showToast} onClose={() => setReorderModal(null)} />}
      {posModal     && <POSModal      data={posModal}        T={T} showToast={showToast} onClose={() => setPosModal(null)} setTab={setTab} />}

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <Header
        T={T}
        reorderCount={reorderCount}
        onScan={() => openScanner("pos")}
        onTheme={() => setShowThemes(true)}
      />

      {/* ── SCREEN CONTENT ────────────────────────────────────────────── */}
      <div style={{ paddingBottom: 100 }}>
        {tab === "Dashboard" && <Dashboard  {...screenProps} />}
        {tab === "Stock"     && <StockScreen {...screenProps} />}
        {tab === "Add"       && <AddProduct  {...screenProps} />}
        {tab === "Sales"     && <SalesScreen {...screenProps} />}
        {tab === "Settings"  && <SettingsScreen T={T} showToast={showToast} />}
      </div>

      {/* ── BOTTOM NAV ────────────────────────────────────────────────── */}
      <BottomNav T={T} tab={tab} setTab={setTab} reorderCount={reorderCount} />

      {/* ── SYNC STATUS BAR ───────────────────────────────────────────── */}
      <SyncBar T={T} />
    </div>
  );
}

// ── Header component ──────────────────────────────────────────────────────────
function Header({ T, reorderCount, onScan, onTheme }) {
  return (
    <div style={{
      background: T.headerBg, padding: "52px 20px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: T.text, padding: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>Mob Section</div>
          <div style={{ fontSize: 12, color: T.muted }}>Stock Manager • Family Supermarket</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Scan button */}
        <button onClick={onScan} style={{
          background: T.btnGrad, border: "none", borderRadius: 12,
          height: 38, padding: "0 14px",
          display: "flex", alignItems: "center", gap: 6,
          cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: 13,
          boxShadow: `0 2px 12px ${T.accent}50`,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="4" width="5" height="16" rx="1"/><rect x="9" y="4" width="2" height="16" rx="0.5"/>
            <rect x="13" y="4" width="4" height="16" rx="0.5"/><rect x="19" y="4" width="3" height="16" rx="1"/>
          </svg>
          Scan
        </button>
        {/* Theme button */}
        <button onClick={onTheme} style={{
          background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12,
          width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 16,
        }}>🎨</button>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button style={{
            background: T.card2, border: `1px solid ${T.border}`, borderRadius: 12,
            width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: T.text,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          {reorderCount > 0 && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              background: T.danger, color: "#fff",
              borderRadius: "50%", width: 18, height: 18,
              fontSize: 10, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {reorderCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ T, tab, setTab, reorderCount }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: T.navBg, borderTop: `1px solid ${T.border}`,
      padding: "10px 0 24px",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 500,
    }}>
      {NAV_ITEMS.map(({ key, label, icon, isAdd }) => {
        const active = tab === key;
        if (isAdd) {
          return (
            <button key={key} onClick={() => setTab(key)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 10px",
            }}>
              <div style={{
                background: T.btnGrad, borderRadius: "50%",
                width: 52, height: 52,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: -16,
                boxShadow: `0 4px 20px ${T.accent}60`,
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: T.muted }}>{label}</span>
            </button>
          );
        }
        return (
          <button key={key} onClick={() => setTab(key)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 10px",
            color: active ? T.accent : T.muted,
          }}>
            <NavIcon name={icon} />
            <span style={{ fontSize: 9, fontWeight: active ? 800 : 600 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Sync Status Bar ───────────────────────────────────────────────────────────
function SyncBar({ T }) {
  return (
    <div style={{
      position: "fixed", bottom: 82, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: T.navBg, borderTop: `1px solid ${T.border}`,
      padding: "5px 20px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      zIndex: 499,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={T.success}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
        <span style={{ fontSize: 11, color: T.muted }}>Last sync: Just now</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: T.muted }}>Data is up to date</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill={T.success}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z"/></svg>
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppInner />
      </StoreProvider>
    </ErrorBoundary>
  );
}
