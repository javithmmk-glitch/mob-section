// ─── CUSTOM HOOKS ────────────────────────────────────────────────────────────
// Each hook encapsulates ONE concern.
// Bug in toast behaviour? Check useToast. Bug in filtering? Check useStockFilter.
// Adding a new feature? Write a hook for it here.

import { useState, useCallback, useRef, useMemo, useEffect, useTransition } from "react";
import { useStore, Actions } from "@/store/AppStore";
import { THEMES } from "@/constants/themes";
import {
  stockStatus, calcMargin, performanceScore, profitInPeriod,
  revenueInPeriod, perfBand, buildSaleEntry, buildRestockEntry,
  todayStr, nowTimeStr, nextId,
} from "@/utils/calculations";
import { PERIOD_DAYS, CAT_ICON as CAT_ICON_IMPORT } from "@/constants/app";
export { CAT_ICON_IMPORT as CAT_ICON };

// ── useToast ─────────────────────────────────────────────────────────────────
// Simple toast notification. Usage: const { toast, showToast } = useToast();
export function useToast(duration = 2600) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(timerRef.current);
    setToast({ msg, type });
    timerRef.current = setTimeout(() => setToast(null), duration);
  }, [duration]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { toast, showToast };
}

// ── useTheme ──────────────────────────────────────────────────────────────────
// Access current theme + ability to change it.
export function useTheme() {
  const { state, dispatch } = useStore();
  const T = THEMES[state.themeKey] || THEMES.midnight;
  const setTheme = useCallback((key) => dispatch(Actions.setTheme(key)), [dispatch]);
  return { T, themeKey: state.themeKey, setTheme, themes: THEMES };
}

// ── useTabNavigation ──────────────────────────────────────────────────────────
// Smooth tab switching using useTransition. Heavy tabs don't freeze the UI.
export function useTabNavigation(initial = "Dashboard") {
  const [tab, setTabRaw] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const setTab = useCallback((t) => {
    startTransition(() => setTabRaw(t));
  }, []);

  return { tab, setTab, isPending };
}

// ── useSearch ─────────────────────────────────────────────────────────────────
// Debounced search — typing feels instant, filter computation is deferred.
export function useSearch(delay = 150) {
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const handleChange = useCallback((val) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), delay);
  }, [delay]);

  const clear = useCallback(() => setSearch(""), []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return { search, handleChange, clear };
}

// ── useDashboardStats ─────────────────────────────────────────────────────────
// All dashboard KPI calculations. Memoised — only recomputes when products change.
export function useDashboardStats() {
  const { state: { products } } = useStore();

  return useMemo(() => {
    const needsReorder     = products.filter((p) => p.stock <= p.minLevel);
    const outOfStock       = products.filter((p) => p.stock === 0);
    const totalCostValue   = products.reduce((s, p) => s + p.costPrice * p.stock, 0);
    const totalSellValue   = products.reduce((s, p) => s + p.sellPrice * p.stock, 0);
    const totalProfit      = totalSellValue - totalCostValue;
    const avgMargin        = products.length
      ? (products.reduce((s, p) => s + parseFloat(calcMargin(p.costPrice, p.sellPrice)), 0) / products.length).toFixed(1)
      : "0.0";
    const lowestStock      = [...needsReorder].sort((a, b) => a.stock - b.stock)[0] ?? null;
    const reorderBySupplier = needsReorder.reduce((map, p) => {
      const k = p.company || p.brand || "Unknown";
      if (!map[k]) map[k] = [];
      map[k].push(p);
      return map;
    }, {});

    return {
      needsReorder, outOfStock, totalCostValue, totalSellValue,
      totalProfit, avgMargin, lowestStock, reorderBySupplier,
    };
  }, [products]);
}

// ── useStockFilter ────────────────────────────────────────────────────────────
// Filtered and sorted stock list. Memoised per dependency change.
export function useStockFilter() {
  const { state: { products, categories } } = useStore();
  const [filterCat, setFilterCat]         = useState("All");
  const [showReorderOnly, setShowReorderOnly] = useState(false);
  const { search, handleChange: handleSearch, clear: clearSearch } = useSearch();

  const allCats = useMemo(() => ["All", ...categories], [categories]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      if (filterCat !== "All" && p.category !== filterCat) return false;
      if (showReorderOnly && p.stock > p.minLevel)         return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q)           ||
        (p.brand   || "").toLowerCase().includes(q)||
        (p.company || "").toLowerCase().includes(q)||
        (p.barcode || "").includes(search)
      );
    });
  }, [products, filterCat, search, showReorderOnly]);

  return {
    filtered, allCats, filterCat, setFilterCat,
    search, handleSearch, clearSearch,
    showReorderOnly, setShowReorderOnly,
  };
}

// ── useCategoryHealth ─────────────────────────────────────────────────────────
export function useCategoryHealth() {
  const { state: { products, categories } } = useStore();
  return useMemo(() =>
    categories.map((cat) => {
      const items = products.filter((p) => p.category === cat);
      if (!items.length) return null;
      return { cat, items, low: items.filter((p) => p.stock <= p.minLevel).length, total: items.length };
    }).filter(Boolean),
    [products, categories]
  );
}

// ── useProductActions ─────────────────────────────────────────────────────────
// All product CRUD operations in one place.
export function useProductActions(showToast) {
  const { state: { products, supplierPhones }, dispatch } = useStore();

  const addProduct = useCallback((productData) => {
    const id = nextId(products);
    const product = {
      id,
      ...productData,
      costPrice: parseFloat(productData.costPrice),
      mrp:       parseFloat(productData.mrp),
      sellPrice: parseFloat(productData.sellPrice),
      stock:     parseInt(productData.stock),
      minLevel:  parseInt(productData.minLevel),
      dateAdded: productData.dateAdded || todayStr(),
    };
    dispatch(Actions.addProduct(product));
    if (productData.company && !supplierPhones[productData.company]) {
      dispatch(Actions.setSupplierPhone(productData.company, ""));
    }
    showToast?.(`${productData.name} added! ✓`);
    return product;
  }, [products, supplierPhones, dispatch, showToast]);

  const updateProduct = useCallback((product) => {
    dispatch(Actions.updateProduct(product));
    showToast?.("Updated ✓");
  }, [dispatch, showToast]);

  const deleteProduct = useCallback((id, name) => {
    if (!window.confirm(`Remove "${name}"? This cannot be undone.`)) return false;
    dispatch(Actions.deleteProduct(id));
    showToast?.("Removed", "error");
    return true;
  }, [dispatch, showToast]);

  return { addProduct, updateProduct, deleteProduct };
}

// ── useSaleActions ─────────────────────────────────────────────────────────────
// Record sales and restock events.
export function useSaleActions(showToast) {
  const { dispatch } = useStore();

  const recordSale = useCallback((product, qty, date, time, note = "") => {
    const entry = buildSaleEntry(product, qty, date, time, note);
    const newStock = Math.max(0, product.stock - qty);
    dispatch(Actions.updateStock(product.id, newStock));
    dispatch(Actions.addSaleEntry(entry));
    showToast?.(`${product.name}: Sold ${qty} → ${newStock} left`);
    return { entry, newStock };
  }, [dispatch, showToast]);

  const recordRestock = useCallback((product, qty) => {
    const entry = buildRestockEntry(product, qty);
    const newStock = product.stock + qty;
    dispatch(Actions.updateStock(product.id, newStock));
    dispatch(Actions.addSaleEntry(entry));
    showToast?.(`${product.name}: +${qty} restocked → ${newStock} total`);
    return { entry, newStock };
  }, [dispatch, showToast]);

  return { recordSale, recordRestock };
}

// ── useSalesAnalytics ─────────────────────────────────────────────────────────
// All sales analytics computations. Memoised per range change.
export function useSalesAnalytics(salesLog, range, rangeFrom, rangeTo) {
  const today = todayStr();

  const rangeLog = useMemo(() => {
    let from, to;
    if (range === "today")  { from = to = today; }
    else if (range === "week")  {
      const d = new Date(); d.setDate(d.getDate() - 6);
      from = d.toISOString().slice(0, 10); to = today;
    }
    else if (range === "month") {
      const n = new Date();
      from = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-01`;
      to = today;
    }
    else { from = rangeFrom || "2000-01-01"; to = rangeTo || today; }
    return salesLog.filter((e) => e.type === "sale" && e.date >= from && e.date <= to);
  }, [salesLog, range, rangeFrom, rangeTo, today]);

  const stats = useMemo(() => {
    const totalUnits  = rangeLog.reduce((s, e) => s + e.qty,     0);
    const totalRev    = rangeLog.reduce((s, e) => s + e.revenue, 0);
    const totalCost   = rangeLog.reduce((s, e) => s + e.costPrice * e.qty, 0);
    const totalProfit = rangeLog.reduce((s, e) => s + e.profit,  0);
    const margin      = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : "0.0";
    const gmroi       = (totalRev - totalProfit) > 0 ? (totalProfit / (totalRev - totalProfit)).toFixed(2) : "0.00";

    const byProduct = rangeLog.reduce((acc, e) => {
      if (!acc[e.productId]) acc[e.productId] = { name: e.productName, category: e.category, qty: 0, revenue: 0, cost: 0, profit: 0 };
      acc[e.productId].qty     += e.qty;
      acc[e.productId].revenue += e.revenue;
      acc[e.productId].cost    += e.costPrice * e.qty;
      acc[e.productId].profit  += e.profit;
      return acc;
    }, {});

    const byCat = rangeLog.reduce((acc, e) => {
      if (!acc[e.category]) acc[e.category] = { qty: 0, revenue: 0, cost: 0, profit: 0 };
      acc[e.category].qty     += e.qty;
      acc[e.category].revenue += e.revenue;
      acc[e.category].cost    += e.costPrice * e.qty;
      acc[e.category].profit  += e.profit;
      return acc;
    }, {});

    return {
      totalUnits, totalRev, totalCost, totalProfit, margin, gmroi,
      topProducts: Object.values(byProduct).sort((a, b) => b.revenue - a.revenue),
      catList:     Object.entries(byCat).sort((a, b) => b[1].revenue - a[1].revenue),
    };
  }, [rangeLog]);

  const byDate = useMemo(() =>
    salesLog.filter((e) => e.type === "sale").reduce((acc, e) => {
      if (!acc[e.date]) acc[e.date] = { qty: 0, revenue: 0, profit: 0, items: [] };
      acc[e.date].qty     += e.qty;
      acc[e.date].revenue += e.revenue;
      acc[e.date].profit  += e.profit;
      acc[e.date].items.push(e);
      return acc;
    }, {}),
    [salesLog]
  );

  return { rangeLog, stats, byDate };
}
