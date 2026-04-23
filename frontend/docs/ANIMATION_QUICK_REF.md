# Animation Quick Reference Card

Quick copy-paste snippets for common animation patterns.

---

## 🎯 Import Statements

```typescript
// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// Animation Components
import { 
  PageTransition, 
  StaggerContainer, 
  StaggerItem,
  ButtonPress,
  CardHover,
  Shake 
} from '../components/PageTransition';

// Skeleton Components
import {
  Skeleton,
  StatCardSkeleton,
  TableSkeleton,
  InsightCardSkeleton,
  ChartSkeleton,
  DashboardSkeleton,
} from '../components/ui/Skeleton';

// Loading Spinner
import { LoadingSpinner, PageLoader } from '../components/ui/LoadingSpinner';
```

---

## 📄 Page Wrapper

```typescript
<PageTransition>
  <div className="space-y-6">
    {/* Your page content */}
  </div>
</PageTransition>
```

---

## 🔘 Button Animations

### Basic Press
```typescript
<motion.button
  whileTap={{ scale: 0.97 }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Click Me
</motion.button>
```

### Press + Hover
```typescript
<motion.button
  whileTap={{ scale: 0.97 }}
  whileHover={{ scale: 1.02 }}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Click Me
</motion.button>
```

### Delete Button (with shake)
```typescript
<motion.button
  whileTap={{ scale: 0.97 }}
  whileHover={{ x: [0, -2, 2, -2, 2, 0] }}
  transition={{ duration: 0.4 }}
  className="text-red-600"
>
  <Trash2 size={18} />
</motion.button>
```

---

## 🃏 Card Animations

### Hover Lift
```typescript
<motion.div
  whileHover={{ y: -2 }}
  className="bg-white dark:bg-gray-800 rounded-xl p-6"
>
  Card Content
</motion.div>
```

### Hover Lift + Shadow
```typescript
<motion.div
  whileHover={{
    y: -2,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }}
  transition={{ duration: 0.2 }}
  className="bg-white dark:bg-gray-800 rounded-xl p-6"
>
  Card Content
</motion.div>
```

### Scale Pop (on mount)
```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
  className="bg-white dark:bg-gray-800 rounded-xl p-6"
>
  Card Content
</motion.div>
```

---

## 📊 List Animations

### Stagger Children
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
  className="grid grid-cols-2 gap-6"
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

### Table Rows Slide In
```typescript
<tbody>
  {rows.map((row, index) => (
    <motion.tr
      key={row.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <td>{row.data}</td>
    </motion.tr>
  ))}
</tbody>
```

---

## 🪟 Modal Animations

```typescript
<AnimatePresence>
  {isOpen && (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
        >
          Modal Content
        </motion.div>
      </div>
    </div>
  )}
</AnimatePresence>
```

---

## 💀 Loading Skeletons

### Stat Cards
```typescript
{isLoading ? (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-4 gap-4">
    {stats.map((stat) => <StatCard key={stat.id} {...stat} />)}
  </div>
)}
```

### Table
```typescript
{isLoading ? (
  <TableSkeleton rows={5} cols={4} />
) : (
  <table>{/* table content */}</table>
)}
```

### Insight Cards
```typescript
{isLoading ? (
  <div className="grid grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <InsightCardSkeleton key={i} />
    ))}
  </div>
) : (
  <div className="grid grid-cols-2 gap-6">
    {insights.map((insight) => <InsightCard key={insight.id} {...insight} />)}
  </div>
)}
```

### Chart
```typescript
{isLoading ? (
  <ChartSkeleton height="h-64" title="Monthly Spending" />
) : (
  <ExpenseBarChart data={data} />
)}
```

### Complete Dashboard
```typescript
{isLoading ? (
  <DashboardSkeleton />
) : (
  <div className="space-y-6">
    {/* Dashboard content */}
  </div>
)}
```

---

## 🔄 Loading Spinner

### Basic
```typescript
<LoadingSpinner size="md" color="border-blue-600" />
```

### Sizes
```typescript
<LoadingSpinner size="sm" />  // Small
<LoadingSpinner size="md" />  // Medium (default)
<LoadingSpinner size="lg" />  // Large
```

### Page Loader
```typescript
<PageLoader />  // Centered spinner with "Loading..." text
```

---

## 🎨 Common Variants

### Fade In
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
```

### Slide Up
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

### Slide Down
```typescript
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
```

### Slide Left
```typescript
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
```

### Slide Right
```typescript
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
```

### Scale Pop
```typescript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
```

### Scale Shrink
```typescript
initial={{ opacity: 0, scale: 1.05 }}
animate={{ opacity: 1, scale: 1 }}
```

---

## ⚙️ Common Transitions

### Default (smooth)
```typescript
transition={{ duration: 0.3, ease: 'easeOut' }}
```

### Fast
```typescript
transition={{ duration: 0.2 }}
```

### Slow
```typescript
transition={{ duration: 0.5 }}
```

### With Delay
```typescript
transition={{ duration: 0.3, delay: 0.1 }}
```

### Spring
```typescript
transition={{ type: 'spring', damping: 25, stiffness: 200 }}
```

---

## 🎯 Complete Examples

### Animated Page
```typescript
const MyPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.div
          className="grid grid-cols-4 gap-4"
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
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
};
```

### Animated Table
```typescript
<table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Amount</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {expenses.map((expense, index) => (
      <motion.tr
        key={expense.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <td>{expense.title}</td>
        <td>{expense.amount}</td>
        <td>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleEdit(expense)}
          >
            Edit
          </motion.button>
        </td>
      </motion.tr>
    ))}
  </tbody>
</table>
```

---

## 📱 Responsive Animations

### Disable on Mobile
```typescript
const isMobile = window.innerWidth < 768;

<motion.div
  initial={isMobile ? {} : { opacity: 0, y: 20 }}
  animate={isMobile ? {} : { opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

### Reduce Motion
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

---

## 🎨 CSS Classes

### Shimmer Effect
```html
<div className="h-4 bg-gray-200 rounded shimmer"></div>
```

### Shake on Hover
```html
<button className="shake-hover">Delete</button>
```

### Pulse Animation
```html
<div className="animate-pulse">Loading...</div>
```

---

## 💡 Tips

1. **Keep durations short** - 0.2-0.3s feels snappy
2. **Use stagger for lists** - Makes content feel alive
3. **Add whileTap to all buttons** - Provides tactile feedback
4. **Match skeletons to content** - Smooth transition when loading completes
5. **Test on mobile** - Ensure animations don't lag
6. **Use AnimatePresence** - For exit animations
7. **Avoid animating layout** - Use transform instead

---

## 🚀 Ready to Copy-Paste!

All snippets are production-ready and tested. Just copy, paste, and adjust as needed!
