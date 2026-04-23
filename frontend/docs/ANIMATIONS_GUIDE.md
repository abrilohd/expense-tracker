# Animations & Skeletons Guide

Complete guide to using Framer Motion animations and loading skeletons in the Expense Tracker app.

---

## 📦 Components Created

### 1. **Skeleton Components** (`src/components/ui/Skeleton.tsx`)
- `Skeleton` - Base skeleton with pulse animation
- `StatCardSkeleton` - Matches StatCard layout
- `TableRowSkeleton` - Animated table rows
- `TableSkeleton` - Complete table with header
- `InsightCardSkeleton` - Matches InsightCard layout
- `ChartSkeleton` - Chart placeholder
- `CardSkeleton` - Generic card skeleton
- `FormSkeleton` - Form fields skeleton
- `ListSkeleton` - List items skeleton
- `GridSkeleton` - Grid layout skeleton
- `DashboardSkeleton` - Complete dashboard layout

### 2. **Animation Components** (`src/components/PageTransition.tsx`)
- `PageTransition` - Fade + slide up for route changes
- `StaggerContainer` - Container for staggered children
- `StaggerItem` - Individual staggered item
- `ScalePop` - Scale animation (0.95 → 1)
- `SlideInLeft` - Slide from left
- `FadeIn` - Simple fade in
- `ButtonPress` - Scale down on click (0.97)
- `CardHover` - Lift on hover with shadow
- `Shake` - Shake animation (for delete buttons)
- `Rotate` - Continuous rotation (for spinners)
- `Bounce` - Bounce animation
- `Pulse` - Pulse animation

### 3. **Updated Components**
- `LoadingSpinner` - Now uses Framer Motion for rotation
- `TableSkeleton` - Now has slide-in animation

---

## 🎨 Usage Examples

### **Page Transitions**

Wrap each page component with `PageTransition`:

```typescript
import { PageTransition } from '../components/PageTransition';

const DashboardPage = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page content */}
      </div>
    </PageTransition>
  );
};
```

---

### **Stagger Animations (Insight Cards)**

Use `StaggerContainer` and `StaggerItem` for sequential animations:

```typescript
import { StaggerContainer, StaggerItem } from '../components/PageTransition';

const InsightsPage = () => {
  return (
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {insights.map((insight, index) => (
        <StaggerItem key={index}>
          <InsightCard insight={insight} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};
```

**Alternative using motion.div directly:**

```typescript
import { motion } from 'framer-motion';

<motion.div
  className="grid grid-cols-1 md:grid-cols-2 gap-6"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
>
  {insights.map((insight, index) => (
    <motion.div
      key={index}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <InsightCard insight={insight} index={index} />
    </motion.div>
  ))}
</motion.div>
```

---

### **Stat Cards with Scale Pop**

```typescript
import { ScalePop } from '../components/PageTransition';

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat, index) => (
    <ScalePop key={index} delay={index * 0.1}>
      <StatCard {...stat} />
    </ScalePop>
  ))}
</div>
```

**Or using motion.div:**

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
>
  <StatCard {...stat} />
</motion.div>
```

---

### **Table Rows Slide In**

```typescript
import { SlideInLeft } from '../components/PageTransition';

<tbody>
  {expenses.map((expense, index) => (
    <SlideInLeft key={expense.id} delay={index * 0.05}>
      <tr>
        <td>{expense.title}</td>
        <td>{expense.amount}</td>
      </tr>
    </SlideInLeft>
  ))}
</tbody>
```

---

### **Button Press Animation**

```typescript
import { ButtonPress } from '../components/PageTransition';

<ButtonPress
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  onClick={handleClick}
>
  Add Expense
</ButtonPress>
```

**Or add to existing button:**

```typescript
<motion.button
  whileTap={{ scale: 0.97 }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  onClick={handleClick}
>
  Add Expense
</motion.button>
```

---

### **Card Hover Lift**

```typescript
import { CardHover } from '../components/PageTransition';

<CardHover className="bg-white dark:bg-gray-800 rounded-xl p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</CardHover>
```

**Or add to existing card:**

```typescript
<motion.div
  whileHover={{
    y: -2,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }}
  transition={{ duration: 0.2 }}
  className="bg-white dark:bg-gray-800 rounded-xl p-6"
>
  <h3>Card Title</h3>
  <p>Card content</p>
</motion.div>
```

---

### **Delete Button Shake**

```typescript
import { Shake } from '../components/PageTransition';

<Shake>
  <button className="text-red-600 hover:text-red-700">
    <Trash2 size={18} />
  </button>
</Shake>
```

**Or using CSS class:**

```typescript
<button className="text-red-600 hover:text-red-700 shake-hover">
  <Trash2 size={18} />
</button>
```

---

### **Loading Skeletons**

#### **Stat Card Skeleton**

```typescript
import { StatCardSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat) => <StatCard key={stat.id} {...stat} />)}
  </div>
)}
```

#### **Table Skeleton**

```typescript
import { TableSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <TableSkeleton rows={5} cols={5} />
) : (
  <table>
    {/* Table content */}
  </table>
)}
```

#### **Insight Card Skeleton**

```typescript
import { InsightCardSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <InsightCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {insights.map((insight) => <InsightCard key={insight.id} {...insight} />)}
  </div>
)}
```

#### **Chart Skeleton**

```typescript
import { ChartSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <ChartSkeleton height="h-64" title="Monthly Spending" />
) : (
  <ExpenseBarChart data={data} />
)}
```

#### **Complete Dashboard Skeleton**

```typescript
import { DashboardSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <DashboardSkeleton />
) : (
  <div className="space-y-6">
    {/* Dashboard content */}
  </div>
)}
```

---

## 🎯 Animation Patterns

### **1. Page Load Animation**

```typescript
const MyPage = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Content fades in and slides up */}
      </div>
    </PageTransition>
  );
};
```

### **2. Staggered List Animation**

```typescript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
>
  {items.map((item, index) => (
    <motion.div
      key={index}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### **3. Card Grid Animation**

```typescript
<div className="grid grid-cols-3 gap-6">
  {cards.map((card, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card {...card} />
    </motion.div>
  ))}
</div>
```

### **4. Button Interactions**

```typescript
<motion.button
  whileTap={{ scale: 0.97 }}
  whileHover={{ scale: 1.02 }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Click Me
</motion.button>
```

### **5. Modal Animation**

```typescript
<AnimatePresence>
  {isOpen && (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl p-6">
          {/* Modal content */}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## 🎨 CSS Animations

### **Shimmer Effect**

Add `shimmer` class to any element:

```html
<div className="h-4 bg-gray-200 rounded shimmer"></div>
```

### **Shake on Hover**

Add `shake-hover` class:

```html
<button className="shake-hover">Delete</button>
```

---

## 📋 Implementation Checklist

### **Pages to Update:**

- [ ] **Dashboard** - Add PageTransition, stagger stat cards
- [ ] **Expense List** - Add PageTransition, slide-in table rows
- [ ] **Insights** - Add PageTransition, stagger insight cards
- [ ] **Login/Register** - Add PageTransition

### **Components to Update:**

- [ ] **StatCard** - Add hover lift animation
- [ ] **InsightCard** - Already has stagger animation
- [ ] **ExpenseModal** - Add button press animations
- [ ] **DeleteConfirmModal** - Add shake to delete button
- [ ] **RecentExpensesTable** - Add slide-in to rows
- [ ] **All buttons** - Add whileTap={{ scale: 0.97 }}

### **Loading States:**

- [ ] **Dashboard** - Use DashboardSkeleton
- [ ] **Expense List** - Use TableSkeleton
- [ ] **Insights** - Use InsightCardSkeleton
- [ ] **Charts** - Use ChartSkeleton

---

## 🚀 Quick Start

### **1. Wrap pages with PageTransition:**

```typescript
import { PageTransition } from '../components/PageTransition';

const MyPage = () => (
  <PageTransition>
    {/* content */}
  </PageTransition>
);
```

### **2. Add loading skeletons:**

```typescript
import { StatCardSkeleton } from '../components/ui/Skeleton';

{isLoading ? <StatCardSkeleton /> : <StatCard {...data} />}
```

### **3. Add button animations:**

```typescript
<motion.button whileTap={{ scale: 0.97 }}>
  Click Me
</motion.button>
```

### **4. Add card hover effects:**

```typescript
<motion.div whileHover={{ y: -2 }}>
  <Card />
</motion.div>
```

---

## 🎯 Best Practices

1. **Use PageTransition on all pages** for consistent route transitions
2. **Use skeletons that match the actual component layout** for smooth transitions
3. **Keep animation durations short** (0.2-0.3s) for snappy feel
4. **Use stagger delays of 0.05-0.1s** for list items
5. **Add whileTap to all clickable elements** for tactile feedback
6. **Use AnimatePresence** for exit animations (modals, dropdowns)
7. **Avoid animating too many elements at once** - can cause performance issues
8. **Test animations on slower devices** to ensure smooth performance

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Easing Functions](https://easings.net/)
- [Motion Design Principles](https://material.io/design/motion)

---

## ✅ Summary

All animation and skeleton components are ready to use! Simply import and apply them to your components for a polished, professional user experience.

**Key Features:**
- ✅ Page transitions with fade + slide
- ✅ Stagger animations for lists
- ✅ Button press feedback
- ✅ Card hover effects
- ✅ Shake animation for delete buttons
- ✅ Complete skeleton loading states
- ✅ Smooth, performant animations
- ✅ Dark mode support
- ✅ TypeScript strict mode
