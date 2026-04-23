# Animation Implementation Examples

Real-world examples showing how to add animations to existing components.

---

## Example 1: Dashboard Page

### **Before:**

```typescript
const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
    </div>
  );
};
```

### **After:**

```typescript
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { StatCardSkeleton } from '../components/ui/Skeleton';

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Stat Cards with stagger animation */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
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
              key={stat.id}
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

---

## Example 2: Expense List Table

### **Before:**

```typescript
<table className="w-full">
  <thead>
    <tr>
      <th>Title</th>
      <th>Amount</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {expenses.map((expense) => (
      <tr key={expense.id}>
        <td>{expense.title}</td>
        <td>{formatCurrency(expense.amount)}</td>
        <td>{formatDate(expense.date)}</td>
        <td>
          <button onClick={() => handleEdit(expense)}>Edit</button>
          <button onClick={() => handleDelete(expense)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### **After:**

```typescript
import { motion } from 'framer-motion';
import { TableSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <TableSkeleton rows={5} cols={4} />
) : (
  <table className="w-full">
    <thead>
      <tr>
        <th>Title</th>
        <th>Amount</th>
        <th>Date</th>
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
          <td>{formatCurrency(expense.amount)}</td>
          <td>{formatDate(expense.date)}</td>
          <td>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEdit(expense)}
            >
              Edit
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ x: [0, -2, 2, -2, 2, 0] }}
              transition={{ duration: 0.4 }}
              onClick={() => handleDelete(expense)}
            >
              Delete
            </motion.button>
          </td>
        </motion.tr>
      ))}
    </tbody>
  </table>
)}
```

---

## Example 3: Insight Cards

### **Before:**

```typescript
const InsightsPage = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
};
```

### **After:**

```typescript
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { InsightCardSkeleton } from '../components/ui/Skeleton';

const InsightsPage = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <InsightCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <PageTransition>
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
            key={insight.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <InsightCard insight={insight} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  );
};
```

---

## Example 4: Button with Press Animation

### **Before:**

```typescript
<button
  onClick={handleAddExpense}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
>
  Add Expense
</button>
```

### **After:**

```typescript
import { motion } from 'framer-motion';

<motion.button
  whileTap={{ scale: 0.97 }}
  whileHover={{ scale: 1.02 }}
  onClick={handleAddExpense}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
>
  Add Expense
</motion.button>
```

---

## Example 5: Card with Hover Effect

### **Before:**

```typescript
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### **After:**

```typescript
import { motion } from 'framer-motion';

<motion.div
  whileHover={{
    y: -2,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  }}
  transition={{ duration: 0.2 }}
  className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6"
>
  <h3>Card Title</h3>
  <p>Card content</p>
</motion.div>
```

---

## Example 6: Modal with Animation

### **Before:**

```typescript
{isOpen && (
  <div className="fixed inset-0 z-50">
    <div className="fixed inset-0 bg-black/50" onClick={onClose} />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2>Modal Title</h2>
        <p>Modal content</p>
      </div>
    </div>
  </div>
)}
```

### **After:**

```typescript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {isOpen && (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal with scale + fade */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
        >
          <h2>Modal Title</h2>
          <p>Modal content</p>
        </motion.div>
      </div>
    </div>
  )}
</AnimatePresence>
```

---

## Example 7: Delete Button with Shake

### **Before:**

```typescript
<button
  onClick={() => handleDelete(id)}
  className="text-red-600 hover:text-red-700"
>
  <Trash2 size={18} />
</button>
```

### **After:**

```typescript
import { motion } from 'framer-motion';

<motion.button
  whileTap={{ scale: 0.97 }}
  whileHover={{
    x: [0, -2, 2, -2, 2, 0],
  }}
  transition={{ duration: 0.4 }}
  onClick={() => handleDelete(id)}
  className="text-red-600 hover:text-red-700"
>
  <Trash2 size={18} />
</motion.button>
```

---

## Example 8: Loading Spinner

### **Before:**

```typescript
<div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
```

### **After:**

```typescript
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

<LoadingSpinner size="md" color="border-blue-600" />
```

**Or with custom Framer Motion:**

```typescript
import { motion } from 'framer-motion';

<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  }}
  className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
/>
```

---

## Example 9: Chart Loading State

### **Before:**

```typescript
{isLoading ? (
  <div className="h-64 bg-gray-200 rounded animate-pulse" />
) : (
  <ExpenseBarChart data={data} />
)}
```

### **After:**

```typescript
import { ChartSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <ChartSkeleton height="h-64" title="Monthly Spending" />
) : (
  <ExpenseBarChart data={data} />
)}
```

---

## Example 10: Form with Skeleton

### **Before:**

```typescript
{isLoading ? (
  <div>Loading form...</div>
) : (
  <form>
    <input type="text" placeholder="Title" />
    <input type="number" placeholder="Amount" />
    <button type="submit">Submit</button>
  </form>
)}
```

### **After:**

```typescript
import { FormSkeleton } from '../components/ui/Skeleton';

{isLoading ? (
  <FormSkeleton />
) : (
  <form>
    <motion.input
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      type="text"
      placeholder="Title"
    />
    <motion.input
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      type="number"
      placeholder="Amount"
    />
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileTap={{ scale: 0.97 }}
      type="submit"
    >
      Submit
    </motion.button>
  </form>
)}
```

---

## Quick Reference

### **Common Animation Patterns:**

```typescript
// Fade in
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Scale pop
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}

// Slide from left
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}

// Button press
whileTap={{ scale: 0.97 }}

// Card hover
whileHover={{ y: -2 }}

// Shake
whileHover={{ x: [0, -2, 2, -2, 2, 0] }}

// Stagger children
variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}
```

---

## Performance Tips

1. **Use `layout` prop sparingly** - it can be expensive
2. **Avoid animating `width` and `height`** - use `scale` instead
3. **Use `will-change` CSS for complex animations**
4. **Reduce motion for accessibility:**

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

5. **Use `AnimatePresence` for exit animations**
6. **Keep animation durations short** (0.2-0.3s)
7. **Test on slower devices**

---

## Summary

These examples show how to progressively enhance your components with animations and loading states. Start with simple fade-ins and button presses, then add more complex stagger and hover effects as needed.

**Key Takeaways:**
- Always provide loading skeletons that match your content layout
- Use PageTransition on all pages for consistency
- Add whileTap to all buttons for tactile feedback
- Use stagger animations for lists and grids
- Keep animations subtle and fast
- Test on real devices for performance
