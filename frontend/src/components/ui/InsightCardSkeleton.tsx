/**
 * Skeleton loader for InsightCard component
 */

/**
 * Single insight card skeleton placeholder
 */
export const InsightCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-5 animate-pulse">
      {/* Row layout: icon + content */}
      <div className="flex gap-3">
        {/* Icon circle placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

        {/* Content placeholders */}
        <div className="flex-1 min-w-0">
          {/* Badge placeholder */}
          <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />

          {/* Title placeholder */}
          <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 mt-2" />

          {/* Message line 1 */}
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 mt-2" />

          {/* Message line 2 */}
          <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mt-1" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of 4 insight card skeletons
 * Matches the insights page grid layout
 */
export const InsightSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <InsightCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default InsightCardSkeleton;
