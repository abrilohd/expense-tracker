/**
 * Settings Page - App preferences and configuration
 * World-class 2026 design with toggle switches
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, DollarSign, Globe, Bell, Download, Trash2, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';
import { useExpenseList } from '../hooks/useExpenses';

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ checked, onChange, disabled = false }: ToggleSwitchProps) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="relative transition-all"
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        background: checked 
          ? '#5B4EE8' 
          : isDarkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <motion.div
        animate={{
          x: checked ? 20 : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        style={{
          position: 'absolute',
          top: '2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#FFFFFF',
        }}
      />
    </button>
  );
};

// Settings stored in localStorage
const SETTINGS_KEY = 'expense_tracker_settings';

interface AppSettings {
  currency: 'USD' | 'EUR' | 'GBP';
  language: 'en';
  notifications: {
    budgetExceeded: boolean;
    weeklySummary: boolean;
    monthlyReport: boolean;
    savingsReminders: boolean;
  };
}

const defaultSettings: AppSettings = {
  currency: 'USD',
  language: 'en',
  notifications: {
    budgetExceeded: true,
    weeklySummary: false,
    monthlyReport: true,
    savingsReminders: true,
  },
};

const Settings = () => {
  const { isDark, toggle } = useDarkMode();
  const { expenses } = useExpenseList();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  // Update currency
  const updateCurrency = (currency: 'USD' | 'EUR' | 'GBP') => {
    saveSettings({ ...settings, currency });
    toast.success(`Currency changed to ${currency}`);
  };

  // Update notification setting
  const updateNotification = (key: keyof AppSettings['notifications'], value: boolean) => {
    saveSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
    toast.success(value ? 'Notification enabled' : 'Notification disabled');
  };

  // Export all data to CSV
  const exportAllData = () => {
    if (!expenses || expenses.length === 0) {
      toast.error('No data to export');
      return;
    }

    // CSV headers
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Description'];
    
    // CSV rows
    const rows = expenses.map((expense) => [
      expense.date,
      expense.title,
      expense.category,
      expense.amount.toString(),
      expense.description || '',
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success('All data exported successfully!');
  };

  // Clear all expenses
  const handleClearExpenses = () => {
    if (clearConfirmText !== 'CLEAR') {
      toast.error('Please type CLEAR to confirm');
      return;
    }
    toast.error('Clear expenses feature not available yet');
    setIsClearModalOpen(false);
    setClearConfirmText('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
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
          Settings
        </h1>
        <p
          className="text-gray-500 dark:text-white/45"
          style={{
            fontSize: '13px',
            marginTop: '2px',
          }}
        >
          Customize your experience
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* SECTION 1 — Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          <Card padding="lg">
            <h3
              className="font-medium mb-5 text-gray-900 dark:text-white"
              style={{
                fontSize: '16px',
              }}
            >
              Appearance
            </h3>

            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(91, 78, 232, 0.15)',
                    }}
                  >
                    {isDark ? (
                      <Moon size={20} style={{ color: '#A78BFA' }} />
                    ) : (
                      <Sun size={20} style={{ color: '#A78BFA' }} />
                    )}
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      Dark Mode
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Toggle dark theme
                    </p>
                  </div>
                </div>
                <ToggleSwitch checked={isDark} onChange={toggle} />
              </div>

              {/* Currency Selector */}
              <div
                className="pt-4 border-t border-gray-200 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center bg-green-100 dark:bg-green-500/15"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                    }}
                  >
                    <DollarSign size={20} style={{ color: '#34D399' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      Currency
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Display currency preference
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(['USD', 'EUR', 'GBP'] as const).map((currency) => (
                    <button
                      key={currency}
                      onClick={() => updateCurrency(currency)}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                        settings.currency === currency
                          ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20'
                          : 'bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/50 border border-gray-200 dark:border-white/10'
                      }`}
                      style={{
                        fontSize: '13px',
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div
                className="pt-4 border-t border-gray-200 dark:border-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center bg-yellow-100 dark:bg-yellow-500/15"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                      }}
                    >
                      <Globe size={20} style={{ color: '#FBBF24' }} />
                    </div>
                    <div>
                      <p
                        className="font-medium text-gray-900 dark:text-white"
                        style={{
                          fontSize: '14px',
                        }}
                      >
                        Language
                      </p>
                      <p
                        className="text-gray-500 dark:text-white/45"
                        style={{
                          fontSize: '12px',
                        }}
                      >
                        English only (more coming soon)
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-lg font-medium bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/50"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    English
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* SECTION 2 — Notifications */}
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
              Notifications
            </h3>

            <div className="space-y-4">
              {/* Budget Exceeded Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center bg-red-100 dark:bg-red-500/15"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                    }}
                  >
                    <Bell size={20} style={{ color: '#F87171' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      Budget Exceeded Alerts
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Get notified when you exceed budget limits
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.notifications.budgetExceeded}
                  onChange={(value) => updateNotification('budgetExceeded', value)}
                />
              </div>

              {/* Weekly Summary Email */}
              <div
                className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center bg-purple-100 dark:bg-purple-500/15"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                    }}
                  >
                    <Bell size={20} style={{ color: '#A78BFA' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      Weekly Summary Email
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Receive weekly spending summaries
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.notifications.weeklySummary}
                  onChange={(value) => updateNotification('weeklySummary', value)}
                />
              </div>

              {/* Monthly Report */}
              <div
                className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center bg-green-100 dark:bg-green-500/15"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                    }}
                  >
                    <Bell size={20} style={{ color: '#34D399' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      Monthly Report
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Get detailed monthly financial reports
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.notifications.monthlyReport}
                  onChange={(value) => updateNotification('monthlyReport', value)}
                />
              </div>

              {/* Savings Goal Reminders */}
              <div
                className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center bg-yellow-100 dark:bg-yellow-500/15"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                    }}
                  >
                    <Bell size={20} style={{ color: '#FBBF24' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      Savings Goal Reminders
                    </p>
                    <p
                      className="text-gray-500 dark:text-white/45"
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      Reminders for upcoming savings deadlines
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings.notifications.savingsReminders}
                  onChange={(value) => updateNotification('savingsReminders', value)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* SECTION 3 — Data & Privacy */}
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
              Data & Privacy
            </h3>

            <div className="space-y-3">
              {/* Export All Data */}
              <button
                onClick={exportAllData}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 hover:bg-green-100 dark:hover:bg-green-500/15"
              >
                <div
                  className="flex items-center justify-center bg-green-100 dark:bg-green-500/20"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  <Download size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium text-gray-900 dark:text-white"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Export All Data
                  </p>
                  <p
                    className="text-gray-600 dark:text-white/60"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Download all your expenses as CSV
                  </p>
                </div>
              </button>

              {/* Clear All Expenses */}
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/15"
              >
                <div
                  className="flex items-center justify-center bg-red-100 dark:bg-red-500/20"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  <Trash2 size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium text-gray-900 dark:text-white"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Clear All Expenses
                  </p>
                  <p
                    className="text-gray-600 dark:text-white/60"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Permanently delete all expense records
                  </p>
                </div>
              </button>

              {/* Privacy Policy */}
              <button
                onClick={() => toast('Privacy policy coming soon!', { icon: '📄' })}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/15"
              >
                <div
                  className="flex items-center justify-center bg-purple-100 dark:bg-purple-500/20"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  <FileText size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p
                    className="font-medium text-gray-900 dark:text-white"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Privacy Policy
                  </p>
                  <p
                    className="text-gray-600 dark:text-white/60"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    View our privacy policy and terms
                  </p>
                </div>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Clear Expenses Confirmation Modal */}
      <AnimatePresence>
        {isClearModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsClearModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md pointer-events-auto bg-white dark:bg-[#1A1D28] border border-red-200 dark:border-red-500/30 shadow-2xl"
                style={{
                  borderRadius: '20px',
                  padding: '24px',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="bg-red-100 dark:bg-red-500/20"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3
                      className="font-medium text-gray-900 dark:text-white"
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      Clear All Expenses
                    </h3>
                  </div>
                </div>

                <p
                  className="text-gray-700 dark:text-white/80"
                  style={{
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                >
                  This will permanently delete all your expense records. This action cannot be undone.
                </p>

                <p
                  className="text-gray-600 dark:text-white/70"
                  style={{
                    fontSize: '13px',
                    marginBottom: '12px',
                  }}
                >
                  Type <strong className="text-red-600 dark:text-red-400">CLEAR</strong> to confirm:
                </p>

                <input
                  type="text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="Type CLEAR"
                  className="w-full px-4 py-3 rounded-xl mb-4 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  style={{
                    fontSize: '14px',
                  }}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsClearModalOpen(false);
                      setClearConfirmText('');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearExpenses}
                    disabled={clearConfirmText !== 'CLEAR'}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all text-white"
                    style={{
                      fontSize: '14px',
                      background: clearConfirmText === 'CLEAR' ? '#EF4444' : 'rgba(239, 68, 68, 0.3)',
                      cursor: clearConfirmText === 'CLEAR' ? 'pointer' : 'not-allowed',
                      opacity: clearConfirmText === 'CLEAR' ? 1 : 0.5,
                    }}
                  >
                    Clear All
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

export default Settings;
