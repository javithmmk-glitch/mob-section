# Mob Section — Architecture Guide

## Folder Structure

```
src/
├── App.jsx                    ← Orchestration only (~100 lines)
├── main.jsx                   ← React root mount
├── styles/
│   └── global.css             ← All base CSS, animations, resets
│
├── constants/                 ← Static configuration — no logic
│   ├── themes.js              ← All 12 themes defined here
│   └── app.js                 ← Seed data, defaults, storage keys, thresholds
│
├── utils/
│   └── calculations.js        ← Pure functions: fmt, calcMargin, stockStatus...
│                                (no React, independently testable)
│
├── store/
│   └── AppStore.jsx           ← Global state: useReducer + Context
│                                ACTIONS enum, reducer, action creators
│
├── hooks/
│   └── index.js               ← Custom hooks: useToast, useTheme, useSaleActions...
│                                Each hook = one concern
│
└── components/
    ├── shared/
    │   └── index.jsx          ← Reusable atoms: Toast, Toggle, BottomSheet, Btn...
    ├── screens/               ← One file per tab screen
    │   ├── Dashboard.jsx
    │   ├── StockScreen.jsx
    │   ├── SalesScreen.jsx
    │   ├── AddProduct.jsx
    │   └── SettingsScreen.jsx
    └── modals/                ← One file per modal
        ├── SellModal.jsx
        ├── EditModal.jsx
        ├── ReorderModal.jsx
        ├── POSModal.jsx
        ├── ScannerModal.jsx
        └── ThemePicker.jsx
```

## Where to Find Things

| Problem | File to open |
|---|---|
| Wrong calculation result | `utils/calculations.js` |
| UI looks wrong | `components/screens/*.jsx` |
| Modal broken | `components/modals/*.jsx` |
| State bug / wrong data | `store/AppStore.jsx` |
| Toast not working | `hooks/index.js` → `useToast` |
| Theme colour wrong | `constants/themes.js` |
| Seed data wrong | `constants/app.js` → `SEED_PRODUCTS` |
| Performance issue | `hooks/index.js` → check `useMemo` deps |
| App crashes | `components/shared/index.jsx` → `ErrorBoundary` |
| localStorage key clash | `constants/app.js` → `STORAGE_KEYS` |

## How to Add Features

### New Theme
1. Open `constants/themes.js`
2. Copy any entry, give it a unique key
3. Done — it appears in ThemePicker automatically

### New Product Field
1. Add field to `SEED_PRODUCTS` in `constants/app.js`
2. Update `DEFAULT_SETTINGS` if it has a setting
3. Add UI input in `components/screens/AddProduct.jsx`
4. Add UI input in `components/modals/EditModal.jsx`
5. Done

### New Screen / Tab
1. Create `components/screens/NewScreen.jsx`
2. Import it in `App.jsx`
3. Add to `NAV_ITEMS` array in `App.jsx`
4. Done

### New Global State
1. Add `ACTION_NAME` to `ACTIONS` in `store/AppStore.jsx`
2. Handle it in `reducer`
3. Add action creator to `Actions` object
4. Add localStorage key to `STORAGE_KEYS` in `constants/app.js`
5. Done

## Performance Rules
- All expensive calculations → `useMemo` in hooks
- All callbacks → `useCallback`
- All list components → `memo()`
- Tab switching → `useTransition` (already in `useTabNavigation`)
- Search input → debounce (already in `useSearch`)
