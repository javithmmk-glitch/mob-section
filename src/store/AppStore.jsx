// ─── APP STORE (React Context) ────────────────────────────────────────────────
// All global state lives here. Components read from context, dispatch actions.
// To add new global state → add to initialState + handle in reducer below.
// To debug state → search "ACTION:" in console. Every change is logged.

import React, {
  createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef,
} from "react";
import {
  SEED_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_SETTINGS,
  STORAGE_KEYS, MAX_SALES_LOG_ENTRIES,
} from "@/constants/app";
import { DEFAULT_THEME_KEY } from "@/constants/themes";

// ── localStorage helper ───────────────────────────────────────────────────────
const storage = {
  get: (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded */ }
  },
};

// ── Initial State (read from localStorage on boot) ────────────────────────────
const loadInitialState = () => ({
  products:       storage.get(STORAGE_KEYS.products,       SEED_PRODUCTS),
  categories:     storage.get(STORAGE_KEYS.categories,     DEFAULT_CATEGORIES),
  supplierPhones: storage.get(STORAGE_KEYS.supplierPhones, {}),
  salesLog:       storage.get(STORAGE_KEYS.salesLog,       []),
  settings:       { ...DEFAULT_SETTINGS, ...storage.get(STORAGE_KEYS.settings, {}) },
  themeKey:       storage.get(STORAGE_KEYS.theme,          DEFAULT_THEME_KEY),
});

// ── Action Types ──────────────────────────────────────────────────────────────
// ALL possible state changes are listed here. This is your "API" for state.
// To add a new action: add the constant here, handle it in the reducer below.
export const ACTIONS = {
  // Products
  ADD_PRODUCT:        "ADD_PRODUCT",
  UPDATE_PRODUCT:     "UPDATE_PRODUCT",
  DELETE_PRODUCT:     "DELETE_PRODUCT",
  UPDATE_STOCK:       "UPDATE_STOCK",

  // Categories
  ADD_CATEGORY:       "ADD_CATEGORY",
  DELETE_CATEGORY:    "DELETE_CATEGORY",

  // Suppliers
  SET_SUPPLIER_PHONE: "SET_SUPPLIER_PHONE",

  // Sales
  ADD_SALE_ENTRY:     "ADD_SALE_ENTRY",
  CLEAR_SALES_LOG:    "CLEAR_SALES_LOG",

  // Settings & Theme
  UPDATE_SETTING:     "UPDATE_SETTING",
  SET_THEME:          "SET_THEME",

  // Data management
  RESET_ALL:          "RESET_ALL",
  IMPORT_DATA:        "IMPORT_DATA",
};

// ── Reducer ───────────────────────────────────────────────────────────────────
// Pure function: (state, action) => newState
// Each case is isolated — easy to find, easy to test, easy to modify.
function reducer(state, action) {
  // Dev-mode action logging — remove in production if needed
  if (import.meta.env.DEV) {
    console.log(`ACTION: ${action.type}`, action.payload ?? "");
  }

  switch (action.type) {

    // ── Products ──────────────────────────────────────────────────────────────
    case ACTIONS.ADD_PRODUCT:
      return { ...state, products: [...state.products, action.payload] };

    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };

    case ACTIONS.DELETE_PRODUCT:
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };

    case ACTIONS.UPDATE_STOCK: {
      // payload: { productId, newStock }
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.productId
            ? { ...p, stock: Math.max(0, action.payload.newStock) }
            : p
        ),
      };
    }

    // ── Categories ────────────────────────────────────────────────────────────
    case ACTIONS.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };

    case ACTIONS.DELETE_CATEGORY:
      return { ...state, categories: state.categories.filter((c) => c !== action.payload) };

    // ── Suppliers ─────────────────────────────────────────────────────────────
    case ACTIONS.SET_SUPPLIER_PHONE:
      return {
        ...state,
        supplierPhones: { ...state.supplierPhones, [action.payload.company]: action.payload.phone },
      };

    // ── Sales ─────────────────────────────────────────────────────────────────
    case ACTIONS.ADD_SALE_ENTRY:
      return {
        ...state,
        salesLog: [action.payload, ...state.salesLog].slice(0, MAX_SALES_LOG_ENTRIES),
      };

    case ACTIONS.CLEAR_SALES_LOG:
      return { ...state, salesLog: [] };

    // ── Settings ──────────────────────────────────────────────────────────────
    case ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        settings: { ...state.settings, [action.payload.key]: action.payload.value },
      };

    case ACTIONS.SET_THEME:
      return { ...state, themeKey: action.payload };

    // ── Data Management ───────────────────────────────────────────────────────
    case ACTIONS.RESET_ALL:
      return loadInitialState(); // re-reads defaults

    case ACTIONS.IMPORT_DATA:
      return { ...state, ...action.payload };

    default:
      // Unhandled action — loud error in dev, silent in prod
      if (import.meta.env.DEV) {
        console.warn(`Unhandled action type: ${action.type}`);
      }
      return state;
  }
}

// ── Persistence middleware ─────────────────────────────────────────────────────
// Wraps dispatch — every action auto-saves relevant slices to localStorage.
function withPersistence(dispatch, getState) {
  return (action) => {
    dispatch(action);
    // After state updates, save to storage
    // We use requestIdleCallback so persistence never blocks rendering
    const save = () => {
      const state = getState();
      const KEY_MAP = {
        [ACTIONS.ADD_PRODUCT]:        [STORAGE_KEYS.products,       state.products],
        [ACTIONS.UPDATE_PRODUCT]:     [STORAGE_KEYS.products,       state.products],
        [ACTIONS.DELETE_PRODUCT]:     [STORAGE_KEYS.products,       state.products],
        [ACTIONS.UPDATE_STOCK]:       [STORAGE_KEYS.products,       state.products],
        [ACTIONS.ADD_CATEGORY]:       [STORAGE_KEYS.categories,     state.categories],
        [ACTIONS.DELETE_CATEGORY]:    [STORAGE_KEYS.categories,     state.categories],
        [ACTIONS.SET_SUPPLIER_PHONE]: [STORAGE_KEYS.supplierPhones, state.supplierPhones],
        [ACTIONS.ADD_SALE_ENTRY]:     [STORAGE_KEYS.salesLog,       state.salesLog],
        [ACTIONS.CLEAR_SALES_LOG]:    [STORAGE_KEYS.salesLog,       state.salesLog],
        [ACTIONS.UPDATE_SETTING]:     [STORAGE_KEYS.settings,       state.settings],
        [ACTIONS.SET_THEME]:          [STORAGE_KEYS.theme,          state.themeKey],
      };
      const pair = KEY_MAP[action.type];
      if (pair) storage.set(pair[0], pair[1]);
      if (action.type === ACTIONS.RESET_ALL) {
        Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      }
    };
    if ("requestIdleCallback" in window) requestIdleCallback(save);
    else setTimeout(save, 0);
  };
}

// ── Context ───────────────────────────────────────────────────────────────────
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, rawDispatch] = useReducer(reducer, null, loadInitialState);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const dispatch = useMemo(
    () => withPersistence(rawDispatch, () => stateRef.current),
    []
  );

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// ── Custom hook — the only way components access state ────────────────────────
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

// ── Convenience action creators ────────────────────────────────────────────────
// Import these in components instead of writing { type, payload } inline.
// Makes code self-documenting and refactoring instant.
export const Actions = {
  addProduct:       (product)          => ({ type: ACTIONS.ADD_PRODUCT,        payload: product }),
  updateProduct:    (product)          => ({ type: ACTIONS.UPDATE_PRODUCT,     payload: product }),
  deleteProduct:    (id)               => ({ type: ACTIONS.DELETE_PRODUCT,     payload: id }),
  updateStock:      (productId, newStock) => ({ type: ACTIONS.UPDATE_STOCK,    payload: { productId, newStock } }),
  addCategory:      (name)             => ({ type: ACTIONS.ADD_CATEGORY,       payload: name }),
  deleteCategory:   (name)             => ({ type: ACTIONS.DELETE_CATEGORY,    payload: name }),
  setSupplierPhone: (company, phone)   => ({ type: ACTIONS.SET_SUPPLIER_PHONE, payload: { company, phone } }),
  addSaleEntry:     (entry)            => ({ type: ACTIONS.ADD_SALE_ENTRY,     payload: entry }),
  clearSalesLog:    ()                 => ({ type: ACTIONS.CLEAR_SALES_LOG }),
  updateSetting:    (key, value)       => ({ type: ACTIONS.UPDATE_SETTING,     payload: { key, value } }),
  setTheme:         (key)              => ({ type: ACTIONS.SET_THEME,          payload: key }),
  resetAll:         ()                 => ({ type: ACTIONS.RESET_ALL }),
  importData:       (data)             => ({ type: ACTIONS.IMPORT_DATA,        payload: data }),
};
