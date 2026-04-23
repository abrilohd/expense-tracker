/**
 * Reusable form field wrapper component
 */
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

// Shared input className for consistent styling
export const inputClassName = `
  w-full px-3 py-2 rounded-lg border text-sm
  bg-white dark:bg-gray-700
  text-gray-900 dark:text-white
  border-gray-300 dark:border-gray-600
  focus:outline-none focus:ring-2 focus:ring-blue-500
  focus:border-transparent
  placeholder:text-gray-400
  transition duration-150
`.trim();

// Input className with error state
export const inputClassNameWithError = (hasError: boolean) =>
  hasError
    ? `${inputClassName} border-red-500 focus:ring-red-500`
    : inputClassName;

const FormField = ({ label, error, required, children, hint }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {/* Label */}
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input/Select/Textarea */}
      {children}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* Hint text (shown if no error) */}
      {!error && hint && (
        <p className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
};

export default FormField;
