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
  w-full px-4 py-3 rounded-xl text-sm
  bg-white/[0.05]
  text-white
  border border-white/[0.08]
  focus:outline-none
  focus:border-purple-500/60
  focus:bg-white/[0.07]
  placeholder:text-gray-600
  transition duration-150
`.trim();

// Input className with error state
export const inputErrorClassName = `
  w-full px-4 py-3 rounded-xl text-sm
  bg-red-500/[0.05]
  text-white
  border border-red-500/40
  focus:outline-none
  focus:border-red-500/60
  placeholder:text-gray-600
  transition duration-150
`.trim();

// Input className with error state (legacy support)
export const inputClassNameWithError = (hasError: boolean) =>
  hasError ? inputErrorClassName : inputClassName;

const FormField = ({ label, error, required, children, hint }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {/* Label */}
      <label className="text-xs font-medium text-gray-400 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Input/Select/Textarea */}
      {children}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* Hint text (shown if no error) */}
      {!error && hint && (
        <p className="text-xs text-gray-600 mt-1.5">{hint}</p>
      )}
    </div>
  );
};

export default FormField;
