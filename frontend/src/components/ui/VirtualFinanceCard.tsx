/**
 * Virtual Finance Card - Mastercard-style payment card with stats
 * Premium component showing monthly spending as a virtual card
 */
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Wifi } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { CategorySummary } from '../../types';

interface VirtualFinanceCardProps {
  currentMonthTotal: number;
  currentMonthCount: number;
  categories: CategorySummary[];
  cardholderName: string;
}

const VirtualFinanceCard = ({
  currentMonthTotal,
  currentMonthCount,
  categories,
  cardholderName,
}: VirtualFinanceCardProps) => {
  // Calculate average per day (days elapsed this month)
  const daysElapsed = new Date().getDate();
  const avgPerDay = daysElapsed > 0 ? currentMonthTotal / daysElapsed : 0;

  // Get top category
  const topCategory = categories.length > 0 ? categories[0].category : 'None';

  // Format card number (last 4 digits = MMYY)
  const cardNumber = format(new Date(), 'MMyy');

  // Format expiry date
  const expiryDate = format(new Date(), 'MM/yy');

  return (
    <>
      <style>{`
        @media (max-width: 1024px) and (min-width: 768px) {
          .virtual-card-wrapper {
            transform: scale(0.85);
            transform-origin: left center;
          }
        }
        @media (max-width: 767px) {
          .virtual-card-wrapper {
            transform: scale(0.75);
            transform-origin: center center;
          }
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 overflow-hidden">
        {/* Left: Virtual Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="virtual-card-wrapper relative overflow-hidden rounded-[20px] p-6 mx-auto w-full"
          style={{
            maxWidth: '380px',
            height: '220px',
            background: 'linear-gradient(135deg, #1a0533 0%, #3b0d6e 40%, #6d28d9 100%)',
            boxShadow: '0 10px 40px rgba(109, 40, 217, 0.3)',
          }}
        >
        {/* Decorative circles */}
        <div
          className="absolute rounded-full"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            top: '-60px',
            right: '-40px',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.03)',
            bottom: '-40px',
            left: '-30px',
          }}
        />

        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top row: Logo + Contactless */}
          <div className="flex items-center justify-between">
            <div className="text-white text-sm font-semibold">ExpenseTracker</div>
            <Wifi size={20} className="text-white rotate-90" />
          </div>

          {/* Middle: Card number */}
          <div>
            <div className="text-white text-lg font-mono tracking-wider mb-1">
              •••• •••• •••• {cardNumber}
            </div>
            <div className="text-purple-200 text-xs">Monthly Spending Card</div>
          </div>

          {/* Bottom row: Valid thru + Name + Mastercard logo */}
          <div className="flex items-end justify-between">
            {/* Valid thru */}
            <div>
              <div className="text-[8px] uppercase font-medium mb-0.5" style={{ color: '#A0AEC0' }}>
                VALID THRU
              </div>
              <div className="text-white text-xs font-medium">{expiryDate}</div>
            </div>

            {/* Cardholder name */}
            <div className="text-white text-xs font-medium uppercase tracking-wide">
              {cardholderName}
            </div>

            {/* Mastercard logo */}
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="12" r="10" fill="#EB001B" />
              <circle cx="25" cy="12" r="10" fill="#F79E1B" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Right: Card Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="flex flex-col justify-center space-y-6"
      >
        {/* Stat 1: Spent this month */}
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
            Spent this month
          </div>
          <div className="text-white text-base font-semibold">{formatCurrency(currentMonthTotal)}</div>
        </div>

        {/* Stat 2: Avg per day */}
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
            Avg per day
          </div>
          <div className="text-white text-base font-semibold">{formatCurrency(avgPerDay)}</div>
        </div>

        {/* Stat 3: Top category */}
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
            Top category
          </div>
          <div className="text-white text-base font-semibold">{topCategory}</div>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default VirtualFinanceCard;
