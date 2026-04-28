/**
 * RightPanel - Right sidebar with Total Balance, Virtual Card, and Budget widgets
 * Three stacked widgets showing financial overview and category breakdown
 */
import { useNavigate } from 'react-router-dom';
import { CATEGORY_COLORS, DEFAULT_COLOR } from '../../lib/categoryColors';

interface RightPanelProps {
  totalExpenses: number;
  currentMonthTotal: number;
  categories: Array<{
    category: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  userName: string;
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; border: string; text: string; bar: string }
> = {
  Health: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    bar: '#EF4444',
  },
  Transport: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    bar: '#3B82F6',
  },
  Food: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    bar: '#F59E0B',
  },
  Entertainment: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    bar: '#8B5CF6',
  },
  Housing: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    bar: '#06B6D4',
  },
  Shopping: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
    bar: '#EC4899',
  },
  Education: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    bar: '#22C55E',
  },
  Other: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    text: 'text-gray-400',
    bar: '#6B7280',
  },
};

const DEFAULT_COLOR = CATEGORY_COLORS.Other;

const RightPanel = ({
  totalExpenses,
  categories,
  userName,
}: RightPanelProps) => {
  const navigate = useNavigate();

  // Compute card number
  const cardNum =
    '5737 4277 ' +
    String((userName.charCodeAt(0) * 37) % 9999).padStart(4, '0') +
    ' ' +
    new Date().getFullYear();

  // Compute expiry date (current month + 2 years)
  const expDate =
    String(new Date().getMonth() + 1).padStart(2, '0') +
    '/' +
    String((new Date().getFullYear() + 2) % 100).padStart(2, '0');

  return (
    <div className="flex flex-col gap-4">
      {/* WIDGET 1: Total Balance */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute w-48 h-48 rounded-full -top-12 -right-12 pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />

        {/* Top row */}
        <div className="relative flex justify-between items-center">
          <span className="text-base font-semibold text-white">Total balance</span>
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
            <span className="text-sm">🇺🇸</span>
            <span className="text-xs text-white">USD</span>
            <span className="text-xs text-white/70">▾</span>
          </div>
        </div>

        {/* Available row */}
        <div className="relative flex items-center gap-2 mt-4">
          {/* Wallet icon */}
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path
              d="M1 4h14v9a1 1 0 01-1 1H2a1 1 0 01-1-1V4z"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.2"
            />
            <path
              d="M1 7h14M10 4V2"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xs text-white/70">Available to use</span>
        </div>

        {/* Balance */}
        <div className="relative mt-1.5 font-['Syne'] text-3xl font-bold text-white">
          $
          {totalExpenses.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        {/* Button row */}
        <div className="relative mt-5 grid grid-cols-2 gap-2.5">
          {/* SEND button - Navigate to Add Expense */}
          <button
            onClick={() => navigate('/expenses/add')}
            className="bg-white/90 text-purple-700 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
              <path
                d="M3 11L11 3M11 3H5M11 3v6"
                stroke="#7C3AED"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Send
          </button>

          {/* RECEIVED button - Navigate to Expenses List */}
          <button
            onClick={() => navigate('/expenses')}
            className="bg-white/90 text-purple-700 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
              <path
                d="M11 3L3 11M3 11H9M3 11V5"
                stroke="#7C3AED"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Received
          </button>
        </div>
      </div>

      {/* WIDGET 2: My Card */}
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">My card</span>
          <button
            onClick={() => navigate('/expenses/add')}
            className="text-xs text-[#7C3AED] cursor-pointer hover:text-[#9333EA] transition-colors"
          >
            + Add card
          </button>
        </div>

        {/* Virtual card */}
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, #1C1C2E 0%, #2D2D44 100%)',
          }}
        >
          {/* Top row */}
          <div className="flex justify-between items-center">
            {/* Contactless icon */}
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path
                d="M6 10a4 4 0 014-4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
              <path
                d="M4 10a6 6 0 016-6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M2 10a8 8 0 018-8"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-bold text-white tracking-widest">VISA</span>
          </div>

          {/* Card number */}
          <div className="mt-6 text-base font-semibold text-white tracking-[0.18em]">
            {cardNum}
          </div>

          {/* Bottom row */}
          <div className="mt-5 flex justify-between items-end">
            {/* LEFT: Name */}
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">
                Name
              </div>
              <div className="text-sm font-medium text-white mt-0.5">
                {userName.slice(0, 16).toUpperCase()}
              </div>
            </div>

            {/* MIDDLE: Exp. Date */}
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">
                Exp. Date
              </div>
              <div className="text-sm font-medium text-white mt-0.5">{expDate}</div>
            </div>

            {/* RIGHT: Chip */}
            <svg viewBox="0 0 30 24" className="w-[30px] h-6">
              <rect x="0" y="0" width="30" height="24" rx="4" fill="#D4A839" opacity="0.9" />
              <rect x="0" y="8" width="30" height="8" fill="#B8912E" />
              <line x1="10" y1="0" x2="10" y2="24" stroke="#B8912E" strokeWidth="1" />
              <line x1="20" y1="0" x2="20" y2="24" stroke="#B8912E" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-[#6B7280]">1/1</span>
          <div className="flex gap-2">
            <button className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center opacity-50 cursor-not-allowed">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                <path d="M8 2L4 6l4 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center opacity-50 cursor-not-allowed">
              <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                <path d="M4 2l4 4-4 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* WIDGET 3: Budget */}
      <div className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Budget</span>
          <button
            onClick={() => navigate('/expenses')}
            className="text-xs text-[#7C3AED] cursor-pointer hover:text-[#9333EA] transition-colors"
          >
            See All →
          </button>
        </div>

        {/* Category rows */}
        {categories.slice(0, 5).map((category) => {
          const colors = CATEGORY_COLORS[category.category] || DEFAULT_COLOR;

          return (
            <div
              key={category.category}
              className="py-3 border-b border-white/[0.04] last:border-0 flex items-center gap-3"
            >
              {/* Icon box */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}
              >
                <span className={`text-sm font-semibold ${colors.text}`}>
                  {category.category.charAt(0)}
                </span>
              </div>

              {/* Middle: Name, progress, percentage */}
              <div className="flex-1">
                {/* Name and amount */}
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-medium text-white">
                    {category.category}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    ${category.total.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: category.percentage + '%',
                      background: colors.bar,
                    }}
                  />
                </div>

                {/* Percentage */}
                <div className={`text-[10px] mt-1 font-semibold ${colors.text}`}>
                  {category.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RightPanel;
