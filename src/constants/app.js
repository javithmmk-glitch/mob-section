// ─── APP CONSTANTS ────────────────────────────────────────────────────────────
// Single source of truth for all configuration values.
// To change seed data, default categories, or icons → edit HERE only.

// ── Seed Products (shown on first launch) ─────────────────────────────────────
export const SEED_PRODUCTS = [
  { id: 1,  name: "Floor Mop",         brand: "CleanPro",    company: "CleanPro Distributors", category: "Mops",     costPrice: 280, mrp: 899,  sellPrice: 740, stock: 10, minLevel: 5,  barcode: "8901234567890", image: null, dateAdded: "2025-01-01" },
  { id: 2,  name: "Mop Refill Head",   brand: "CleanPro",    company: "CleanPro Distributors", category: "Mops",     costPrice: 150, mrp: 450,  sellPrice: 370, stock: 8,  minLevel: 5,  barcode: "8901234567891", image: null, dateAdded: "2025-01-01" },
  { id: 3,  name: "Mop Bucket",        brand: "HomeClean",   company: "HomeClean Ltd",          category: "Mops",     costPrice: 420, mrp: 1299, sellPrice: 1070,stock: 4,  minLevel: 3,  barcode: "8901234567892", image: null, dateAdded: "2025-01-01" },
  { id: 4,  name: "Broom",             brand: "SweepIt",     company: "SweepIt Agency",         category: "Brooms",   costPrice: 200, mrp: 650,  sellPrice: 535, stock: 6,  minLevel: 4,  barcode: "8901234567893", image: null, dateAdded: "2025-01-01" },
  { id: 5,  name: "Dustpan & Brush",   brand: "SweepIt",     company: "SweepIt Agency",         category: "Brooms",   costPrice: 130, mrp: 399,  sellPrice: 329, stock: 3,  minLevel: 4,  barcode: "8901234567894", image: null, dateAdded: "2025-01-01" },
  { id: 6,  name: "Floor Cleaner 1L",  brand: "HygienePlus", company: "HygienePlus India",      category: "Liquids",  costPrice: 110, mrp: 349,  sellPrice: 290, stock: 15, minLevel: 8,  barcode: "8901234567895", image: null, dateAdded: "2025-01-01" },
  { id: 7,  name: "Floor Cleaner 5L",  brand: "HygienePlus", company: "HygienePlus India",      category: "Liquids",  costPrice: 310, mrp: 899,  sellPrice: 740, stock: 7,  minLevel: 4,  barcode: "8901234567896", image: null, dateAdded: "2025-01-01" },
  { id: 8,  name: "Disinfectant Spray",brand: "GermGuard",   company: "GermGuard Pvt Ltd",      category: "Liquids",  costPrice: 140, mrp: 425,  sellPrice: 350, stock: 2,  minLevel: 6,  barcode: "8901234567897", image: null, dateAdded: "2025-01-01" },
  { id: 9,  name: "Scrub Brush",       brand: "ScrubMate",   company: "ScrubMate Co",           category: "Brushes",  costPrice: 65,  mrp: 225,  sellPrice: 185, stock: 12, minLevel: 5,  barcode: "8901234567898", image: null, dateAdded: "2025-01-01" },
  { id: 10, name: "Bleach 1L",         brand: "BrightWhite", company: "BrightWhite India",      category: "Liquids",  costPrice: 70,  mrp: 225,  sellPrice: 185, stock: 4,  minLevel: 8,  barcode: "8901234567899", image: null, dateAdded: "2025-01-01" },
];

// ── Default Categories (shown on first launch) ────────────────────────────────
export const DEFAULT_CATEGORIES = ["Mops", "Brooms", "Liquids", "Brushes", "Protection", "Cloths"];

// ── Category Icons — add a new category? Add its icon here. ──────────────────
export const CAT_ICON = {
  Mops:       "🧹",
  Brooms:     "🪣",
  Liquids:    "💧",
  Brushes:    "🪥",
  Protection: "🧤",
  Cloths:     "🧻",
  Default:    "📦",
};

// ── Stock Status Thresholds ───────────────────────────────────────────────────
// To change when "low" vs "warn" triggers → change the multiplier below
export const STOCK_WARN_MULTIPLIER = 1.5; // stock <= minLevel * this = warn

// ── Performance Scoring Thresholds (GMROI × Turnover) ────────────────────────
// To retune what counts as Good/Average/Low/Bad → edit these numbers
export const PERF_THRESHOLDS = {
  week:  { good: 1.0,  avg: 0.4,  low: 0.15 },
  month: { good: 4.0,  avg: 1.5,  low: 0.5  },
  year:  { good: 48,   avg: 18,   low: 6    },
};

export const BAND_META = {
  good:    { label: "Good",    emoji: "🚀", desc: "High profit + fast moving"     },
  average: { label: "Average", emoji: "✓",  desc: "Steady performer"              },
  low:     { label: "Low",     emoji: "⚠",  desc: "Slow returns"                  },
  bad:     { label: "Bad",     emoji: "❌", desc: "Stagnant — review or clearance" },
};

// ── Period definitions ────────────────────────────────────────────────────────
export const PERIOD_DAYS = { week: 7, month: 30, year: 365 };

// ── Sales log cap — prevent unbounded memory growth ──────────────────────────
export const MAX_SALES_LOG_ENTRIES = 5000;

// ── Default Settings ──────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  storeName:     "Family Supermarket",
  storeAddress:  "",
  ownerName:     "",
  currency:      "₹",
  lowStockAlert: true,
  compactView:   false,
  showBarcode:   true,
  showGMROI:     true,
  gstEnabled:    false,
  taxRate:       0,
  defaultTab:    "Dashboard",
};

// ── LocalStorage Keys — change the key name here if you ever need to migrate ──
export const STORAGE_KEYS = {
  products:       "ms_products",
  categories:     "ms_categories",
  supplierPhones: "ms_phones",
  salesLog:       "ms_saleslog",
  settings:       "ms_settings",
  theme:          "ms_theme",
  storeName:      "ms_store",
};
