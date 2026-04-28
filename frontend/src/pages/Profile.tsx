/**
 * Profile & Settings Page
 * Allows users to view and update their profile information
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Calendar, Sparkles, Loader2, Shield, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { updatePassword } from '../api/expenses';

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split('.');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast.success('🎉 Password updated successfully!');
      reset();
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-['Syne'] text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile & Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-8"
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white text-3xl font-bold">{getInitials()}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-[#0D1326] flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user.email.split('@')[0]}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-sm font-medium">
                <Sparkles size={14} />
                <span>Free Plan</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
                <Shield size={14} />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/[0.06]">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <Mail className="text-purple-600 dark:text-purple-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Email Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-blue-600 dark:text-blue-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <User className="text-green-600 dark:text-green-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">User ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">#{user.id}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.04]">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                <Shield className="text-amber-600 dark:text-amber-400" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Account Status</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#0D1326] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Lock className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Settings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your password and security preferences
            </p>
          </div>
        </div>

        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
          >
            <Lock size={18} />
            <span>Change Password</span>
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.currentPassword
                    ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.newPassword
                    ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-950/20'
                    : 'border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800'
                } text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-500/20`}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  reset();
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-[#0D1326] border border-red-200 dark:border-red-900/30 rounded-2xl p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Log out of your account on this device
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
