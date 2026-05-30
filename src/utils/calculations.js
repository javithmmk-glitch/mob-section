// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
// Pure functions only — no React, no state, no side effects.
// Every function here is independently testable.
// Bug in a calculation? You'll find it here immediately.

import { PERIOD_DAYS, PERF_THRESHOLDS, STOCK_WARN_MULTIPLIER } from "@/constants/app";

// ── Formatting ────────────────────────────────────────────────────────────────

/** Format a number as Indian Rupees: fmt(1234) → "₹1,234" */
export const fmt = (n, currency = "₹") =>
  currency + Number(Math.round(n)).toLocaleString("en-IN");

/** Format a date string YYYY-MM-DD to DD/MMM/YYYY */
export const fmtDate = (d) => {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day}/${months[parseInt(m) - 1]}/${y}`;
};

/** Get today's date as YYYY-MM-DD string */
export const todayStr = () => new Date().toISOString().slice(0, 10);

/** Get current time as HH:MM string */
export const nowTimeStr = () => new Date().toTimeString().slice(0, 5);

// ── Pricing Calculations ──────────────────────────────────────────────────────

/** Gross margin: (sell - cost) / sell × 100  e.g. "32.5" */
export const calcMargin = (cost, sell) =>
  sell > 0 ? (((sell - cost) / sell) * 100).toFixed(1) : "0.0";

/** Markup: (sell - cost) / cost × 100  e.g. "48.1" */
export const calcMarkup = (cost, sell) =>
  cost > 0 ? (((sell - cost) / cost) * 100).toFixed(1) : "0.0";

/** Markdown from MRP: (mrp - sell) / mrp × 100 */
export const calcMarkdown = (mrp, sell) =>
  mrp > 0 ? (((mrp - sell) / mrp) * 100).toFixed(1) : "0.0";

/** GMROI per unit: (sell - cost) / cost  e.g. "0.45" */
export const calcGMROI = (cost, sell) =>
  cost > 0 ? ((sell - cost) / cost).toFixed(2) : "0.00";

/** Profit per unit */
export const calcProfit = (cost, sell) => sell - cost;

// ── Stock Status ──────────────────────────────────────────────────────────────

/**
 * Returns "empty" | "low" | "warn" | "ok"
 * Centralised here so the threshold logic is in ONE place.
 * To change when a product turns red: change STOCK_WARN_MULTIPLIER in constants/app.js
 */
export const stockStatus = (product) => {
  const { stock, minLevel } = product;
  if (stock === 0)                               return "empty";
  if (stock <= minLevel)                         return "low";
  if (stock <= minLevel * STOCK_WARN_MULTIPLIER) return "warn";
  return "ok";
};

export const STOCK_STATUS_COLOR = (status, T) => ({
  ok:    T.success,
  warn:  T.warn,
  low:   T.danger,
  empty: T.muted,
}[status]);

export const STOCK_STATUS_LABEL = {
  ok:    "In Stock",
  warn:  "Low",
  low:   "Reorder Now",
  empty: "Out of Stock",
};

// ── Performance Scoring ───────────────────────────────────────────────────────

/** Units sold in a given period, extrapolated from monthly average */
export const unitsInPeriod = (product, period) =>
  (product.unitsSoldMonthly || 0) / 30 * PERIOD_DAYS[period];

/** Stock turnover rate = units sold in period / current stock */
export const turnoverRate = (product, period) =>
  unitsInPeriod(product, period) / Math.max(product.stock, 1);

/** Performance score = GMROI × turnover rate */
export const performanceScore = (product, period) =>
  parseFloat(calcGMROI(product.costPrice, product.sellPrice)) * turnoverRate(product, period);

/** Profit generated in period */
export const profitInPeriod = (product, period) =>
  (product.sellPrice - product.costPrice) * unitsInPeriod(product, period);

/** Revenue generated in period */
export const revenueInPeriod = (product, period) =>
  product.sellPrice * unitsInPeriod(product, period);

/**
 * Performance band: "good" | "average" | "low" | "bad"
 * Thresholds live in constants/app.js → PERF_THRESHOLDS
 */
export const perfBand = (score, period) => {
  const t = PERF_THRESHOLDS[period];
  if (score >= t.good) return "good";
  if (score >= t.avg)  return "average";
  if (score >= t.low)  return "low";
  return "bad";
};

// ── ID Generation ─────────────────────────────────────────────────────────────

/** Generate a unique ID for a new product */
export const nextId = (items) =>
  items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;

/** Generate a unique sale log entry ID */
export const saleId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Sales Log Helpers ────────────────────────────────────────────────────────

/**
 * Build a sale log entry from a product and quantity.
 * All sale data shape is defined here — one place to change it.
 */
export const buildSaleEntry = (product, qty, date, time, note = "") => ({
  id:          saleId(),
  date:        date || todayStr(),
  time:        time || nowTimeStr(),
  productId:   product.id,
  productName: product.name,
  category:    product.category || "",
  barcode:     product.barcode  || "",
  qty,
  type:        "sale",
  costPrice:   product.costPrice,
  sellPrice:   product.sellPrice,
  profit:      calcProfit(product.costPrice, product.sellPrice) * qty,
  revenue:     product.sellPrice * qty,
  note,
});

/** Build a restock log entry */
export const buildRestockEntry = (product, qty) => ({
  id:          saleId(),
  date:        todayStr(),
  time:        nowTimeStr(),
  productId:   product.id,
  productName: product.name,
  category:    product.category || "",
  barcode:     product.barcode  || "",
  qty,
  type:        "restock",
  costPrice:   product.costPrice,
  sellPrice:   product.sellPrice,
  profit:      0,
  revenue:     0,
  note:        "",
});

// ── Report Generation ─────────────────────────────────────────────────────────

/**
 * Build the WhatsApp reorder message for a supplier.
 * Message format is defined here — easy to customise.
 */
export const buildReorderWhatsApp = (company, items, qtys, storeName) => {
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  let msg = `🛒 *REORDER REQUEST*\n📅 ${date}\n🏪 ${storeName}\n🏭 ${company}\n─────────────────`;
  items.forEach((p, i) => {
    const qty = qtys[p.id] || p.minLevel;
    msg += `\n\n${i + 1}. *${p.name}*\n   Stock: ${p.stock} pcs | Order: *${qty} pcs*`;
  });
  msg += `\n\n─────────────────\nTotal items: ${items.length}\n\nPlease confirm. Thank you! 🙏`;
  return msg;
};
