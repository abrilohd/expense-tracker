# Requirements Document: Complete Personal Expense Tracker Features

## Introduction

This document specifies the missing features for an existing Personal Expense Tracker application built with FastAPI (backend) and React/TypeScript (frontend). The application currently supports user authentication, expense CRUD operations, dashboard analytics, and dark mode. This specification adds income management, budget tracking, savings goals, enhanced reporting, notifications, payment method tracking, and profile enhancements to create a comprehensive personal finance management system.

The requirements are organized by priority (HIGH, MEDIUM, LOW) and complexity to enable phased implementation. All new features must integrate seamlessly with existing functionality without breaking current operations.

## Glossary

- **System**: The Personal Expense Tracker application (backend + frontend)
- **User**: An authenticated person using the expense tracker
- **Expense**: A financial outflow record with amount, category, date, and description
- **Income**: A financial inflow record with amount, source, date, and description
- **Budget**: A spending limit set for a time period (monthly) or category
- **Savings_Goal**: A target amount the user wants to save with progress tracking
- **Transaction**: Generic term for either an expense or income record
- **Category**: Classification of expenses (Food, Transport, Housing, Entertainment, Health, Shopping, Education, Other)
- **Income_Source**: Classification of income (Salary, Business, Freelancing, Gifts, Other)
- **Payment_Method**: Method used for expense payment (Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet)
- **Balance**: Calculated value of total income minus total expenses
- **Budget_Alert**: Notification triggered when spending exceeds budget threshold
- **Report**: Aggregated financial data for a specified time period
- **Notification**: Alert message displayed to the user (in-app or email)
- **Recurring_Transaction**: Expense or income that repeats on a schedule
- **Dashboard**: Main overview page showing financial statistics and charts
- **API_Endpoint**: Backend REST API route for data operations
- **Database_Model**: SQLAlchemy table definition for data persistence

## Requirements

---

### Requirement 1: Income Management System (HIGH PRIORITY)

**User Story:** As a user, I want to track my income from various sources, so that I can see my complete financial picture and calculate my net balance.

#### Acceptance Criteria

1. THE System SHALL provide an Income model with fields: id, user_id, amount, source, date, description, created_at
2. THE System SHALL support income sources: Salary, Business, Freelancing, Gifts, Other
3. WHEN a user creates an income record, THE System SHALL validate that amount is greater than zero
4. WHEN a user creates an income record, THE System SHALL validate that date is not in the future
5. WHEN a user creates an income record, THE System SHALL validate that source is one of the allowed values
6. THE System SHALL provide API endpoints for income CRUD operations: POST /api/income, GET /api/income, GET /api/income/{id}, PUT /api/income/{id}, DELETE /api/income/{id}
7. WHEN a user requests their income list, THE System SHALL return only income records belonging to that user
8. THE System SHALL support filtering income by source, date range, and search term
9. THE System SHALL support sorting income by date or amount in ascending or descending order
10. THE System SHALL support pagination for income lists with configurable page size
11. THE System SHALL provide a frontend Income page with add/edit/delete functionality
12. THE System SHALL display income records in a card-based layout matching the existing expense design
13. THE System SHALL calculate and display total income for the current view
14. WHEN a user deletes an income record, THE System SHALL require confirmation before deletion
15. THE System SHALL update the dashboard to include total income display

---

### Requirement 2: Balance Calculation and Display (HIGH PRIORITY)

**User Story:** As a user, I want to see my remaining balance (income minus expenses), so that I know how much money I have available.

#### Acceptance Criteria

1. THE System SHALL calculate balance as: total income minus total expenses
2. THE System SHALL provide an API endpoint GET /api/balance that returns current balance, total income, and total expenses
3. THE System SHALL calculate balance for different time periods: all-time, current month, current year
4. THE System SHALL display balance prominently on the dashboard
5. WHEN balance is positive, THE System SHALL display it in green color
6. WHEN balance is negative, THE System SHALL display it in red color
7. WHEN balance is zero, THE System SHALL display it in gray color
8. THE System SHALL update balance calculations in real-time when income or expenses change
9. THE System SHALL include balance in the dashboard statistics cards
10. THE System SHALL provide a balance trend chart showing income vs expenses over time

---

### Requirement 3: Budget Management System (HIGH PRIORITY)

**User Story:** As a user, I want to set monthly budgets for overall spending and specific categories, so that I can control my expenses and avoid overspending.

#### Acceptance Criteria

1. THE System SHALL provide a Budget model with fields: id, user_id, budget_type (overall or category), category (nullable), amount, period_start, period_end, created_at
2. WHEN a user creates a budget, THE System SHALL validate that amount is greater than zero
3. WHEN a user creates a category budget, THE System SHALL validate that category is one of the allowed expense categories
4. WHEN a user creates a budget, THE System SHALL validate that period_end is after period_start
5. THE System SHALL allow only one overall budget per time period per user
6. THE System SHALL allow only one category budget per category per time period per user
7. THE System SHALL provide API endpoints: POST /api/budgets, GET /api/budgets, GET /api/budgets/{id}, PUT /api/budgets/{id}, DELETE /api/budgets/{id}
8. THE System SHALL calculate budget utilization as: (spent amount / budget amount) × 100
9. THE System SHALL provide an API endpoint GET /api/budgets/status that returns current budget status with spent amounts and percentages
10. THE System SHALL display budget progress bars on the dashboard
11. THE System SHALL provide a dedicated Budgets page for managing all budgets
12. WHEN budget utilization exceeds 80%, THE System SHALL display a warning indicator
13. WHEN budget utilization exceeds 100%, THE System SHALL display an alert indicator
14. THE System SHALL show remaining budget amount for each active budget
15. THE System SHALL support monthly budget periods by default
16. THE System SHALL allow users to create budgets for future months
17. THE System SHALL archive expired budgets but retain them for historical reporting

---

### Requirement 4: Budget Alert System (HIGH PRIORITY)

**User Story:** As a user, I want to receive alerts when I exceed my budget limits, so that I can take corrective action immediately.

#### Acceptance Criteria

1. WHEN a user's spending reaches 80% of a budget, THE System SHALL create a warning alert
2. WHEN a user's spending reaches 100% of a budget, THE System SHALL create a critical alert
3. WHEN a user's spending exceeds 100% of a budget, THE System SHALL create an exceeded alert
4. THE System SHALL provide an API endpoint GET /api/alerts that returns active alerts for the user
5. THE System SHALL display budget alerts on the dashboard in a dedicated alerts section
6. THE System SHALL show alert severity with color coding: yellow for warning, red for critical/exceeded
7. WHEN a user dismisses an alert, THE System SHALL mark it as read but retain it for history
8. THE System SHALL check budget thresholds after each expense creation or update
9. THE System SHALL include budget name, spent amount, budget amount, and percentage in alert messages
10. THE System SHALL sort alerts by severity (critical first) and then by date

---

### Requirement 5: Savings Goals System (MEDIUM PRIORITY)

**User Story:** As a user, I want to create savings goals with target amounts and track my progress, so that I can work toward specific financial objectives.

#### Acceptance Criteria

1. THE System SHALL provide a Savings_Goal model with fields: id, user_id, name, target_amount, current_amount, deadline, status (active, completed, cancelled), created_at, completed_at
2. WHEN a user creates a savings goal, THE System SHALL validate that target_amount is greater than zero
3. WHEN a user creates a savings goal, THE System SHALL validate that deadline is in the future
4. WHEN a user creates a savings goal, THE System SHALL initialize current_amount to zero
5. WHEN a user creates a savings goal, THE System SHALL set status to active
6. THE System SHALL provide API endpoints: POST /api/savings-goals, GET /api/savings-goals, GET /api/savings-goals/{id}, PUT /api/savings-goals/{id}, DELETE /api/savings-goals/{id}
7. THE System SHALL allow users to manually update current_amount for a savings goal
8. THE System SHALL calculate progress percentage as: (current_amount / target_amount) × 100
9. WHEN current_amount reaches or exceeds target_amount, THE System SHALL automatically set status to completed
10. THE System SHALL provide a dedicated Savings Goals page displaying all goals with progress bars
11. THE System SHALL display active savings goals on the dashboard in a widget
12. THE System SHALL show days remaining until deadline for each active goal
13. WHEN a goal deadline passes without completion, THE System SHALL display an overdue indicator
14. THE System SHALL allow users to manually mark goals as completed or cancelled
15. THE System SHALL display visual progress indicators (circular or linear progress bars)
16. THE System SHALL sort goals by deadline (nearest first) on the goals page

---

### Requirement 6: Enhanced Dashboard Features (MEDIUM PRIORITY)

**User Story:** As a user, I want to see comprehensive financial information on my dashboard including income, balance, budgets, and savings, so that I have a complete overview at a glance.

#### Acceptance Criteria

1. THE System SHALL add a total income card to the dashboard statistics section
2. THE System SHALL add a balance card to the dashboard statistics section
3. THE System SHALL add a budget progress widget showing all active budgets with progress bars
4. THE System SHALL add a savings tracker widget showing active savings goals with progress
5. THE System SHALL add an income vs expense comparison chart to the dashboard
6. THE System SHALL display the income vs expense chart as a bar chart or line chart
7. THE System SHALL show monthly income and expense trends for the last 6 months
8. THE System SHALL update the dashboard API endpoint to include income, balance, budget status, and savings goals
9. THE System SHALL maintain the existing dashboard layout and design language
10. THE System SHALL ensure all new dashboard widgets are responsive on mobile devices
11. THE System SHALL display budget alerts prominently if any budgets are exceeded
12. THE System SHALL show quick action buttons for adding income and expenses on the dashboard

---

### Requirement 7: Reports and Analytics System (MEDIUM PRIORITY)

**User Story:** As a user, I want to generate detailed financial reports for different time periods and export them, so that I can analyze my spending patterns and share data with others.

#### Acceptance Criteria

1. THE System SHALL provide a Reports page with options to generate reports for: current month, last month, current year, last year, custom date range
2. THE System SHALL include in reports: total income, total expenses, balance, category breakdown, income source breakdown, top expenses, budget performance
3. THE System SHALL provide an API endpoint POST /api/reports/generate that accepts date range and returns report data
4. THE System SHALL display report data in a formatted view with charts and tables
5. THE System SHALL provide export functionality for reports in PDF format
6. THE System SHALL provide export functionality for reports in CSV format
7. THE System SHALL provide export functionality for reports in Excel format
8. WHEN a user exports to CSV, THE System SHALL include all transaction details with headers
9. WHEN a user exports to PDF, THE System SHALL include summary statistics and charts
10. WHEN a user exports to Excel, THE System SHALL create separate sheets for income, expenses, and summary
11. THE System SHALL allow users to filter report data by category, income source, or payment method
12. THE System SHALL show expense trends analysis with month-over-month comparisons
13. THE System SHALL show income trends analysis with month-over-month comparisons
14. THE System SHALL calculate and display average daily spending for the report period
15. THE System SHALL identify and highlight the highest spending category in reports

---

### Requirement 8: Notification System (LOW PRIORITY)

**User Story:** As a user, I want to receive notifications for important events like budget alerts and goal deadlines, so that I stay informed about my financial status.

#### Acceptance Criteria

1. THE System SHALL provide a Notification model with fields: id, user_id, type, title, message, is_read, created_at
2. THE System SHALL support notification types: budget_warning, budget_exceeded, goal_deadline, goal_completed
3. WHEN a budget alert is triggered, THE System SHALL create a notification record
4. WHEN a savings goal is completed, THE System SHALL create a notification record
5. WHEN a savings goal deadline is within 7 days, THE System SHALL create a notification record
6. THE System SHALL provide an API endpoint GET /api/notifications that returns user notifications
7. THE System SHALL provide an API endpoint PUT /api/notifications/{id}/read to mark notifications as read
8. THE System SHALL provide an API endpoint DELETE /api/notifications/{id} to delete notifications
9. THE System SHALL display a notification bell icon in the header with unread count badge
10. WHEN a user clicks the notification bell, THE System SHALL display a dropdown with recent notifications
11. THE System SHALL show notification type icon, title, message, and timestamp in the dropdown
12. THE System SHALL mark notifications as read when the user views them
13. THE System SHALL limit the notification dropdown to the 10 most recent notifications
14. THE System SHALL provide a link to view all notifications on a dedicated page
15. THE System SHALL support email notifications as an optional feature for future enhancement

---

### Requirement 9: Payment Method Tracking (LOW PRIORITY)

**User Story:** As a user, I want to track which payment method I used for each expense, so that I can analyze my spending by payment type and reconcile with bank statements.

#### Acceptance Criteria

1. THE System SHALL add a payment_method field to the Expense model
2. THE System SHALL support payment methods: Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet
3. WHEN a user creates an expense, THE System SHALL allow optional selection of payment method
4. WHEN a user creates an expense without specifying payment method, THE System SHALL set it to null
5. THE System SHALL validate that payment_method is one of the allowed values when provided
6. THE System SHALL add payment method filter to the expense list page
7. THE System SHALL display payment method on expense cards and detail views
8. THE System SHALL include payment method breakdown in dashboard analytics
9. THE System SHALL show payment method distribution in reports
10. THE System SHALL provide a payment method icon for each type in the UI
11. THE System SHALL allow users to update payment method when editing expenses
12. THE System SHALL include payment method in expense export files

---

### Requirement 10: Recurring Transactions (FUTURE ENHANCEMENT)

**User Story:** As a user, I want to set up recurring expenses and income that are automatically created on schedule, so that I don't have to manually enter regular transactions.

#### Acceptance Criteria

1. THE System SHALL provide a Recurring_Transaction model with fields: id, user_id, transaction_type (expense or income), title, amount, category_or_source, description, payment_method, frequency (daily, weekly, monthly, yearly), start_date, end_date, next_occurrence, is_active
2. WHEN a user creates a recurring transaction, THE System SHALL validate that amount is greater than zero
3. WHEN a user creates a recurring transaction, THE System SHALL validate that start_date is not in the past
4. WHEN a user creates a recurring transaction with end_date, THE System SHALL validate that end_date is after start_date
5. THE System SHALL calculate next_occurrence based on start_date and frequency
6. THE System SHALL provide API endpoints: POST /api/recurring, GET /api/recurring, GET /api/recurring/{id}, PUT /api/recurring/{id}, DELETE /api/recurring/{id}
7. THE System SHALL provide a background job that checks for due recurring transactions daily
8. WHEN next_occurrence date is reached, THE System SHALL create a new expense or income record
9. WHEN a recurring transaction is created, THE System SHALL update next_occurrence to the next scheduled date
10. WHEN end_date is reached, THE System SHALL set is_active to false
11. THE System SHALL provide a Recurring Transactions page for managing all recurring transactions
12. THE System SHALL allow users to manually trigger a recurring transaction before its scheduled date
13. THE System SHALL allow users to skip a single occurrence without deleting the recurring transaction
14. THE System SHALL display upcoming recurring transactions on the dashboard
15. THE System SHALL allow users to pause and resume recurring transactions

---

### Requirement 11: Profile Enhancement (LOW PRIORITY)

**User Story:** As a user, I want to add more information to my profile including full name and phone number, so that I can personalize my account.

#### Acceptance Criteria

1. THE System SHALL add a phone_number field to the User model
2. THE System SHALL add an email_verified field to the User model with default value false
3. WHEN a user updates their profile, THE System SHALL validate phone_number format if provided
4. WHEN a user updates their profile, THE System SHALL allow phone_number to be optional
5. THE System SHALL provide an API endpoint PUT /api/profile to update user profile information
6. THE System SHALL allow users to update name, phone_number on the profile page
7. THE System SHALL display current profile information on the profile page
8. THE System SHALL validate that name is between 2 and 100 characters when provided
9. THE System SHALL validate that phone_number matches international format when provided
10. THE System SHALL display profile picture from Google OAuth if available
11. THE System SHALL show email verification status on the profile page
12. THE System SHALL maintain existing password change functionality on the profile page

---

### Requirement 12: Data Validation and Security (CROSS-CUTTING)

**User Story:** As a user, I want my financial data to be secure and validated, so that I can trust the system with my sensitive information.

#### Acceptance Criteria

1. THE System SHALL validate all numeric inputs to prevent SQL injection attacks
2. THE System SHALL sanitize all text inputs to prevent XSS attacks
3. THE System SHALL enforce authentication for all financial data endpoints
4. THE System SHALL ensure users can only access their own data
5. WHEN a user attempts to access another user's data, THE System SHALL return a 403 Forbidden error
6. THE System SHALL validate all date inputs to ensure they are valid dates
7. THE System SHALL validate all amount inputs to ensure they are positive numbers with maximum 2 decimal places
8. THE System SHALL enforce maximum length constraints on all text fields
9. THE System SHALL use parameterized queries for all database operations
10. THE System SHALL hash sensitive data before storage
11. THE System SHALL implement rate limiting on API endpoints to prevent abuse
12. THE System SHALL log all authentication failures for security monitoring

---

### Requirement 13: Performance and Optimization (CROSS-CUTTING)

**User Story:** As a user, I want the application to load quickly and respond instantly, so that I have a smooth experience managing my finances.

#### Acceptance Criteria

1. THE System SHALL return dashboard data within 500ms for users with up to 10,000 transactions
2. THE System SHALL use database indexes on frequently queried fields: user_id, date, category
3. THE System SHALL implement pagination for all list endpoints to limit response size
4. THE System SHALL cache dashboard statistics for 5 minutes to reduce database load
5. THE System SHALL use lazy loading for charts and widgets on the dashboard
6. THE System SHALL optimize database queries to avoid N+1 query problems
7. THE System SHALL compress API responses using gzip
8. THE System SHALL implement frontend code splitting to reduce initial bundle size
9. THE System SHALL use React Query for efficient data fetching and caching
10. THE System SHALL debounce search inputs to reduce unnecessary API calls
11. THE System SHALL use optimistic updates for create/update/delete operations
12. THE System SHALL display loading skeletons while data is being fetched

---

### Requirement 14: Mobile Responsiveness (CROSS-CUTTING)

**User Story:** As a user, I want to use the expense tracker on my mobile device with the same functionality as desktop, so that I can manage my finances on the go.

#### Acceptance Criteria

1. THE System SHALL display all pages correctly on screen widths from 320px to 2560px
2. THE System SHALL use responsive grid layouts that adapt to screen size
3. THE System SHALL provide touch-friendly buttons with minimum 44px touch targets on mobile
4. THE System SHALL use mobile-optimized navigation with hamburger menu on small screens
5. THE System SHALL display charts in mobile-friendly formats with horizontal scrolling if needed
6. THE System SHALL use bottom sheets or full-screen modals for forms on mobile devices
7. THE System SHALL optimize font sizes for readability on small screens
8. THE System SHALL ensure all interactive elements are accessible via touch
9. THE System SHALL test layouts on iOS Safari, Chrome Mobile, and Firefox Mobile
10. THE System SHALL maintain consistent spacing and padding across all screen sizes
11. THE System SHALL hide or collapse less critical information on mobile to prioritize key data
12. THE System SHALL use responsive tables with horizontal scroll or card layouts on mobile

---

### Requirement 15: Dark Mode Consistency (CROSS-CUTTING)

**User Story:** As a user, I want all new features to support dark mode, so that I have a consistent visual experience across the entire application.

#### Acceptance Criteria

1. THE System SHALL apply dark mode styling to all new pages and components
2. THE System SHALL use the existing dark mode color tokens for consistency
3. THE System SHALL ensure text contrast ratios meet WCAG AA standards in dark mode
4. THE System SHALL test all charts and visualizations in dark mode for readability
5. THE System SHALL use appropriate colors for success, warning, and error states in dark mode
6. THE System SHALL ensure form inputs and buttons are clearly visible in dark mode
7. THE System SHALL apply dark mode to all modals, dropdowns, and overlays
8. THE System SHALL persist dark mode preference across sessions
9. THE System SHALL transition smoothly between light and dark modes
10. THE System SHALL use semantic color variables that adapt to theme changes

---

## Implementation Phases

### Phase 1: Foundation (HIGH PRIORITY - Simple)
- Income Management System (Requirement 1)
- Balance Calculation and Display (Requirement 2)
- Payment Method Tracking (Requirement 9)
- Profile Enhancement (Requirement 11)

**Rationale:** These features add new data models and basic CRUD operations without complex dependencies. They provide immediate value and establish patterns for subsequent phases.

### Phase 2: Budget Control (HIGH PRIORITY - Medium Complexity)
- Budget Management System (Requirement 3)
- Budget Alert System (Requirement 4)

**Rationale:** Budgets depend on expense data (already exists) and income data (from Phase 1). Alerts build on budget calculations.

### Phase 3: Goals and Enhanced Dashboard (MEDIUM PRIORITY - Medium Complexity)
- Savings Goals System (Requirement 5)
- Enhanced Dashboard Features (Requirement 6)

**Rationale:** Dashboard enhancements require income, balance, and budget data from previous phases. Savings goals are independent but benefit from complete financial picture.

### Phase 4: Analytics and Reporting (MEDIUM PRIORITY - Complex)
- Reports and Analytics System (Requirement 7)

**Rationale:** Reports aggregate all data types (expenses, income, budgets, goals) and require export functionality. Best implemented after core features are stable.

### Phase 5: Notifications (LOW PRIORITY - Medium Complexity)
- Notification System (Requirement 8)

**Rationale:** Notifications depend on budget alerts and savings goals. Can be implemented independently once those features are complete.

### Phase 6: Automation (FUTURE ENHANCEMENT - Complex)
- Recurring Transactions (Requirement 10)

**Rationale:** Requires background job scheduling and complex date calculations. Provides convenience but not essential for core functionality.

### Cross-Cutting (ALL PHASES)
- Data Validation and Security (Requirement 12)
- Performance and Optimization (Requirement 13)
- Mobile Responsiveness (Requirement 14)
- Dark Mode Consistency (Requirement 15)

**Rationale:** These requirements apply to all features and should be considered during implementation of each phase.

---

## Data Models Summary

### New Tables Required

1. **income**
   - id (PK), user_id (FK), amount, source, date, description, created_at

2. **budgets**
   - id (PK), user_id (FK), budget_type, category (nullable), amount, period_start, period_end, created_at

3. **savings_goals**
   - id (PK), user_id (FK), name, target_amount, current_amount, deadline, status, created_at, completed_at

4. **notifications**
   - id (PK), user_id (FK), type, title, message, is_read, created_at

5. **recurring_transactions**
   - id (PK), user_id (FK), transaction_type, title, amount, category_or_source, description, payment_method, frequency, start_date, end_date, next_occurrence, is_active

### Modified Tables

1. **expenses**
   - Add: payment_method (nullable)

2. **users**
   - Add: phone_number (nullable), email_verified (boolean, default false)

---

## API Endpoints Summary

### Income Endpoints
- POST /api/income - Create income
- GET /api/income - List income (with filters, pagination)
- GET /api/income/{id} - Get single income
- PUT /api/income/{id} - Update income
- DELETE /api/income/{id} - Delete income

### Balance Endpoints
- GET /api/balance - Get current balance with income/expense breakdown

### Budget Endpoints
- POST /api/budgets - Create budget
- GET /api/budgets - List budgets
- GET /api/budgets/{id} - Get single budget
- PUT /api/budgets/{id} - Update budget
- DELETE /api/budgets/{id} - Delete budget
- GET /api/budgets/status - Get budget status with utilization

### Savings Goal Endpoints
- POST /api/savings-goals - Create savings goal
- GET /api/savings-goals - List savings goals
- GET /api/savings-goals/{id} - Get single savings goal
- PUT /api/savings-goals/{id} - Update savings goal
- DELETE /api/savings-goals/{id} - Delete savings goal

### Report Endpoints
- POST /api/reports/generate - Generate report for date range
- GET /api/reports/export/pdf - Export report as PDF
- GET /api/reports/export/csv - Export report as CSV
- GET /api/reports/export/excel - Export report as Excel

### Notification Endpoints
- GET /api/notifications - List notifications
- PUT /api/notifications/{id}/read - Mark notification as read
- DELETE /api/notifications/{id} - Delete notification

### Recurring Transaction Endpoints
- POST /api/recurring - Create recurring transaction
- GET /api/recurring - List recurring transactions
- GET /api/recurring/{id} - Get single recurring transaction
- PUT /api/recurring/{id} - Update recurring transaction
- DELETE /api/recurring/{id} - Delete recurring transaction

### Profile Endpoints
- PUT /api/profile - Update user profile

### Enhanced Dashboard Endpoint
- GET /api/dashboard - Enhanced to include income, balance, budgets, savings goals, alerts

---

## UI/UX Requirements

### Design Consistency
- All new pages MUST follow the existing premium card-based design
- Use existing Tailwind CSS tokens and color schemes
- Maintain consistent spacing, typography, and component styles
- Use existing icon library (Lucide React)
- Follow existing animation patterns (Framer Motion)

### Navigation
- Add "Income" link to main navigation
- Add "Budgets" link to main navigation
- Add "Savings Goals" link to main navigation
- Add "Reports" link to main navigation
- Add notification bell icon to header

### Forms
- Use existing modal patterns for create/edit forms
- Implement consistent validation error display
- Use existing form field components
- Provide clear success/error feedback

### Charts and Visualizations
- Use Recharts library (already in use)
- Ensure charts are responsive and mobile-friendly
- Support dark mode for all visualizations
- Use consistent color schemes across charts

### Loading States
- Use existing skeleton loaders
- Implement optimistic updates where appropriate
- Show loading spinners for async operations

### Empty States
- Provide helpful empty state messages
- Include call-to-action buttons in empty states
- Use consistent empty state design patterns

---

## Integration Points with Existing Code

### Backend Integration
- Extend existing database session management
- Use existing authentication middleware
- Follow existing error handling patterns
- Use existing Pydantic schemas pattern
- Maintain existing CORS configuration

### Frontend Integration
- Use existing Zustand stores pattern for state management
- Use existing React Query hooks for data fetching
- Extend existing API client configuration
- Use existing routing structure
- Maintain existing dark mode implementation

### Database Integration
- Use existing SQLAlchemy Base class
- Follow existing relationship patterns
- Use existing migration approach
- Maintain existing database connection pooling

---

## Testing Requirements

### Backend Testing
- Unit tests for all new API endpoints
- Validation tests for all input schemas
- Authorization tests to ensure data isolation
- Integration tests for complex queries

### Frontend Testing
- Component tests for new UI components
- Integration tests for new pages
- E2E tests for critical user flows
- Accessibility tests for WCAG compliance

### Performance Testing
- Load testing for dashboard with large datasets
- Query performance testing for reports
- Frontend bundle size monitoring

---

## Security Considerations

### Authentication
- All new endpoints MUST require authentication
- Implement proper user data isolation
- Validate JWT tokens on all protected routes

### Input Validation
- Validate all user inputs on backend
- Sanitize text inputs to prevent XSS
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on sensitive endpoints

### Data Privacy
- Users can only access their own data
- Implement proper error messages that don't leak information
- Log security events for monitoring

---

## Deployment Considerations

### Database Migration
- Create migration scripts for new tables
- Create migration scripts for modified tables
- Ensure migrations are reversible
- Test migrations on staging before production

### Backward Compatibility
- Ensure new fields are nullable or have defaults
- Don't break existing API contracts
- Maintain existing frontend routes

### Environment Configuration
- Add new environment variables if needed
- Document all configuration changes
- Update deployment documentation

---

## Success Criteria

The implementation will be considered successful when:

1. All HIGH priority requirements are implemented and tested
2. Users can track both income and expenses
3. Users can set and monitor budgets with alerts
4. Dashboard displays comprehensive financial overview
5. All features work on mobile devices
6. Dark mode is supported across all new features
7. No existing functionality is broken
8. Performance meets specified criteria
9. Security requirements are met
10. Code follows existing patterns and conventions

---

## Future Enhancements (Beyond This Spec)

- Multi-currency support
- Bank account integration via Plaid/Yodlee
- Receipt photo upload and OCR
- Shared budgets for families
- Financial goal recommendations using AI
- Investment tracking
- Tax category tagging
- Bill payment integration
- Spending insights and recommendations
- Social features (compare with friends)

---

## Appendix: Existing System Analysis

### Already Implemented ✅
- User authentication (local + Google OAuth)
- Expense CRUD with filtering, search, sorting, pagination
- Dashboard with statistics and charts
- Category-based expense tracking
- Dark mode support
- Mobile responsive design
- Premium UI/UX with Tailwind CSS
- Error handling and validation
- Protected routes
- State management (Zustand)
- Data fetching (React Query)

### Missing Features (This Spec) 🎯
- Income tracking
- Balance calculation
- Budget management
- Savings goals
- Enhanced dashboard with income/balance
- Reports and exports
- Notifications
- Payment method tracking
- Recurring transactions
- Profile enhancements

### Technical Debt to Address
- Add database indexes for performance
- Implement API response caching
- Add comprehensive error logging
- Implement rate limiting
- Add API documentation (Swagger/OpenAPI)
- Add automated testing suite
- Implement database backup strategy

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Review
