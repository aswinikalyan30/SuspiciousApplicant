import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, FileText, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { NotificationSystem } from './NotificationSystem';
import { useFraudDetection } from '../context/FraudDetectionContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useFraudDetection();

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'review', label: 'Review Cases', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const pendingCases = state.fraudCases.filter(c => c.status === 'pending').length;

  return (
    <header className="glassmorphism border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">FraudGuard AI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Higher Education Protection</p>
            </div>
          </motion.div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const hasNotification = tab.id === 'review' && pendingCases > 0;
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {hasNotification && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-medium"
                    >
                      {pendingCases > 9 ? '9+' : pendingCases}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Notifications */}
            <NotificationSystem />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const hasNotification = tab.id === 'review' && pendingCases > 0;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {hasNotification && (
                      <span className="ml-auto w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {pendingCases > 9 ? '9+' : pendingCases}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </div>

      {/* Neural Network Animation Overlay */}
      <div className="absolute inset-0 neural-bg opacity-5 pointer-events-none"></div>
    </header>
  );
}