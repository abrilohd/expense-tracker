# Dark Mode Implementation Guide

## Overview
Complete dark mode system for the Expense Tracker app using React, TypeScript, and Tailwind CSS.

---

## ✅ Implementation Complete

### 1. **Custom Hook: `useDarkMode`**
**Location:** `src/hooks/useDarkMode.ts`

**Features:**
- ✅ Reads initial state from `localStorage` (`expense_theme` key)
- ✅ Respects system preference (`prefers-color-scheme`) as default
- ✅ Toggles `dark` class on `document.documentElement`
- ✅ Persists theme to localStorage
- ✅ Listens for system preference changes
- ✅ Provides `isDark`, `toggleDark`, and `setTheme` exports

**Usage:**
```typescript
import { useDarkMode } from './hooks/useDarkMode';

function MyComponent() {
  const { isDark, toggleDark, setTheme } = useDarkMode();
  
  return (
    <button onClick={toggleDark}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

### 2. **Tailwind Configuration**
**Location:** `tailwind.config.js`

**Settings:**
```javascript
{
  darkMode: 'class', // ✅ Class-based dark mode
  // ... rest of config
}
```

---

### 3. **Dark Mode Classes Applied**

#### **Layout Components**

**Sidebar** (`src/components/layout/Sidebar.tsx`)
- Background: `dark:bg-gray-900`
- Borders: `dark:border-gray-700`
- Text: `dark:text-gray-400`, `dark:text-white`
- Active links: `dark:bg-blue-950 dark:text-blue-400`
- Hover states: `dark:hover:bg-gray-800`

**Header** (`src/components/layout/Header.tsx`)
- Background: `dark:bg-gray-900/80` (with backdrop blur)
- Borders: `dark:border-gray-700`
- Text: `dark:text-white`, `dark:text-gray-400`
- Dropdown: `dark:bg-gray-800`
- Hover states: `dark:hover:bg-gray-700`

**Layout** (`src/components/layout/Layout.tsx`)
- Background: `dark:bg-gray-950`

**Mobile Overlay** (`src/components/layout/MobileOverlay.tsx`)
- Backdrop: `bg-black/50`

---

#### **UI Components**

**Cards** (All card components)
- Background: `dark:bg-gray-800`
- Borders: `dark:border-gray-700`
- Text: `dark:text-white`, `dark:text-gray-400`
- Shadows: Automatically adjusted by Tailwind

**Inputs & Forms** (`ExpenseModal.tsx`, `ExpenseList.tsx`)
- Background: `dark:bg-gray-700`
- Text: `dark:text-white`
- Borders: `dark:border-gray-600`
- Placeholders: `dark:placeholder-gray-400`
- Focus rings: `dark:focus:ring-blue-500`

**Buttons**
- Primary: `dark:bg-blue-600 dark:hover:bg-blue-700`
- Secondary: `dark:bg-gray-700 dark:hover:bg-gray-600`
- Danger: `dark:bg-red-600 dark:hover:bg-red-700`

**Badges** (`Badge.tsx`)
- All category badges have dark mode variants
- Example: `dark:bg-orange-900/30 dark:text-orange-400`

**Stat Cards** (`StatCard.tsx`)
- Background: `dark:bg-gray-800`
- Text: `dark:text-white`, `dark:text-gray-400`
- Icon backgrounds: `dark:bg-{color}-900/30`

**Tables** (`RecentExpensesTable.tsx`, `ExpenseList.tsx`)
- Headers: `dark:bg-gray-700 dark:text-gray-300`
- Rows: `dark:bg-gray-800 dark:hover:bg-gray-700`
- Borders: `dark:border-gray-700`

**Modals** (`ExpenseModal.tsx`, `DeleteConfirmModal.tsx`)
- Overlay: `bg-black/50`
- Content: `dark:bg-gray-800`
- Text: `dark:text-white`, `dark:text-gray-400`

**Loading States** (`LoadingSpinner.tsx`)
- Spinners: `dark:border-gray-700`
- Skeletons: `dark:bg-gray-700`

**Insight Cards** (`InsightCard.tsx`)
- Background: `dark:bg-gray-800`
- Icon backgrounds: `dark:bg-{color}-900/30`
- Text: `dark:text-white`, `dark:text-gray-400`

---

#### **Chart Components**

**Bar Chart** (`ExpenseBarChart.tsx`)
- ✅ Dynamic dark mode detection via `MutationObserver`
- ✅ Axis colors: `isDark ? '#9CA3AF' : '#6B7280'`
- ✅ Grid colors: `isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(156, 163, 175, 0.2)'`
- ✅ Card background: `dark:bg-gray-800`

**Pie Chart** (`CategoryPieChart.tsx`)
- ✅ Dynamic dark mode detection via `MutationObserver`
- ✅ Legend colors: `isDark ? '#9CA3AF' : '#6B7280'`
- ✅ Border colors: `isDark ? '#1F2937' : '#FFFFFF'`
- ✅ Center label colors: Dynamic based on theme
- ✅ Card background: `dark:bg-gray-800`

---

#### **Page Components**

**Dashboard** (`Dashboard.tsx`)
- All stat cards, charts, and tables have dark mode
- Greeting text: `dark:text-white`
- Subtitles: `dark:text-gray-400`

**Expense List** (`ExpenseList.tsx`)
- Filters section: `dark:bg-gray-800`
- Table: Full dark mode support
- Pagination: `dark:text-gray-400`
- Empty states: `dark:text-gray-400`

**Insights** (`Insights.tsx`)
- Summary bar: `dark:from-blue-900/20 dark:to-indigo-900/20`
- Insight cards: Full dark mode support
- Empty state: `dark:text-gray-400`

**Login/Register** (`Login.tsx`, `Register.tsx`)
- Forms: `dark:bg-gray-800`
- Inputs: `dark:bg-gray-700 dark:text-white`
- Split screen: `dark:bg-gray-900`

---

### 4. **Integration Points**

**App.tsx**
```typescript
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  // Initialize dark mode on app mount
  useDarkMode();
  
  // ... rest of app
}
```

**Header.tsx**
```typescript
import { useDarkMode } from '../../hooks/useDarkMode';

function Header() {
  const { isDark, toggleDark } = useDarkMode();
  
  return (
    <button onClick={toggleDark}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}
```

---

### 5. **Dark Mode Behavior**

**Initial Load:**
1. Check `localStorage` for saved theme (`expense_theme`)
2. If no saved theme, check system preference
3. Apply theme by adding/removing `dark` class on `<html>`

**Toggle:**
1. User clicks dark mode button in header
2. `toggleDark()` switches theme
3. Class updated on `<html>`
4. Theme saved to `localStorage`

**System Preference:**
- Listens for `prefers-color-scheme` changes
- Only updates if user hasn't set manual preference
- Respects user choice over system preference

**Chart Updates:**
- Charts use `MutationObserver` to watch for class changes
- Automatically re-render with new colors when theme changes
- No manual refresh needed

---

### 6. **Color Palette**

**Light Mode:**
- Background: `#FFFFFF`, `#F8FAFC`
- Text: `#111827`, `#6B7280`
- Borders: `#E5E7EB`
- Cards: `#FFFFFF` with subtle shadows

**Dark Mode:**
- Background: `#030712` (gray-950), `#111827` (gray-900)
- Text: `#FFFFFF`, `#9CA3AF`
- Borders: `#374151` (gray-700)
- Cards: `#1F2937` (gray-800) with adjusted shadows

---

### 7. **Testing Checklist**

✅ Dark mode toggle in header works
✅ Theme persists after page reload
✅ System preference respected on first visit
✅ All text is readable in both modes
✅ All buttons have proper hover states
✅ Charts update colors when theme changes
✅ Forms and inputs are styled correctly
✅ Modals have proper backdrop and content colors
✅ Tables have alternating row colors (if applicable)
✅ Loading states (spinners, skeletons) are visible
✅ Empty states are visible and styled
✅ Error states are visible and styled
✅ Transitions are smooth (no flash of wrong theme)

---

### 8. **Best Practices**

**Adding New Components:**
```typescript
// Always add dark mode classes
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

**Common Patterns:**
```typescript
// Cards
className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"

// Text
className="text-gray-900 dark:text-white"           // Primary text
className="text-gray-600 dark:text-gray-400"        // Secondary text
className="text-gray-500 dark:text-gray-500"        // Muted text

// Inputs
className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"

// Buttons
className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"

// Hover states
className="hover:bg-gray-100 dark:hover:bg-gray-700"
```

**Chart.js Dark Mode:**
```typescript
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  const checkDarkMode = () => {
    setIsDark(document.documentElement.classList.contains('dark'));
  };
  
  checkDarkMode();
  
  const observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  
  return () => observer.disconnect();
}, []);

// Use isDark in chart options
const options = {
  scales: {
    x: {
      ticks: { color: isDark ? '#9CA3AF' : '#6B7280' }
    }
  }
};
```

---

## 🎉 Summary

The dark mode system is **fully implemented** across the entire application:

- ✅ Custom `useDarkMode` hook with localStorage and system preference
- ✅ Tailwind CSS configured with `darkMode: 'class'`
- ✅ All components have dark mode classes
- ✅ Charts dynamically update colors
- ✅ Smooth transitions and no theme flash
- ✅ Persistent theme across sessions
- ✅ Accessible and user-friendly

**No additional work needed!** The dark mode system is production-ready.
