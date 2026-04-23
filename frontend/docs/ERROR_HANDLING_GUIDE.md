# Error Handling & Error Boundaries Guide

Complete error handling system for the Expense Tracker React application.

---

## 📦 Components Created

### **1. ErrorBoundary Component**
**File:** `src/components/ErrorBoundary.tsx`

**Features:**
- ✅ Catches React render errors in child components
- ✅ Displays friendly error page with retry functionality
- ✅ Logs errors to console for debugging
- ✅ Shows error details in development mode
- ✅ Provides "Try Again" and "Reload Page" buttons
- ✅ Dark mode support
- ✅ Ready for error reporting service integration (Sentry, etc.)

**Usage:**
```typescript
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Custom Fallback:**
```typescript
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

---

### **2. NotFound Page**
**File:** `src/pages/NotFound.tsx`

**Features:**
- ✅ Clean 404 design with search icon illustration
- ✅ "Back to Dashboard" button
- ✅ "Go Back" button (browser history)
- ✅ Helpful links to dashboard and expenses
- ✅ Framer Motion animations
- ✅ Dark mode support
- ✅ Responsive design

---

### **3. Enhanced API Client**
**File:** `src/api/client.ts`

**Network Error Handling:**
- ✅ **Backend Offline** - Shows toast: "Backend server is offline"
- ✅ **Request Timeout** - Shows toast: "Request timed out"
- ✅ **401 Unauthorized** - Shows toast + redirects to login
- ✅ **403 Forbidden** - Shows toast: "Permission denied"
- ✅ **404 Not Found** - Shows toast: "Resource not found"
- ✅ **500 Server Error** - Shows toast: "Server error occurred"
- ✅ **422 Validation Errors** - Silent (let components handle)
- ✅ **Generic Errors** - Shows toast with error message

---

## 🎯 Error Handling Coverage

### **1. React Render Errors**
**Caught by:** ErrorBoundary

**Examples:**
- Component throws error during render
- Invalid prop types
- Undefined variable access
- Null reference errors

**User Experience:**
- Friendly error page displayed
- "Try Again" button to retry rendering
- "Reload Page" button to refresh
- Error details shown in development mode

---

### **2. Network Errors**
**Caught by:** API Client Interceptor

**Examples:**
- Backend server is down
- No internet connection
- Request timeout
- DNS resolution failure

**User Experience:**
- Toast notification: "Backend server is offline"
- Error message in component
- Retry button available in components

---

### **3. HTTP Status Errors**
**Caught by:** API Client Interceptor

| Status | Error | User Experience |
|--------|-------|-----------------|
| 401 | Unauthorized | Toast + redirect to login |
| 403 | Forbidden | Toast: "Permission denied" |
| 404 | Not Found | Toast: "Resource not found" |
| 422 | Validation | Silent (component handles) |
| 500 | Server Error | Toast: "Server error occurred" |

---

### **4. Route Errors**
**Caught by:** React Router

**Examples:**
- User navigates to non-existent route
- Typo in URL
- Deleted page

**User Experience:**
- 404 Not Found page displayed
- "Back to Dashboard" button
- "Go Back" button
- Helpful navigation links

---

## 🚀 Implementation

### **App.tsx Integration**

```typescript
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Your routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

---

## 📋 Error Scenarios & Handling

### **Scenario 1: Backend Server Down**

**What Happens:**
1. User tries to load dashboard
2. API request fails with network error
3. API interceptor detects no response
4. Toast notification: "Backend server is offline 🔌"
5. Component shows error state with retry button

**Code:**
```typescript
// Automatically handled by API client
// Component receives error and can show retry button
const fetchDashboard = async () => {
  try {
    const data = await getDashboard();
    setData(data);
  } catch (error) {
    setError(error.message); // "Backend server is offline"
    // Show retry button in UI
  }
};
```

---

### **Scenario 2: Component Render Error**

**What Happens:**
1. Component throws error during render
2. ErrorBoundary catches the error
3. Error logged to console
4. Friendly error page displayed
5. User can click "Try Again" to retry

**Example:**
```typescript
// This will be caught by ErrorBoundary
const BrokenComponent = () => {
  throw new Error('Something went wrong!');
  return <div>Never rendered</div>;
};

// Wrap with ErrorBoundary
<ErrorBoundary>
  <BrokenComponent />
</ErrorBoundary>
```

---

### **Scenario 3: Invalid Route**

**What Happens:**
1. User navigates to `/invalid-route`
2. React Router matches `*` route
3. NotFound page displayed
4. User can navigate back to dashboard

**Example:**
```typescript
// Automatically handled by React Router
<Route path="*" element={<NotFoundPage />} />
```

---

### **Scenario 4: Session Expired**

**What Happens:**
1. User makes authenticated request
2. Backend returns 401 Unauthorized
3. API interceptor detects 401
4. Toast notification: "Session expired"
5. Token removed from localStorage
6. User redirected to login page

**Code:**
```typescript
// Automatically handled by API client
if (error.response?.status === 401) {
  localStorage.removeItem(TOKEN_KEY);
  toast.error('Session expired. Please login again.');
  window.location.href = '/login';
}
```

---

### **Scenario 5: Validation Error**

**What Happens:**
1. User submits form with invalid data
2. Backend returns 422 with validation errors
3. API interceptor passes error to component (no toast)
4. Component displays field-specific errors

**Code:**
```typescript
// Component handles validation errors
try {
  await createExpense(data);
  toast.success('Expense created!');
} catch (error) {
  // error.message contains validation details
  setFormErrors(error.message);
}
```

---

## 🎨 Error UI Components

### **ErrorBoundary Error Page**

```
┌─────────────────────────────────────┐
│                                     │
│         🔺 (Red Circle)             │
│                                     │
│   Oops! Something went wrong        │
│                                     │
│   We encountered an unexpected      │
│   error. Don't worry, your data     │
│   is safe.                          │
│                                     │
│   [Error Details - Dev Only]        │
│                                     │
│   [Try Again]  [Reload Page]        │
│                                     │
│   If the problem persists,          │
│   please contact support.           │
│                                     │
└─────────────────────────────────────┘
```

### **404 Not Found Page**

```
┌─────────────────────────────────────┐
│                                     │
│              404                    │
│         🔍 (Search Icon)            │
│                                     │
│        Page Not Found               │
│                                     │
│   The page you're looking for       │
│   doesn't exist or has been moved.  │
│                                     │
│   [🏠 Back to Dashboard]            │
│   [← Go Back]                       │
│                                     │
│   Need help? Check out our          │
│   dashboard or expenses.            │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 Customization

### **Custom Error Boundary Fallback**

```typescript
const CustomErrorUI = () => (
  <div className="error-page">
    <h1>Custom Error Page</h1>
    <button onClick={() => window.location.reload()}>
      Reload
    </button>
  </div>
);

<ErrorBoundary fallback={<CustomErrorUI />}>
  <App />
</ErrorBoundary>
```

### **Error Reporting Integration**

```typescript
// In ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  console.error('ErrorBoundary caught an error:', error);
  
  // Send to Sentry
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}
```

### **Custom Toast Styling**

```typescript
// In API client
toast.error('Backend server is offline', {
  duration: 5000,
  icon: '🔌',
  style: {
    background: '#FEE2E2',
    color: '#991B1B',
  },
});
```

---

## 📊 Error Logging

### **Console Logs (Development)**

```javascript
// ErrorBoundary logs
ErrorBoundary caught an error: Error: Cannot read property 'map' of undefined
Error Info: { componentStack: "..." }
Component Stack: at ComponentName (...)

// API Client logs
Network Error: Backend server is offline
HTTP 401: Session expired
HTTP 500: Server error occurred
```

### **Production Error Reporting**

Integrate with error tracking services:

**Sentry:**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

**LogRocket:**
```typescript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

---

## ✅ Testing Error Handling

### **Test ErrorBoundary**

```typescript
// Trigger render error
const ThrowError = () => {
  throw new Error('Test error');
};

<ErrorBoundary>
  <ThrowError />
</ErrorBoundary>
```

### **Test Network Error**

```bash
# Stop backend server
# Try to load dashboard
# Should see: "Backend server is offline" toast
```

### **Test 404 Page**

```bash
# Navigate to: http://localhost:5173/invalid-route
# Should see: 404 Not Found page
```

### **Test Session Expiration**

```typescript
// Manually expire token
localStorage.setItem('expense_token', 'invalid-token');
// Make authenticated request
// Should redirect to login with toast
```

---

## 🎯 Best Practices

1. **Always wrap app with ErrorBoundary** - Catches unexpected errors
2. **Use specific error messages** - Help users understand what went wrong
3. **Provide retry mechanisms** - Let users recover from errors
4. **Log errors in development** - Easier debugging
5. **Report errors in production** - Track issues in real-time
6. **Don't show technical details to users** - Keep error messages user-friendly
7. **Handle validation errors in components** - Don't show global toasts
8. **Test error scenarios** - Ensure error handling works correctly

---

## 🚀 Summary

✅ **ErrorBoundary** - Catches React render errors
✅ **NotFound Page** - Clean 404 design
✅ **API Error Handling** - Network errors, HTTP status codes
✅ **Toast Notifications** - User-friendly error messages
✅ **Retry Mechanisms** - Let users recover from errors
✅ **Dark Mode Support** - All error UIs support dark mode
✅ **Development Logging** - Detailed error information
✅ **Production Ready** - Ready for error reporting integration

**All error scenarios are now handled gracefully!** 🎉
