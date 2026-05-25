/**
 * Recurring Transactions Page - World-Class 2026 Design
 * Automate regular expenses and income with beautiful UI
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Repeat,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Loader2,
  AlertCircle,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import RecurringModal from '../components/ui/RecurringModal';
import { useRecurringStore } from '../store/recurringStore';
import type { RecurringTransaction, RecurringTransactionCreate } from '../types';

const RecurringTransactionsPage = () => {
  const {
    recurring,
    isLoading,
    totalCount,
    activeCount,
    inactiveCount,
    fetchRecurring,
    createRecurring,
    updateRecurring,
    deleteRecurring,
    toggleRecurring,
    generateNow,
  } = useRecurringStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | undefined>();
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadRecurring();
  }, [filter, typeFilter]);

  const loadRecurring = () => {
    const filters: any = {};
    
    if (filter === 'active') filters.is_active = true;
    if (filter === 'inactive') filters.is_active = false;
    if (typeFilter !== 'all') filters.transaction_type = typeFilter;
    
    fetchRecurring(filters);
  };

  const handleCreate = () => {
    setEditingRecurring(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: RecurringTransactionCreate) => {
    try {
      if (editingRecurring) {
        await updateRecurring(editingRecurring.id, data);
        toast.success('✨ Recurring transaction updated!');
      } else {
        await createRecurring(data);
        toast.success('🎯 Recurring transaction created!');
      }
      setIsModalOpen(false);
      setEditingRecurring(undefined);
    } catch (error) {
      toast.error('Failed to save recurring transaction');
    }
  };

  const handleDelete = async (recurring: RecurringTransaction) => {
    setDeletingId(recurring.id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await deleteRecurring(deletingId);
      toast.success('🗑️ Recurring transaction deleted');
      setDeletingId(null);
    } catch (error) {
      toast.error('Failed to delete recurring transaction');
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleRecurring(id);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleGenerateNow = async (recurring: RecurringTransaction) => {
    try {
      await generateNow(recurring.id);
      toast.success(`💰 Transaction generated: ${recurring.title}`);
    } catch (error) {
      toast.error('Failed to generate transaction');
    }
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

  // Get frequency label
  const getFrequencyLabel = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  // Get frequency icon
  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      case 'yearly': return '📊';
      default: return '🔄';
    }
  };

  // Get next occurrence status
  const getNextOccurrenceStatus = (nextOccurrence: string, isActive: boolean) => {
    if (!isActive) return { text: 'Paused', color: 'rgba(255, 255, 255, 0.35)', bg: 'rgba(255, 255, 255, 0.05)' };
    
    const date = new Date(nextOccurrence);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', color: '#F87171', bg: 'rgba(248, 113, 113, 0.15)' };
    }
    if (diffDays === 0) {
      return { text: 'Today', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' };
    }
    if (diffDays <= 7) {
      return { text: `${diffDays} days`, color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)' };
    }
    return { text: `${diffDays} days`, color: 'rgba(255, 255, 255, 0.45)', bg: 'rgba(255, 255, 255, 0.05)' };
  };

  // Get type color
  const getTypeColor = (type: string) => {
    return type === 'expense' ? '#F87171' : '#34D399';
  };

  return (
    <div style={{ padding: '16px', maxWidth: '100%', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex flex-col gap-3 mb-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="font-medium"
              style={{
                fontSize: '20px',
                color: '#FFFFFF',
                letterSpacing: '-0.4px',
              }}
            >
              Recurring
            </h1>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.45)',
                marginTop: '2px',
              }}
            >
              Automate transactions
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2"
            style={{
              padding: '10px 16px',
              fontSize: '13px',
            }}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {/* Total */}
        <Card padding="sm">
          <div className="text-center">
            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '4px',
              }}
            >
              Total
            </p>
            <h3
              className="font-medium"
              style={{
                fontSize: '20px',
                color: '#A78BFA',
                letterSpacing: '-0.4px',
              }}
            >
              {totalCount}
            </h3>
          </div>
        </Card>

        {/* Active */}
        <Card padding="sm">
          <div className="text-center">
            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '4px',
              }}
            >
              Active
            </p>
            <h3
              className="font-medium"
              style={{
                fontSize: '20px',
                color: '#34D399',
                letterSpacing: '-0.4px',
              }}
            >
              {activeCount}
            </h3>
          </div>
        </Card>

        {/* Paused */}
        <Card padding="sm">
          <div className="text-center">
            <p
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.35)',
                marginBottom: '4px',
              }}
            >
              Paused
            </p>
            <h3
              className="font-medium"
              style={{
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.45)',
                letterSpacing: '-0.4px',
              }}
            >
              {inactiveCount}
            </h3>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16 }}
        className="mb-5"
      >
        <Card padding="sm">
          <div className="flex flex-col gap-3">
            {/* Status Filter */}
            <div>
              <p
                style={{
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  marginBottom: '6px',
                }}
              >
                Status
              </p>
              <div className="flex gap-2">
                {['all', 'active', 'inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className="flex-1 py-2 rounded-lg font-medium transition-all"
                    style={{
                      fontSize: '12px',
                      background: filter === status ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: filter === status ? '#A78BFA' : 'rgba(255, 255, 255, 0.7)',
                      border: filter === status ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <p
                style={{
                  fontSize: '10px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  marginBottom: '6px',
                }}
              >
                Type
              </p>
              <div className="flex gap-2">
                {['all', 'expense', 'income'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type as any)}
                    className="flex-1 py-2 rounded-lg font-medium transition-all"
                    style={{
                      fontSize: '12px',
                      background: typeFilter === type ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: typeFilter === type ? '#A78BFA' : 'rgba(255, 255, 255, 0.7)',
                      border: typeFilter === type ? '1px solid rgba(167, 139, 250, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="sm">
              <div className="shimmer" style={{ width: '100%', height: '4px', borderRadius: '2px' }} />
              <div className="flex items-center gap-3 mt-3">
                <div className="shimmer" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
                <div className="flex-1">
                  <div className="shimmer" style={{ width: '60%', height: '14px', borderRadius: '6px' }} />
                  <div className="shimmer mt-2" style={{ width: '40%', height: '10px', borderRadius: '4px' }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recurring.length === 0 && (
        <Card padding="lg">
          <EmptyState
            icon={Repeat}
            title="No recurring transactions"
            message="Create recurring transactions to automate regular expenses and income"
            action={{
              label: 'Create your first recurring',
              onClick: handleCreate,
            }}
          />
        </Card>
      )}

      {/* Recurring List */}
      {!isLoading && recurring.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.24 }}
          className="space-y-4"
        >
          {recurring.map((item, index) => {
            const typeColor = getTypeColor(item.transaction_type);
            const nextStatus = getNextOccurrenceStatus(item.next_occurrence, item.is_active);
            const frequencyIcon = getFrequencyIcon(item.frequency);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Card hover padding="md" style={{ opacity: item.is_active ? 1 : 0.6 }}>
                  {/* Colored Top Accent Bar */}
                  <div
                    style={{
                      height: '4px',
                      background: typeColor,
                      borderRadius: '2px',
                      marginBottom: '16px',
                      marginLeft: '-20px',
                      marginRight: '-20px',
                      marginTop: '-20px',
                    }}
                  />

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: `${typeColor}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.transaction_type === 'expense' ? (
                            <TrendingDown size={24} style={{ color: typeColor }} />
                          ) : (
                            <TrendingUp size={24} style={{ color: typeColor }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-medium truncate"
                            style={{
                              fontSize: '16px',
                              color: '#FFFFFF',
                            }}
                          >
                            {item.title}
                          </h3>
                          <p
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.45)',
                            }}
                          >
                            {item.category_or_source} • {frequencyIcon} {getFrequencyLabel(item.frequency)}
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        {/* Amount */}
                        <div>
                          <p
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.35)',
                              marginBottom: '4px',
                            }}
                          >
                            Amount
                          </p>
                          <p
                            className="font-medium"
                            style={{
                              fontSize: '16px',
                              color: typeColor,
                            }}
                          >
                            {formatCurrency(item.amount)}
                          </p>
                        </div>

                        {/* Start Date */}
                        <div>
                          <p
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.35)',
                              marginBottom: '4px',
                            }}
                          >
                            Started
                          </p>
                          <p
                            style={{
                              fontSize: '13px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {new Date(item.start_date).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Next Occurrence */}
                        <div>
                          <p
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.35)',
                              marginBottom: '4px',
                            }}
                          >
                            Next
                          </p>
                          <div
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                            style={{
                              background: nextStatus.bg,
                            }}
                          >
                            <Clock size={12} style={{ color: nextStatus.color }} />
                            <span
                              className="font-medium"
                              style={{
                                fontSize: '11px',
                                color: nextStatus.color,
                              }}
                            >
                              {nextStatus.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.45)',
                            marginTop: '8px',
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4 opacity-0 hover-parent-show transition-opacity">
                      {/* Toggle */}
                      <button
                        onClick={() => handleToggle(item.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          background: item.is_active ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: item.is_active ? '#34D399' : 'rgba(255, 255, 255, 0.45)',
                        }}
                        title={item.is_active ? 'Pause' : 'Resume'}
                      >
                        {item.is_active ? <Pause size={16} /> : <Play size={16} />}
                      </button>

                      {/* Generate Now */}
                      {item.is_active && (
                        <button
                          onClick={() => handleGenerateNow(item)}
                          className="p-2 rounded-lg transition-colors"
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: '#60A5FA',
                          }}
                          title="Generate Now"
                        >
                          <Zap size={16} />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          background: 'rgba(167, 139, 250, 0.15)',
                          color: '#A78BFA',
                        }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          background: 'rgba(248, 113, 113, 0.15)',
                          color: '#F87171',
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Recurring Modal */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecurring(undefined);
        }}
        onSubmit={handleSubmit}
        recurring={editingRecurring}
        mode={editingRecurring ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md pointer-events-auto"
                style={{
                  background: '#1A1D28',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(248, 113, 113, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertTriangle size={24} style={{ color: '#F87171' }} />
                  </div>
                  <div>
                    <h3
                      className="font-medium"
                      style={{
                        fontSize: '18px',
                        color: '#FFFFFF',
                      }}
                    >
                      Delete Recurring?
                    </h3>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '24px',
                  }}
                >
                  Are you sure you want to delete this recurring transaction? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
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

export default RecurringTransactionsPage;
