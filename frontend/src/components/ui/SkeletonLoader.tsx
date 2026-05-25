/**
 * SkeletonLoader Components - Loading placeholders
 * Shimmer animations for various content types
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. SKELETON LINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLine = ({ width = '100%', height = '12px', className = '' }: SkeletonLineProps) => {
  return (
    <div
      className={`shimmer rounded-full ${className}`}
      style={{
        width,
        height,
        background: 'rgba(255, 255, 255, 0.05)',
      }}
    />
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. SKELETON CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonCardProps {
  height?: string;
  className?: string;
}

export const SkeletonCard = ({ height = '200px', className = '' }: SkeletonCardProps) => {
  return (
    <div
      className={`shimmer ${className}`}
      style={{
        height,
        background: '#0F1117',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
      }}
    />
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. SKELETON STAT CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SkeletonStatCard = () => {
  return (
    <div
      style={{
        background: '#0F1117',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      {/* Icon */}
      <div
        className="shimmer"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Label */}
      <div
        className="shimmer"
        style={{
          width: '60%',
          height: '12px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          marginTop: '12px',
        }}
      />

      {/* Value */}
      <div
        className="shimmer"
        style={{
          width: '80%',
          height: '28px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          marginTop: '8px',
        }}
      />

      {/* Subtitle */}
      <div
        className="shimmer"
        style={{
          width: '40%',
          height: '10px',
          borderRadius: '5px',
          background: 'rgba(255, 255, 255, 0.05)',
          marginTop: '8px',
        }}
      />
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. SKELETON TRANSACTION ROW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SkeletonTransactionRow = () => {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '10px 12px',
        borderRadius: '10px',
      }}
    >
      {/* Icon Circle */}
      <div
        className="shimmer flex-shrink-0"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div
          className="shimmer"
          style={{
            width: '60%',
            height: '13px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        />

        {/* Subtitle */}
        <div
          className="shimmer"
          style={{
            width: '40%',
            height: '11px',
            borderRadius: '5px',
            background: 'rgba(255, 255, 255, 0.05)',
            marginTop: '6px',
          }}
        />
      </div>

      {/* Amount */}
      <div
        className="shimmer flex-shrink-0"
        style={{
          width: '80px',
          height: '13px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
        }}
      />
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. SKELETON GRID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonGridProps {
  count: number;
  cols?: number;
}

export const SkeletonGrid = ({ count, cols = 3 }: SkeletonGridProps) => {
  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. SKELETON TABLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonTableProps {
  rows?: number;
}

export const SkeletonTable = ({ rows = 5 }: SkeletonTableProps) => {
  return (
    <div
      style={{
        background: '#0F1117',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonLine width="30%" height="14px" />
        <SkeletonLine width="20%" height="14px" className="ml-auto" />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTransactionRow key={index} />
        ))}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. SKELETON CHART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface SkeletonChartProps {
  height?: string;
}

export const SkeletonChart = ({ height = '300px' }: SkeletonChartProps) => {
  return (
    <div
      style={{
        background: '#0F1117',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
        padding: '20px',
      }}
    >
      {/* Title */}
      <SkeletonLine width="40%" height="14px" className="mb-4" />

      {/* Chart Area */}
      <div
        className="shimmer"
        style={{
          height,
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
        }}
      />
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. SKELETON HERO CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SkeletonHeroCard = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #4338CA 0%, #5B4EE8 40%, #7C3AED 100%)',
        borderRadius: '20px',
        padding: '24px',
      }}
    >
      {/* Label */}
      <div
        className="shimmer"
        style={{
          width: '80px',
          height: '12px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      />

      {/* Value */}
      <div
        className="shimmer"
        style={{
          width: '180px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.2)',
          marginTop: '8px',
        }}
      />

      {/* Pills */}
      <div className="flex items-center gap-3 mt-4">
        <div
          className="shimmer"
          style={{
            width: '100px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <div
          className="shimmer"
          style={{
            width: '100px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 mt-5">
        <div
          className="shimmer"
          style={{
            width: '120px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
        <div
          className="shimmer"
          style={{
            width: '120px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>
    </div>
  );
};
