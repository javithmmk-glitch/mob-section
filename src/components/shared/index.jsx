// ─── SHARED UI COMPONENTS ────────────────────────────────────────────────────
// Small reusable building blocks. To change the look of a UI element
// that appears everywhere → edit it ONCE here.

import { memo } from "react";

// ── WhatsApp Icon ─────────────────────────────────────────────────────────────
export const WaIcon = memo(({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.57a.75.75 0 00.918.918l5.713-1.467A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.715 9.715 0 01-4.944-1.35l-.354-.211-3.668.941.957-3.584-.229-.368A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
));

// ── Toast Notification ────────────────────────────────────────────────────────
export const Toast = memo(({ toast, T }) => {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999,
      background: toast.type === "error" ? T.danger : T.success,
      color: "#fff", padding: "10px 20px", borderRadius: 20,
      fontWeight: 700, fontSize: 13,
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      whiteSpace: "nowrap",
      animation: "slideDown .2s ease",
    }}>
      {toast.msg}
    </div>
  );
});

// ── Product Thumbnail ─────────────────────────────────────────────────────────
// Shows product image if available, otherwise category emoji
export const ProductThumb = memo(({ product, size = 52, T, catIcon }) => {
  const radius = Math.round(size * 0.27);
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      background: T.card2, borderRadius: radius,
      width: size, height: size,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5, flexShrink: 0,
    }}>
      {catIcon || "📦"}
    </div>
  );
});

// ── Toggle Switch ─────────────────────────────────────────────────────────────
export const Toggle = memo(({ value, onChange, T }) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 46, height: 26, borderRadius: 13,
      background: value ? T.accent : T.border,
      cursor: "pointer", position: "relative",
      transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute", top: 3,
      left: value ? 23 : 3,
      width: 20, height: 20, borderRadius: "50%",
      background: "#fff",
      transition: "left 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
    }} />
  </div>
));

// ── Section Card ──────────────────────────────────────────────────────────────
// Consistent card wrapper used in Settings and other screens
export const SectionCard = memo(({ title, icon, children, T, borderColor }) => (
  <div style={{
    background: T.card, borderRadius: 18,
    border: `1px solid ${borderColor || T.border}`,
    overflow: "hidden", marginBottom: 16,
  }}>
    {(title || icon) && (
      <div style={{
        padding: "12px 16px",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        {title && <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>}
      </div>
    )}
    {children}
  </div>
));

// ── Bottom Sheet Modal ─────────────────────────────────────────────────────────
// Standard modal wrapper with drag handle, used for all modals
export const BottomSheet = memo(({ children, T, onClose, maxHeight = "92vh" }) => (
  <div style={{
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.88)",
    zIndex: 2000,
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  }}>
    <div style={{
      background: T.card,
      borderRadius: "24px 24px 0 0",
      padding: "20px 20px 40px",
      width: "100%", maxWidth: 430,
      maxHeight,
      overflowY: "auto",
      animation: "slideUp .25s ease",
    }}>
      {/* Drag handle */}
      <div style={{
        width: 40, height: 4,
        background: T.border, borderRadius: 2,
        margin: "0 auto 20px",
      }} />
      {children}
    </div>
  </div>
));

// ── Qty Stepper ────────────────────────────────────────────────────────────────
// +/- quantity control used in sell modal and POS
export const QtyStepper = memo(({ value, onChange, min = 1, max = Infinity, T }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      style={{
        background: T.card2, border: `1px solid ${T.border}`,
        borderRadius: "12px 0 0 12px",
        padding: "12px 18px", color: T.text, cursor: "pointer",
        fontSize: 20, fontWeight: 700,
      }}
    >−</button>
    <div style={{
      flex: 1, background: T.bg,
      border: `1px solid ${T.border}`, borderLeft: "none", borderRight: "none",
      padding: "12px", fontSize: 20, fontWeight: 900,
      color: T.accent, textAlign: "center", minWidth: 60,
    }}>
      {value}
    </div>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      style={{
        background: T.card2, border: `1px solid ${T.border}`,
        borderRadius: "0 12px 12px 0",
        padding: "12px 18px", color: T.text, cursor: "pointer",
        fontSize: 20, fontWeight: 700,
      }}
    >+</button>
  </div>
));

// ── Primary Button ────────────────────────────────────────────────────────────
export const PrimaryBtn = memo(({ children, onClick, T, disabled = false, style = {} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? T.border : T.btnGrad,
      border: "none", borderRadius: 14, padding: "14px 20px",
      color: "#fff", fontWeight: 800, fontSize: 15,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      ...style,
    }}
  >
    {children}
  </button>
));

// ── Ghost Button ──────────────────────────────────────────────────────────────
export const GhostBtn = memo(({ children, onClick, T, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      background: T.card2, border: "none", borderRadius: 14, padding: "14px 20px",
      color: T.muted, fontWeight: 700, fontSize: 15, cursor: "pointer",
      ...style,
    }}
  >
    {children}
  </button>
));

// ── Error Boundary ────────────────────────────────────────────────────────────
import React from "react";
export class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("🔴 App Error:", error, "\nComponent Stack:", info.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        fontFamily: "-apple-system,sans-serif",
        background: "#0d0d14", minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, color: "#f0f0ff", textAlign: "center",
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Something went wrong</div>
        <div style={{ fontSize: 13, color: "#6b6b8a", marginBottom: 8, lineHeight: 1.6 }}>
          Your data is safe in storage.<br />Tap below to reload.
        </div>
        <div style={{ fontSize: 11, color: "#444", marginBottom: 24, fontFamily: "monospace", maxWidth: 300, wordBreak: "break-all" }}>
          {this.state.error?.message}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "linear-gradient(135deg,#7c6ef5,#a78bfa)",
            border: "none", borderRadius: 14, padding: "14px 28px",
            color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer",
          }}
        >
          🔄 Reload App
        </button>
      </div>
    );
  }
}
