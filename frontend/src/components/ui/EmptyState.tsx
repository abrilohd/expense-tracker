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
        className="inline-flex items-center justify-center"
        style={{
          width: '64px',
          height: '64px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          marginBottom: '16px',
        }}
      >
        <Icon
          size={32}
          style={{
            color: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      </div>

      {/* Title */}
      <h3
        className="font-medium"
        style={{
          fontSize: '14px',
          color: '#FFFFFF',
          marginTop: '8px',
        }}
      >
        {title}
      </h3>

      {/* Message */}
      <p
        className="mx-auto"
        style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.35)',
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
