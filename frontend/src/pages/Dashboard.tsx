/**
 * Dashboard - Main overview page with financial statistics and charts
 * Rebuilt with 2-column layout: main content + right panel
 */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useDashboardData } from '../hooks/useExpenses';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { ApiDiagnostics } from '../components/ApiDiagnostics';
import { TOKEN_KEY } from '../utils/constants';
import StatCards from '../components/dashboard/StatCards';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import RightPanel from '../components/dashboard/RightPanel';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingSummaryCards from '../components/dashboard/SpendingSummaryCards';
import SpendingTrendsChart from '../components/dashboard/SpendingTrendsChart';
import SpendingDonutChart from '../components/dashboard/SpendingDonutChart';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading, error, refetch } = useDashboardData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle Google OAuth callback token
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      navigate('/dashboard', { replace: true });
      window.location.reload();
    }
  }, [searchParams, navigate]);

  // Extract values from dashboard data with null checks
  const currentMonthTotal = data?.current_month_total ?? 0;
  const averageExpense = data?.average_expense ?? 0;
  const highestExpense = data?.highest_expense ?? 0;
  const totalCount = data?.total_count ?? 0;
  const totalExpenses = data?.total_expenses ?? 0;
  const categories = data?.categories ?? [];
  const monthlyTrends = data?.monthly_trends ?? [];
  const recentExpenses = data?.recent_expenses ?? [];

  // Get user name
  const userName = user?.email?.split('@')[0] || 'User';

  // Get highest expense title
  const highestExpenseTitle =
    recentExpenses.find((e) => e.amount === highestExpense)?.title || 'N/A';

  // Navigation handler for expenses page
  const handleSeeMore = () => {
    navigate('/expenses');
  };

  // Loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Error state
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-1">
                Failed to load dashboard
              </h3>
              <p className="text-red-600 dark:text-red-300/80 mb-4">
                {error || 'An unexpected error occurred'}
              </p>
              <button
                onClick={refetch}
                className="px-4 py-2 rounded-lg font-medium transition-colors border border-red-300 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/10"
              >
                Retry
              </button>
              <ApiDiagnostics error={error} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1E]">
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-['Syne'] text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-600 dark:text-[#6B7280] mt-1">
            Track your money, performance, and trends — all in one place.
          </p>
        </div>

        {/* Main grid */}
        <div
          className="dashboard-grid grid gap-5"
          style={{ gridTemplateColumns: 'minmax(0, 1fr) 320px' }}
        >
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5 min-w-0">
            <StatCards
              currentMonthTotal={currentMonthTotal}
              averageExpense={averageExpense}
              highestExpense={highestExpense}
              totalCount={totalCount}
              highestExpenseTitle={highestExpenseTitle}
            />

            <CashFlowChart monthlyTrends={monthlyTrends} />

            <RecentTransactions expenses={recentExpenses} onSeeMore={handleSeeMore} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <RightPanel
              totalExpenses={totalExpenses}
              currentMonthTotal={currentMonthTotal}
              categories={categories}
              userName={userName}
            />
          </div>
        </div>

        {/* ─── BOTTOM SECTIONS ─── */}
        <div className="mt-8 border-t border-gray-200 dark:border-white/[0.06] pt-8">
          <SpendingSummaryCards
            currentMonthTotal={data?.current_month_total ?? 0}
            averageExpense={data?.average_expense ?? 0}
            totalCount={data?.total_count ?? 0}
          />

          <div
            className="trends-donut-grid grid gap-5 mb-5"
            style={{ gridTemplateColumns: '1fr 340px' }}
          >
            <SpendingTrendsChart
              categories={data?.categories ?? []}
              totalExpenses={data?.total_expenses ?? 0}
            />

            <SpendingDonutChart
              categories={data?.categories ?? []}
              totalExpenses={data?.total_expenses ?? 0}
            />
          </div>

          <CategoryBreakdown categories={data?.categories ?? []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
