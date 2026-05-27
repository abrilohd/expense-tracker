/**
 * Profile Page - User profile and account settings
 * World-class 2026 design with two-column layout
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, AlertTriangle, Crown, Calendar, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { updatePassword } from '../api/auth';
import { useDashboardData } from '../hooks/useExpenses';

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional().or(z.literal('')),
});

// Password form schema
const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const { data: dashboard } = useDashboardData();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Get user initials
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Calculate member since
  const getMemberSince = () => {
    if (!user?.created_at) return 'Recently';
    const date = new Date(user.created_at);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate months active
  const getMonthsActive = () => {
    if (!user?.created_at) return 0;
    const created = new Date(user.created_at);
    const now = new Date();
    const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    return Math.max(1, months);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle profile update
  const onSubmitProfile = async (data: ProfileFormData) => {
    toast('Profile update coming soon!', { icon: '👤' });
  };

  // Handle password update
  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await updatePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success('Password updated successfully!');
      resetPassword();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  // Handle upgrade plan
  const handleUpgradePlan = () => {
    toast('Upgrade plans coming soon!', { icon: '👑' });
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    toast.error('Account deletion is not available yet');
    setIsDeleteModalOpen(false);
    setDeleteConfirmText('');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#A78BFA' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mb-6"
      >
        <h1
          className="font-medium text-gray-900 dark:text-white"
          style={{
            fontSize: '22px',
            letterSpacing: '-0.4px',
          }}
        >
          Profile & Settings
        </h1>
        <p
          className="text-gray-500 dark:text-white/45"
          style={{
            fontSize: '13px',
            marginTop: '2px',
          }}
        >
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* LEFT COLUMN — Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <Card padding="lg">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className="flex items-center justify-center font-bold mb-4"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #5B4EE8 0%, #A78BFA 100%)',
                  fontSize: '28px',
                  letterSpacing: '-0.5px',
                }}
              >
                {getInitials()}
              </div>

              {/* Name */}
              <h2
                className="font-medium text-gray-900 dark:text-white"
                style={{
                  fontSize: '18px',
                  marginBottom: '4px',
                }}
              >
                {user.name || 'User'}
              </h2>

              {/* Email */}
              <p
                className="text-gray-500 dark:text-white/45"
                style={{
                  fontSize: '13px',
                  marginBottom: '12px',
                }}
              >
                {user.email}
              </p>

              {/* Plan Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                <Crown size={14} style={{ color: '#FBBF24' }} />
                <span
                  className="font-medium"
                  style={{
                    fontSize: '11px',
                    color: '#FBBF24',
                  }}
                >
                  Free Plan
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div
              className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-white/[0.06]"
            >
              <Calendar size={16} className="text-gray-400 dark:text-white/35" />
              <span
                className="text-gray-700 dark:text-white/70"
                style={{
                  fontSize: '12px',
                }}
              >
                Member since {getMemberSince()}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <span
                  className="text-gray-500 dark:text-white/45"
                  style={{
                    fontSize: '12px',
                  }}
                >
                  Total Expenses
                </span>
                <span
                  className="font-medium text-gray-900 dark:text-white"
                  style={{
                    fontSize: '13px',
                  }}
                >
                  {dashboard?.total_count || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="text-gray-500 dark:text-white/45"
                  style={{
                    fontSize: '12px',
                  }}
                >
                  Total Amount
                </span>
                <span
                  className="font-medium text-gray-900 dark:text-white"
                  style={{
                    fontSize: '13px',
                  }}
                >
                  {formatCurrency(dashboard?.total_expenses || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className="text-gray-500 dark:text-white/45"
                  style={{
                    fontSize: '12px',
                  }}
                >
                  Months Active
                </span>
                <span
                  className="font-medium text-gray-900 dark:text-white"
                  style={{
                    fontSize: '13px',
                  }}
                >
                  {getMonthsActive()}
                </span>
              </div>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={handleUpgradePlan}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              Upgrade Plan
            </button>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* SECTION A — Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.16 }}
          >
            <Card padding="lg">
              <h3
                className="font-medium mb-5 text-gray-900 dark:text-white"
                style={{
                  fontSize: '16px',
                }}
              >
                Personal Information
              </h3>

              <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35"
                    >
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl transition-all bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white cursor-not-allowed opacity-60"
                      style={{
                        fontSize: '14px',
                      }}
                      {...registerProfile('name')}
                    />
                  </div>
                  {profileErrors.name && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35"
                    >
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl transition-all bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white cursor-not-allowed opacity-60"
                      style={{
                        fontSize: '14px',
                      }}
                      {...registerProfile('email')}
                    />
                  </div>
                  <p
                    className="text-gray-500 dark:text-white/35"
                    style={{
                      fontSize: '11px',
                      marginTop: '6px',
                    }}
                  >
                    Email cannot be changed
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Phone Number{' '}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 400,
                      }}
                    >
                      (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '14px',
                        cursor: 'not-allowed',
                        opacity: 0.6,
                      }}
                      {...registerProfile('phone_number')}
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmittingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </Card>
          </motion.div>

          {/* SECTION B — Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.24 }}
          >
            <Card padding="lg">
              <h3
                className="font-medium mb-5 text-gray-900 dark:text-white"
                style={{
                  fontSize: '16px',
                }}
              >
                Change Password
              </h3>

              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label
                    className="block font-medium mb-2 text-gray-700 dark:text-white/70"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/35"
                    >
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white ${
                        passwordErrors.current_password
                          ? 'border border-red-500'
                          : 'border border-gray-200 dark:border-white/10'
                      }`}
                      style={{
                        fontSize: '14px',
                      }}
                      {...registerPassword('current_password')}
                    />
                  </div>
                  {passwordErrors.current_password && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {passwordErrors.current_password.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: 'rgba(134, 120, 120, 0.35)' }}
                    >
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Min 8 characters, 1 number"
                      className="w-full pl-12 pr-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: passwordErrors.new_password
                          ? '1px solid #F87171'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '14px',
                      }}
                      {...registerPassword('new_password')}
                    />
                  </div>
                  {passwordErrors.new_password && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {passwordErrors.new_password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className="block font-medium mb-2"
                    style={{
                      fontSize: '13px',
                    }}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: passwordErrors.confirm_password
                          ? '1px solid #F87171'
                          : '1px solid rgba(146, 11, 11, 0.1)',
                        fontSize: '14px',
                      }}
                      {...registerPassword('confirm_password')}
                    />
                  </div>
                  {passwordErrors.confirm_password && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#F87171',
                        marginTop: '6px',
                      }}
                    >
                      {passwordErrors.confirm_password.message}
                    </p>
                  )}
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmittingPassword ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </Card>
          </motion.div>

          {/* SECTION C — Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.32 }}
          >
            <Card padding="lg">
              <div
                className="p-5 rounded-xl"
                style={{
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle size={20} style={{ color: '#EF4444', marginTop: '2px' }} />
                  <div>
                    <h4
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#EF4444',
                        marginBottom: '4px',
                      }}
                    >
                      Danger Zone
                    </h4>
                    <p
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl font-medium transition-all"
                  style={{
                    fontSize: '13px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                >
                  Delete Account
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md pointer-events-auto bg-white dark:bg-[#1A1D28] border border-red-200 dark:border-red-500/20"
                style={{
                  borderRadius: '20px',
                  padding: '24px',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="bg-red-100 dark:bg-red-500/15"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertTriangle size={24} style={{ color: '#EF4444' }} />
                  </div>
                  <div>
                    <h3
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      Delete Account
                    </h3>
                  </div>
                </div>

                <p
                  className="text-gray-700 dark:text-white/70"
                  style={{
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                >
                  This action cannot be undone. All your data will be permanently deleted.
                </p>

                <p
                  className="text-gray-600 dark:text-white/60"
                  style={{
                    fontSize: '13px',
                    marginBottom: '12px',
                  }}
                >
                  Type <strong style={{ color: '#EF4444' }}>DELETE</strong> to confirm:
                </p>

                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full px-4 py-3 rounded-xl mb-4 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  style={{
                    fontSize: '14px',
                  }}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmText('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE'}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '14px',
                      background: deleteConfirmText === 'DELETE' ? '#EF4444' : 'rgba(239, 68, 68, 0.3)',
                      cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed',
                      opacity: deleteConfirmText === 'DELETE' ? 1 : 0.5,
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
