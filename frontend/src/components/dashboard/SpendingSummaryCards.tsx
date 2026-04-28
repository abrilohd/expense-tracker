/**
 * SpendingSummaryCards - Two cards showing monthly spending and average per transaction
 */

interface SpendingSummaryCardsProps {
  currentMonthTotal: number;
  averageExpense: number;
  totalCount: number;
}

const SpendingSummaryCards = ({
  currentMonthTotal,
  averageExpense,
  totalCount,
}: SpendingSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      {/* CARD 1: This Month Spending */}
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 flex items-center gap-4">
        {/* Icon box */}
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
            <path
              d="M3 14l4-4 3 3 7-7"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-[#A0AEC0] font-medium">
            This Month Spending
          </p>
          <p className="font-['Syne'] text-3xl font-bold text-gray-900 dark:text-white mt-1">
            ${currentMonthTotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-400 dark:text-[#6B7280] mt-1">
            {totalCount} transactions
          </p>
        </div>
      </div>

      {/* CARD 2: Avg per Transaction */}
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 flex items-center gap-4">
        {/* Icon box */}
        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
            <path
              d="M5 15L15 5M15 5H7M15 5v8"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-[#A0AEC0] font-medium">
            Avg per Transaction
          </p>
          <p className="font-['Syne'] text-3xl font-bold text-gray-900 dark:text-white mt-1">
            ${averageExpense.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-400 dark:text-[#6B7280] mt-1">
            Based on {totalCount} expenses
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpendingSummaryCards;
