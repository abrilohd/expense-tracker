/**
 * StatCards - Monthly Expense and Income cards
 * Two-column layout showing expense and income (placeholder) statistics
 */
import { useNavigate } from 'react-router-dom';

interface StatCardsProps {
  currentMonthTotal: number;
  averageExpense: number;
  highestExpense: number;
  totalCount: number;
  highestExpenseTitle: string;
}

const StatCards = ({
  currentMonthTotal,
}: StatCardsProps) => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* CARD 1: Monthly Expense */}
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
        {/* Top row */}
        <div className="flex items-center gap-3">
          {/* Icon box */}
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            {/* Downward-right arrow SVG */}
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5">
              <path
                d="M5 5h8v8M13 5L5 13"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Label */}
          <span className="text-sm text-gray-600 dark:text-[#A0AEC0] font-medium">Monthly Expense</span>
        </div>

        {/* Amount */}
        <div className="mt-3 font-['Syne'] text-4xl font-bold text-gray-900 dark:text-white">
          ${currentMonthTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        {/* Trend row */}
        <div className="mt-2 flex items-center gap-2">
          {/* Badge */}
          {currentMonthTotal > 0 ? (
            <span className="bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full">
              ▼ First month
            </span>
          ) : (
            <span className="bg-gray-500/10 text-gray-500 dark:text-gray-400 text-xs font-semibold px-2 py-0.5 rounded-full">
              No data
            </span>
          )}
          {/* Text */}
          <span className="text-xs text-gray-500 dark:text-[#6B7280]">Since last month</span>
        </div>
      </div>

      {/* CARD 2: Monthly Income (placeholder) */}
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6">
        {/* Top row */}
        <div className="flex items-center gap-3">
          {/* Icon box */}
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            {/* Upward-right arrow SVG */}
            <svg viewBox="0 0 18 18" fill="none" className="w-5 h-5">
              <path
                d="M5 13h8V5M13 13L5 5"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Label */}
          <span className="text-sm text-gray-600 dark:text-[#A0AEC0] font-medium">Monthly Income</span>
        </div>

        {/* Amount */}
        <div className="mt-3 font-['Syne'] text-4xl font-bold text-gray-900 dark:text-white">
          $0.00
        </div>

        {/* Trend row */}
        <div className="mt-2 flex items-center gap-2">
          {/* Badge */}
          <span className="bg-gray-500/10 text-gray-500 dark:text-gray-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            Coming soon
          </span>
        </div>

        {/* Link */}
        <div className="mt-3">
          <button
            onClick={() => navigate('/expenses/add')}
            className="text-xs text-[#7C3AED] dark:text-[#7C3AED] cursor-pointer hover:text-[#6D28D9] dark:hover:text-[#9333EA] transition-colors"
          >
            Set up income →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
