/**
 * RecentTransactions - Table showing recent expense transactions
 * Displays last 5-8 transactions with category icons and details
 */

interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface RecentTransactionsProps {
  expenses: Expense[];
  onSeeMore: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Health: { bg: 'bg-red-500/10', text: 'text-red-400' },
  Transport: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  Food: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  Entertainment: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  Housing: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  Shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  Education: { bg: 'bg-green-500/10', text: 'text-green-400' },
  Other: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-500/10', text: 'text-gray-400' };

const RecentTransactions = ({ expenses, onSeeMore }: RecentTransactionsProps) => {
  const displayExpenses = expenses.slice(0, 8);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-base font-semibold text-white">Recent Transactions</span>
        <button
          onClick={onSeeMore}
          className="text-xs text-[#7C3AED] cursor-pointer hover:text-[#9333EA] transition-colors"
        >
          See More ↗
        </button>
      </div>

      {/* Table */}
      <div className="w-full">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-white/[0.06]">
          <div className="text-[11px] text-[#6B7280] uppercase tracking-wider">
            Description
          </div>
          <div className="text-[11px] text-[#6B7280] uppercase tracking-wider">
            Transaction ID
          </div>
          <div className="text-[11px] text-[#6B7280] uppercase tracking-wider text-right">
            Amount
          </div>
          <div className="text-[11px] text-[#6B7280] uppercase tracking-wider text-right">
            Order Date
          </div>
        </div>

        {/* Table rows */}
        {displayExpenses.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#6B7280]">
            No transactions yet
          </div>
        ) : (
          displayExpenses.map((expense, index) => {
            const colors = CATEGORY_COLORS[expense.category] || DEFAULT_COLOR;

            return (
              <div
                key={expense.id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                {/* Description cell */}
                <div className="flex items-center gap-3">
                  {/* Category icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}
                  >
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {expense.category.charAt(0)}
                    </span>
                  </div>
                  {/* Transaction details */}
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {expense.title}
                    </div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">
                      {expense.category}
                    </div>
                  </div>
                </div>

                {/* Transaction ID cell */}
                <div className="flex items-center">
                  <span className="text-xs text-[#6B7280] font-mono">
                    #{String(expense.id).padStart(4, '0')}
                  </span>
                </div>

                {/* Amount cell */}
                <div className="flex items-center justify-end">
                  <span className="text-sm font-semibold text-[#EF4444]">
                    -${expense.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Order Date cell */}
                <div className="flex items-center justify-end">
                  <span className="text-xs text-[#6B7280]">
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
