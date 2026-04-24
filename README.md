# 💰 ExpenseAI - Smart Expense Tracker

A modern, full-stack expense tracking application with AI-powered insights, dual theme support, and responsive design.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production--ready-success)

---

## ✨ Features

### 🔐 **Authentication**
- Secure JWT-based authentication
- Password validation (min 8 chars, requires number)
- Session persistence
- Protected routes

### 📊 **Dashboard**
- Real-time spending statistics
- Interactive charts (Area & Pie)
- Category breakdown with progress bars
- Recent transactions list
- Monthly trend analysis

### 💸 **Expense Management**
- Quick add/edit/delete operations
- Advanced filtering (category, date range, amount)
- Real-time search with debouncing
- Pagination (10 items per page)
- Sort by date or amount

### 🤖 **AI Insights**
- 8 intelligent spending pattern rules
- Period selection (7, 30, 90 days)
- Spending personality analysis
- Budget warnings and tips
- Category-based insights

### 🎨 **Design**
- **Dual Theme**: Professional light mode & modern dark mode
- **Responsive**: Mobile-first design (375px - 1440px+)
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: WCAG AA compliant contrast ratios

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn app.main:app --reload
```

Backend runs on: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 📁 Project Structure

```
expense-tracker/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── core/           # Config, security, exceptions
│   │   ├── db/             # Database setup
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI application
│   ├── expenses.db         # SQLite database
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # React frontend
    ├── src/
    │   ├── api/           # API client functions
    │   ├── components/    # React components
    │   │   ├── charts/   # Chart components
    │   │   ├── layout/   # Layout components
    │   │   └── ui/       # UI components
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Page components
    │   ├── store/        # Zustand state management
    │   ├── types/        # TypeScript types
    │   ├── utils/        # Utility functions
    │   └── main.tsx      # Application entry point
    └── package.json      # Node dependencies
```

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **JWT** - Secure authentication
- **SQLite/PostgreSQL** - Database
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
GET    /api/auth/me          Get current user
```

### Expenses
```
GET    /api/expenses         List expenses (with filters)
POST   /api/expenses         Create expense
GET    /api/expenses/{id}    Get expense by ID
PUT    /api/expenses/{id}    Update expense
DELETE /api/expenses/{id}    Delete expense
```

### Analytics
```
GET    /api/dashboard        Dashboard statistics
GET    /api/insights         AI-generated insights
```

---

## 🎨 Theme Support

The application supports both light and dark themes:

### Light Mode
- Clean white backgrounds
- Dark, readable text
- Subtle gray borders
- Professional appearance

### Dark Mode
- Elegant dark backgrounds
- Light, readable text
- Subtle white borders
- Modern appearance

**Toggle**: Click the Sun/Moon icon in the header  
**Persistence**: Theme preference saved in localStorage  
**System Preference**: Respects OS theme on first visit

---

## 📱 Responsive Design

### Mobile (375px - 639px)
- Collapsible sidebar with hamburger menu
- Single-column layout
- Touch-optimized controls
- Reduced spacing

### Tablet (640px - 1023px)
- 2-column grid layouts
- Optimized spacing
- Responsive charts

### Desktop (1024px+)
- Fixed sidebar navigation
- Multi-column layouts
- Full-featured interface
- Optimal spacing

---

## 🧪 Testing

See **TESTING_CHECKLIST.md** for complete testing guide.

### Quick Test
1. Register a new account
2. Add some expenses
3. View dashboard (verify charts render)
4. Toggle light/dark mode
5. Filter expenses by category
6. View AI insights

---

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Secure token storage

---

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set up PostgreSQL database
2. Configure environment variables:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   ```
3. Deploy backend service

### Frontend (Vercel/Netlify/Cloudflare Pages)
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Configure environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
3. Deploy static files

---

## 📊 Features Breakdown

### Dashboard
- Hero card with total spending
- 4 stat cards (This Month, Avg, Highest, Count)
- Area chart for monthly trends
- Pie chart for category breakdown
- Budget overview with progress bars
- Category cards grid
- Recent transactions list

### Expense Management
- Modal-based add/edit forms
- Delete with confirmation
- Real-time search (300ms debounce)
- Category filter dropdown
- Date range picker
- Sort by date/amount
- Pagination controls

### AI Insights
- High spending detection
- Budget warnings
- Savings opportunities
- Category concentration analysis
- Spending consistency tracking
- Weekend vs weekday patterns
- Recent spending trends
- Spending personality

---

## 🎯 Key Highlights

- ✅ **Production Ready** - Error handling, validation, security
- ✅ **Type Safe** - TypeScript throughout frontend
- ✅ **Modern UI** - Fundex-inspired design
- ✅ **Responsive** - Works on all devices
- ✅ **Accessible** - WCAG AA compliant
- ✅ **Fast** - Optimized performance
- ✅ **Clean Code** - Well-organized, documented

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./expenses.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Design inspired by Fundex
- Icons from Lucide React
- Charts powered by Chart.js
- Animations by Framer Motion

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the testing checklist
- Review the project status document

---

**Built with ❤️ using modern web technologies**

🚀 **Ready for production use!**
