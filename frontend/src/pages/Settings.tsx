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
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className="relative transition-all"
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        background: checked ? '#5B4EE8' : 'rgba(255, 255, 255, 0.1)',
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
  const { isDarkMode, toggleDarkMode } = useDarkMode();
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
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mb-6"
      >
        <h1
          className="font-medium"
          style={{
            fontSize: '22px',
            color: '#FFFFFF',
            letterSpacing: '-0.4px',
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.45)',
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
              className="font-medium mb-5"
              style={{
                fontSize: '16px',
                color: '#FFFFFF',
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
                    {isDarkMode ? (
                      <Moon size={20} style={{ color: '#A78BFA' }} />
                    ) : (
                      <Sun size={20} style={{ color: '#A78BFA' }} />
                    )}
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Dark Mode
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.45)',
                      }}
                    >
                      Toggle dark theme
                    </p>
                  </div>
                </div>
                <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
              </div>

              {/* Currency Selector */}
              <div
                className="pt-4"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(52, 211, 153, 0.15)',
                    }}
                  >
                    <DollarSign size={20} style={{ color: '#34D399' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Currency
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.45)',
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
                      className="flex-1 py-2.5 rounded-lg font-medium transition-all"
                      style={{
                        fontSize: '13px',
                        background:
                          settings.currency === currency
                            ? 'rgba(52, 211, 153, 0.15)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color:
                          settings.currency === currency
                            ? '#34D399'
                            : 'rgba(255, 255, 255, 0.5)',
                        border:
                          settings.currency === currency
                            ? '1px solid rgba(52, 211, 153, 0.2)'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div
                className="pt-4"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(251, 191, 36, 0.15)',
                      }}
                    >
                      <Globe size={20} style={{ color: '#FBBF24' }} />
                    </div>
                    <div>
                      <p
                        className="font-medium"
                        style={{
                          fontSize: '14px',
                          color: '#FFFFFF',
                        }}
                      >
                        Language
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.45)',
                        }}
                      >
                        English only (more coming soon)
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      fontSize: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.5)',
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
              className="font-medium mb-5"
              style={{
                fontSize: '16px',
                color: '#FFFFFF',
              }}
            >
              Notifications
            </h3>

            <div className="space-y-4">
              {/* Budget Exceeded Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(248, 113, 113, 0.15)',
                    }}
                  >
                    <Bell size={20} style={{ color: '#F87171' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Budget Exceeded Alerts
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.45)',
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
                className="flex items-center justify-between pt-4"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
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
                    <Bell size={20} style={{ color: '#A78BFA' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Weekly Summary Email
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.45)',
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
                className="flex items-center justify-between pt-4"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(52, 211, 153, 0.15)',
                    }}
                  >
                    <Bell size={20} style={{ color: '#34D399' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Monthly Report
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.45)',
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
                className="flex items-center justify-between pt-4"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(251, 191, 36, 0.15)',
                    }}
                  >
                    <Bell size={20} style={{ color: '#FBBF24' }} />
                  </div>
                  <div>
                    <p
                      className="font-medium"
                      style={{
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Savings Goal Reminders
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.45)',
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
              className="font-medium mb-5"
              style={{
                fontSize: '16px',
                color: '#FFFFFF',
              }}
            >
              Data & Privacy
            </h3>

            <div className="space-y-3">
              {/* Export All Data */}
              <button
                onClick={exportAllData}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                style={{
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(52, 211, 153, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(52, 211, 153, 0.08)';
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(52, 211, 153, 0.15)',
                  }}
                >
                  <Download size={20} style={{ color: '#34D399' }} />
                </div>
                <div>
                  <p
                    className="font-medium"
                    style={{
                      fontSize: '14px',
                      color: '#FFFFFF',
                    }}
                  >
                    Export All Data
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.45)',
                    }}
                  >
                    Download all your expenses as CSV
                  </p>
                </div>
              </button>

              {/* Clear All Expenses */}
              <button
                onClick={() => setIsClearModalOpen(true)}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                style={{
                  background: 'rgba(248, 113, 113, 0.08)',
                  border: '1px solid rgba(248, 113, 113, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(248, 113, 113, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)';
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(248, 113, 113, 0.15)',
                  }}
                >
                  <Trash2 size={20} style={{ color: '#F87171' }} />
                </div>
                <div>
                  <p
                    className="font-medium"
                    style={{
                      fontSize: '14px',
                      color: '#FFFFFF',
                    }}
                  >
                    Clear All Expenses
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.45)',
                    }}
                  >
                    Permanently delete all expense records
                  </p>
                </div>
              </button>

              {/* Privacy Policy */}
              <button
                onClick={() => toast('Privacy policy coming soon!', { icon: '📄' })}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                style={{
                  background: 'rgba(91, 78, 232, 0.08)',
                  border: '1px solid rgba(91, 78, 232, 0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(91, 78, 232, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(91, 78, 232, 0.08)';
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(91, 78, 232, 0.15)',
                  }}
                >
                  <FileText size={20} style={{ color: '#A78BFA' }} />
                </div>
                <div>
                  <p
                    className="font-medium"
                    style={{
                      fontSize: '14px',
                      color: '#FFFFFF',
                    }}
                  >
                    Privacy Policy
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.45)',
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
                className="w-full max-w-md pointer-events-auto"
                style={{
                  background: '#1A1D28',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(248, 113, 113, 0.2)',
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
                      Clear All Expenses
                    </h3>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '16px',
                  }}
                >
                  This will permanently delete all your expense records. This action cannot be undone.
                </p>

                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                  }}
                >
                  Type <strong style={{ color: '#F87171' }}>CLEAR</strong> to confirm:
                </p>

                <input
                  type="text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="Type CLEAR"
                  className="w-full px-4 py-3 rounded-xl mb-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                  }}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsClearModalOpen(false);
                      setClearConfirmText('');
                    }}
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
                    onClick={handleClearExpenses}
                    disabled={clearConfirmText !== 'CLEAR'}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium transition-all"
                    style={{
                      fontSize: '14px',
                      background: clearConfirmText === 'CLEAR' ? '#F87171' : 'rgba(248, 113, 113, 0.3)',
                      color: '#FFFFFF',
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
