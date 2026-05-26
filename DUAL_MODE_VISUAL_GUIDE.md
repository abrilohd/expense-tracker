# 🎨 Dual-Mode Visual Guide

## Quick Reference for Developers

This guide shows the exact pattern used throughout the application for dual-mode support.

---

## 🎯 Core Pattern

### Basic Structure
```tsx
// ❌ BEFORE (Hardcoded Dark Mode)
<div style={{ background: '#141720', color: '#FFFFFF' }}>
  <h1 style={{ color: '#FFFFFF' }}>Title</h1>
  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Description</p>
</div>

// ✅ AFTER (Dual-Mode Support)
<div className="bg-white dark:bg-[#141720] text-gray-900 dark:text-white">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
  <p className="text-gray-600 dark:text-white/70">Description</p>
</div>
```

---

## 📦 Component Examples

### 1. Page Container
```tsx
// ❌ BEFORE
<div style={{ padding: '24px', background: '#0B0D14' }}>

// ✅ AFTER
<div className="p-6 bg-gray-50 dark:bg-[#0B0D14]">
```

### 2. Card Component
```tsx
// ❌ BEFORE
<div style={{
  background: '#141720',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '20px'
}}>

// ✅ AFTER
<div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/10 rounded-2xl p-5">
```

### 3. Text Elements
```tsx
// ❌ BEFORE
<h1 style={{ color: '#FFFFFF', fontSize: '22px' }}>Title</h1>
<p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Description</p>
<span style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Muted</span>

// ✅ AFTER
<h1 className="text-gray-900 dark:text-white text-2xl">Title</h1>
<p className="text-gray-600 dark:text-white/70">Description</p>
<span className="text-gray-500 dark:text-white/45">Muted</span>
```

### 4. Input Fields
```tsx
// ❌ BEFORE
<input
  style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF'
  }}
/>

// ✅ AFTER
<input
  className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
/>
```

### 5. Buttons
```tsx
// ❌ BEFORE
<button style={{
  background: 'rgba(91, 78, 232, 0.15)',
  color: '#A78BFA',
  border: '1px solid rgba(91, 78, 232, 0.2)'
}}>

// ✅ AFTER
<button className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
```

### 6. Modal Overlays
```tsx
// ❌ BEFORE
<div style={{
  background: '#1A1D28',
  border: '1px solid rgba(255, 255, 255, 0.1)'
}}>

// ✅ AFTER
<div className="bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/10">
```

---

## 🎨 Color Reference

### Backgrounds
| Element | Light Mode | Dark Mode | Tailwind Class |
|---------|-----------|-----------|----------------|
| Page | `#FFFFFF` or `#F9FAFB` | `#0B0D14` | `bg-white dark:bg-[#0B0D14]` |
| Card | `#FFFFFF` | `#141720` | `bg-white dark:bg-[#141720]` |
| Input | `#F9FAFB` | `rgba(255,255,255,0.05)` | `bg-gray-50 dark:bg-white/5` |
| Subtle | `#F3F4F6` | `rgba(255,255,255,0.03)` | `bg-gray-100 dark:bg-white/[0.03]` |
| Modal | `#FFFFFF` | `#1A1D28` | `bg-white dark:bg-[#1A1D28]` |

### Text Colors
| Type | Light Mode | Dark Mode | Tailwind Class |
|------|-----------|-----------|----------------|
| Primary | `#111827` | `#FFFFFF` | `text-gray-900 dark:text-white` |
| Secondary | `#4B5563` | `rgba(255,255,255,0.7)` | `text-gray-600 dark:text-white/70` |
| Muted | `#6B7280` | `rgba(255,255,255,0.45)` | `text-gray-500 dark:text-white/45` |
| Disabled | `#9CA3AF` | `rgba(255,255,255,0.35)` | `text-gray-400 dark:text-white/35` |

### Borders
| Type | Light Mode | Dark Mode | Tailwind Class |
|------|-----------|-----------|----------------|
| Standard | `#E5E7EB` | `rgba(255,255,255,0.08)` | `border-gray-200 dark:border-white/8` |
| Emphasized | `#D1D5DB` | `rgba(255,255,255,0.1)` | `border-gray-300 dark:border-white/10` |
| Subtle | `#F3F4F6` | `rgba(255,255,255,0.04)` | `border-gray-100 dark:border-white/[0.04]` |

---

## 🔧 Common Patterns

### Pattern 1: Page Header
```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
      Page Title
    </h1>
    <p className="text-sm text-gray-500 dark:text-white/45 mt-1">
      Page description
    </p>
  </div>
  <button className="btn-primary">
    Action
  </button>
</div>
```

### Pattern 2: Card with Content
```tsx
<div className="bg-white dark:bg-[#141720] border border-gray-200 dark:border-white/8 rounded-2xl p-6">
  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
    Card Title
  </h3>
  <p className="text-sm text-gray-600 dark:text-white/70">
    Card content goes here
  </p>
</div>
```

### Pattern 3: Form Input
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
    Label
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
    placeholder="Enter value"
  />
</div>
```

### Pattern 4: Button Group
```tsx
<div className="flex gap-2">
  {['Option 1', 'Option 2', 'Option 3'].map((option) => (
    <button
      key={option}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        selected === option
          ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-white/10'
      }`}
    >
      {option}
    </button>
  ))}
</div>
```

### Pattern 5: Modal
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Backdrop */}
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
  
  {/* Modal */}
  <div className="relative bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/10 rounded-2xl p-6 max-w-md w-full">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Modal Title
    </h3>
    <p className="text-sm text-gray-600 dark:text-white/70 mb-6">
      Modal content
    </p>
    <div className="flex gap-3">
      <button className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/70">
        Cancel
      </button>
      <button className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white">
        Confirm
      </button>
    </div>
  </div>
</div>
```

---

## 🎯 Quick Tips

### 1. Always Use Tailwind Classes
```tsx
// ❌ DON'T
<div style={{ background: '#141720' }}>

// ✅ DO
<div className="bg-white dark:bg-[#141720]">
```

### 2. Combine with Inline Styles Only When Necessary
```tsx
// ✅ GOOD - Tailwind for theme, inline for specific values
<div 
  className="bg-white dark:bg-[#141720]"
  style={{ fontSize: '22px', letterSpacing: '-0.4px' }}
>
```

### 3. Use Consistent Opacity Values
```tsx
// Text opacity scale
text-white/100  // 100% - Primary text
text-white/70   // 70% - Secondary text
text-white/45   // 45% - Muted text
text-white/35   // 35% - Disabled text

// Background opacity scale
bg-white/10     // 10% - Subtle background
bg-white/5      // 5% - Very subtle background
bg-white/[0.03] // 3% - Ultra subtle background
```

### 4. Border Opacity
```tsx
border-white/10  // 10% - Standard border
border-white/8   // 8% - Subtle border
border-white/[0.06] // 6% - Very subtle border
border-white/[0.04] // 4% - Ultra subtle border
```

---

## 📝 Checklist for New Components

When creating a new component, ensure:

- [ ] All backgrounds use `bg-white dark:bg-[color]`
- [ ] All text uses `text-gray-X dark:text-white/X`
- [ ] All borders use `border-gray-X dark:border-white/X`
- [ ] All inputs have dual-mode support
- [ ] All buttons have dual-mode support
- [ ] All hover states work in both modes
- [ ] All focus states are visible in both modes
- [ ] No hardcoded colors in inline styles
- [ ] Consistent with existing patterns
- [ ] Tested in both light and dark modes

---

## 🚀 Testing Your Changes

### Visual Test
1. Toggle to light mode
2. Check all text is readable
3. Check all backgrounds are appropriate
4. Check all borders are visible
5. Toggle to dark mode
6. Repeat checks

### Functional Test
1. Verify theme persists on refresh
2. Verify smooth transitions
3. Verify no flash of unstyled content
4. Verify all interactive elements work

---

## 💡 Common Mistakes to Avoid

### ❌ Mistake 1: Hardcoded Colors
```tsx
// DON'T
<div style={{ color: '#FFFFFF' }}>

// DO
<div className="text-gray-900 dark:text-white">
```

### ❌ Mistake 2: Missing Dark Variant
```tsx
// DON'T
<div className="bg-white">

// DO
<div className="bg-white dark:bg-[#141720]">
```

### ❌ Mistake 3: Inconsistent Opacity
```tsx
// DON'T
<span style={{ color: 'rgba(255, 255, 255, 0.73)' }}>

// DO
<span className="text-white/70">
```

### ❌ Mistake 4: Wrong Background for Light Mode
```tsx
// DON'T
<div className="bg-gray-900 dark:bg-[#141720]">

// DO
<div className="bg-white dark:bg-[#141720]">
```

---

## 🎉 Success Criteria

Your component has perfect dual-mode support when:

✅ All text is readable in both modes  
✅ All backgrounds adapt properly  
✅ All borders are visible in both modes  
✅ All hover states work in both modes  
✅ All focus states are visible in both modes  
✅ No hardcoded colors remain  
✅ Consistent with other components  
✅ Smooth theme transitions  
✅ No visual glitches  
✅ Professional appearance  

---

*Use this guide as a reference when implementing dual-mode support*  
*Follow these patterns for consistency across the application*  
*Test thoroughly in both light and dark modes*
