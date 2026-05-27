/**
 * EmptyState Component - Beautiful empty state placeholder
 * Shows when lists/tables have no data with optional action button
 */
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon: Icon, title, message, action }: EmptyStateProps) => {
  return (
    <div
      className="text-center"
      style={{
        paddingTop: '64px',
        paddingBottom: '64px',
      }}
    >
      {/* Icon Container */}
      <div
        className="inline-flex items-center justify-center bg-gray-100 dark:bg-white/[0.04]"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          marginBottom: '16px',
        }}
      >
        <Icon
          size={32}
          className="text-gray-300 dark:text-white/20"
        />
      </div>

      {/* Title */}
      <h3
        className="font-medium text-gray-900 dark:text-white"
        style={{
          fontSize: '14px',
          marginTop: '8px',
        }}
      >
        {title}
      </h3>

      {/* Message */}
      <p
        className="mx-auto text-gray-500 dark:text-white/35"
        style={{
          fontSize: '13px',
          marginTop: '4px',
          maxWidth: '320px',
          lineHeight: '1.6',
        }}
      >
        {message}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
          style={{
            marginTop: '24px',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
