/**
 * Admin Dashboard - System overview and statistics
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Activity, Shield } from 'lucide-react';
import { getSystemStats } from '../../api/admin.api';
import { formatCurrency } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-8">
            <Shield className="text-purple-600" size={32} />
            Admin Dashboard
          </h1>
        </motion.div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="text-blue-600" size={24} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.users?.total || 0}</p>
            <p className="text-sm text-green-600 mt-1">+{stats?.users?.new_last_30_days || 0} this month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="text-green-600" size={24} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.users?.active || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats?.users?.inactive || 0} inactive
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-purple-600" size={24} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Transactions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {(stats?.transactions?.total_expenses || 0) + (stats?.transactions?.total_income || 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stats?.transactions?.total_expenses || 0} expenses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-orange-600" size={24} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Net Balance</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(stats?.financial?.net_balance || 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">System-wide</p>
          </motion.div>
        </div>

        {/* Financial Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.financial?.total_income_amount || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats?.financial?.total_expense_amount || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Features</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">{stats?.active?.budgets || 0}</span> Active Budgets
                </p>
                <p className="text-sm">
                  <span className="font-semibold">{stats?.active?.savings_goals || 0}</span> Active Goals
                </p>
                <p className="text-sm">
                  <span className="font-semibold">{stats?.active?.recurring_transactions || 0}</span> Recurring
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
