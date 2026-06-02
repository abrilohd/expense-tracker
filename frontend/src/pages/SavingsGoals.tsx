/**
 * Savings Goals Page - Track and manage savings goals
 * World-class 2026 design with progress tracking and contributions
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PiggyBank, Plus, Edit2, Trash2, TrendingUp, Calendar, Target, Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import SavingsModal from '../components/ui/SavingsModal';
import ContributionModal from '../components/ui/ContributionModal';
import DeleteConfirmModal from '../components/ui/DeleteConfirmModal';
import { getSavingsGoals, deleteSavingsGoal } from '../api/expenses.api';
import type { SavingsGoalSimplified } from '../types';

const SavingsGoalsPage = () => {
  const [goals, setGoals] = useState<SavingsGoalSimplified[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoalSimplified | undefined>(undefined);
  const [contributingGoal, setContributingGoal] = useState<SavingsGoalSimplified | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<SavingsGoalSimplified | null>(null);

  // Fetch savings goals
  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSavingsGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load savings goals');
      toast.error('Failed to load savings goals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Calculate overall stats
  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.saved_amount, 0);
  const overallPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const goalsCount = goals.length;
  const completedCount = goals.filter((g) => g.percentage >= 100).length;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate days until deadline
  const getDaysUntil = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const target = new Date(deadline);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Get deadline status
  const getDeadlineStatus = (deadline?: string) => {
    const days = getDaysUntil(deadline);
    if (days === null) return null;
    
    if (days < 0) {
      return { text: 'Overdue', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' };
    }
    if (days < 7) {
      return { text: `${days} days left`, color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' };
    }
    if (days < 30) {
      return { text: `${days} days left`, color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' };
    }
    return { text: `${days} days left`, color: 'rgba(255, 255, 255, 0.45)', bg: 'rgba(255, 255, 255, 0.05)' };
  };

  // Get goal color
  const getGoalColor = (goal: SavingsGoalSimplified) => {
    if (goal.color) return goal.color;
    // Default colors based on emoji or fallback
    const colors = ['#5B4EE8', '#34D399', '#F59E0B', '#EC4899', '#8B5CF6', '#10B981'];
    const index = goal.id % colors.length;
    return colors[index];
  };

  // Handle edit
  const handleEdit = (goal: SavingsGoalSimplified) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingGoal) return;

    try {
      await deleteSavingsGoal(deletingGoal.id);
      toast.success('Savings goal deleted');
      setDeletingGoal(null);
      fetchGoals();
    } catch (err) {
      toast.error('Failed to delete savings goal');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingGoal(undefined);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    fetchGoals();
  };

  // Handle contribution success
  const handleContributionSuccess = () => {
    fetchGoals();
    setContributingGoal(null);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div>
          <h1
            className="font-medium text-gray-900 dark:text-white"
            style={{
              fontSize: '22px',
              letterSpacing: '-0.4px',
            }}
          >
            Savings Goals
          </h1>
          <p
            className="text-gray-500 dark:text-white/45"
            style={{
              fontSize: '13px',
              marginTop: '2px',
            }}
          >
            Track your progress towards financial goals
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Total Saved Pill */}
          {!isLoading && goals.length > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
              }}
            >
              <TrendingUp size={16} style={{ color: '#34D399' }} />
              <span
                className="font-medium"
                style={{
                  fontSize: '14px',
                  color: '#34D399',
                }}
              >
                {formatCurrency(totalSaved)} saved
              </span>
            </div>
          )}

          {/* New Goal Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Goal</span>
          </button>
        </div>
      </motion.div>

      {/* Overall Progress Card */}
      {!isLoading && goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="mb-6"
        >
          <Card padding="lg">
            <CardHeader title="Overall Progress" subtitle="Combined progress across all goals" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Saved */}
              <div>
                <p
                  className="text-gray-500 dark:text-white/35"
                  style={{
                    fontSize: '11px',
                    marginBottom: '6px',
                  }}
                >
                  Total Saved
                </p>
                <h3
                  className="font-medium"
                  style={{
                    fontSize: '28px',
                    color: '#34D399',
                    letterSpacing: '-0.6px',
                  }}
                >
                  {formatCurrency(totalSaved)}
                </h3>
              </div>

              {/* Total Target */}
              <div>
                <p
                  className="text-gray-500 dark:text-white/35"
                  style={{
                    fontSize: '11px',
                    marginBottom: '6px',
                  }}
                >
                  Total Target
                </p>
                <h3
                  className="font-medium text-gray-900 dark:text-white"
                  style={{
                    fontSize: '28px',
                    letterSpacing: '-0.6px',
                  }}
                >
                  {formatCurrency(totalTarget)}
                </h3>
              </div>

              {/* Goals Count */}
              <div>
                <p
                  className="text-gray-500 dark:text-white/35"
                  style={{
                    fontSize: '11px',
                    marginBottom: '6px',
                  }}
                >
                  Goals Progress
                </p>
                <h3
                  className="font-medium"
                  style={{
                    fontSize: '28px',
                    color: '#A78BFA',
                    letterSpacing: '-0.6px',
                  }}
                >
                  {completedCount}/{goalsCount}
                </h3>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-gray-700 dark:text-white/70"
                  style={{
                    fontSize: '13px',
                  }}
                >
                  {overallPercentage.toFixed(1)}% of all goals completed
                </span>
              </div>
              <div
                className="bg-gray-200 dark:bg-white/[0.06]"
                style={{
                  height: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(overallPercentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #5B4EE8 0%, #A78BFA 100%)',
                    borderRadius: '6px',
                  }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="md">
              <div className="shimmer" style={{ width: '100%', height: '4px', borderRadius: '2px' }} />
              <div className="shimmer mt-4" style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
              <div className="shimmer mt-3" style={{ width: '70%', height: '16px', borderRadius: '6px' }} />
              <div className="shimmer mt-2" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card padding="lg">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p style={{ fontSize: '13px' }}>{error}</p>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && goals.length === 0 && (
        <Card padding="lg">
          <EmptyState
            icon={PiggyBank}
            title="No savings goals"
            message="Create goals to track your savings progress"
            action={{
              label: 'Create your first goal',
              onClick: () => setIsModalOpen(true),
            }}
          />
        </Card>
      )}

      {/* Goals Grid */}
      {!isLoading && !error && goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.16 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {goals.map((goal, index) => {
            const goalColor = getGoalColor(goal);
            const deadlineStatus = getDeadlineStatus(goal.deadline);
            const cappedPercentage = Math.min(goal.percentage, 100);

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Card hover padding="md">
                  {/* Colored Top Accent Bar */}
                  <div
                    style={{
                      height: '4px',
                      background: goalColor,
                      borderRadius: '2px',
                      marginBottom: '16px',
                      marginLeft: '-20px',
                      marginRight: '-20px',
                      marginTop: '-20px',
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        style={{
                          fontSize: '32px',
                          lineHeight: 1,
                        }}
                      >
                        {goal.emoji || '�'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-medium truncate text-gray-900 dark:text-white"
                          style={{
                            fontSize: '14px',
                          }}
                        >
                          {goal.name}
                        </h3>
                        <p
                          className="text-gray-500 dark:text-white/35"
                          style={{
                            fontSize: '11px',
                          }}
                        >
                          Goal #{goal.id}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 hover-parent-show transition-opacity">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Edit goal"
                      >
                        <Edit2 size={14} className="text-gray-500 dark:text-white/50" />
                      </button>
                      <button
                        onClick={() => setDeletingGoal(goal)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label="Delete goal"
                      >
                        <Trash2 size={14} style={{ color: '#F87171' }} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div
                      className="bg-gray-200 dark:bg-white/[0.06]"
                      style={{
                        height: '8px',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cappedPercentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: goalColor,
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-3">
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '18px',
                        color: goalColor,
                      }}
                    >
                      {formatCurrency(goal.saved_amount)}{' '}
                      <span
                        className="text-gray-400 dark:text-white/30"
                        style={{
                          fontSize: '13px',
                          fontWeight: 400,
                        }}
                      >
                        of {formatCurrency(goal.target_amount)}
                      </span>
                    </p>
                    <p
                      className="text-gray-600 dark:text-white/45"
                      style={{
                        fontSize: '13px',
                        marginTop: '2px',
                      }}
                    >
                      {goal.percentage.toFixed(1)}% complete
                    </p>
                  </div>

                  {/* Deadline */}
                  {deadlineStatus && (
                    <div className="mb-4">
                      <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        style={{
                          background: deadlineStatus.bg,
                        }}
                      >
                        <Calendar size={12} style={{ color: deadlineStatus.color }} />
                        <span
                          className="font-medium"
                          style={{
                            fontSize: '11px',
                            color: deadlineStatus.color,
                          }}
                        >
                          {deadlineStatus.text}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Add Funds Button */}
                  <button
                    onClick={() => setContributingGoal(goal)}
                    className="w-full py-2.5 rounded-lg font-medium transition-all"
                    style={{
                      fontSize: '13px',
                      background: `${goalColor}20`,
                      color: goalColor,
                      border: `1px solid ${goalColor}40`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${goalColor}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${goalColor}20`;
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus size={14} />
                      Add Funds
                    </div>
                  </button>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Savings Goal Modal */}
      <SavingsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        goal={editingGoal}
        onSuccess={handleModalSuccess}
      />

      {/* Contribution Modal */}
      {contributingGoal && (
        <ContributionModal
          isOpen={!!contributingGoal}
          onClose={() => setContributingGoal(null)}
          goal={contributingGoal}
          onSuccess={handleContributionSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingGoal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingGoal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md pointer-events-auto bg-white dark:bg-[#1A1D28] border border-gray-200 dark:border-white/10"
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
                    <AlertTriangle size={24} style={{ color: '#F87171' }} />
                  </div>
                  <div>
                    <h3
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      Delete Savings Goal?
                    </h3>
                  </div>
                </div>
                <p
                  className="text-gray-700 dark:text-white/70"
                  style={{
                    fontSize: '14px',
                    marginBottom: '24px',
                  }}
                >
                  Are you sure you want to delete "{deletingGoal.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingGoal(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '14px',
                      background: '#F87171',
                      color: '#FFFFFF',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* CSS for hover parent */}
      <style>{`
        .hover-parent-show {
          opacity: 0;
          transition: opacity 0.2s;
        }
        *:hover > .hover-parent-show,
        *:hover .hover-parent-show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SavingsGoalsPage;
