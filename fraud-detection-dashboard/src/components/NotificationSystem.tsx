import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { NotificationToast } from '../types';
import { useFraudDetection } from '../context/FraudDetectionContext';
import { format } from 'date-fns';

export function NotificationSystem() {
  const { state, dispatch, selectCase } = useFraudDetection();
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationToast['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5 text-danger" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-safe" />;
      case 'info': return <Info className="w-5 h-5 text-primary" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBorderColor = (type: NotificationToast['type']) => {
    switch (type) {
      case 'error': return 'border-danger/50';
      case 'warning': return 'border-warning/50';
      case 'success': return 'border-safe/50';
      case 'info': return 'border-primary/50';
      default: return 'border-gray-300';
    }
  };

  const handleNotificationClick = (notification: NotificationToast) => {
    if (!notification.read) {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
    }

    if (notification.caseId) {
      const fraudCase = state.fraudCases.find(c => c.id === notification.caseId);
      if (fraudCase) {
        selectCase(fraudCase);
      }
    }
    setIsOpen(false);
  };

  const addToast = (notification: NotificationToast) => {
    setToasts(prev => [notification, ...prev.slice(0, 4)]); // Keep max 5 toasts
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== notification.id));
    }, 5000);
  };

  // Listen for new notifications and create toasts
  React.useEffect(() => {
    const latestNotification = state.notifications[0];
    if (latestNotification && !latestNotification.read) {
      addToast(latestNotification);
    }
  }, [state.notifications]);

  return (
    <>
      {/* Bell Icon with Badge */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* Notification Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 glassmorphism rounded-xl border border-white/20 shadow-xl z-50"
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {unreadCount} unread notifications
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {state.notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {state.notifications.slice(0, 10).map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 cursor-pointer hover:bg-white/5 transition-colors duration-200 ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {state.notifications.length > 10 && (
                <div className="p-3 border-t border-white/10">
                  <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`glassmorphism rounded-lg border p-4 shadow-lg max-w-sm ${getBorderColor(toast.type)} ${
                toast.type === 'error' ? 'animate-pulse' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getIcon(toast.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {toast.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}