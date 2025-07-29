import React, { useEffect, useState } from 'react';
import { FraudDetectionProvider } from './context/FraudDetectionContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CaseReviewPanel } from './components/CaseReviewPanel';
import './index.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'review':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gradient-dark p-6">
            <div className="max-w-4xl mx-auto">
              <CaseReviewPanel />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gradient-dark p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold gradient-text mb-4">Settings Panel</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Settings panel coming soon with detection rules, agent configuration, and user preferences.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-dark">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="relative">
        {renderActiveTab()}
        
        {/* Global Neural Network Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 neural-bg opacity-3"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-3/4 left-1/2 w-24 h-24 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
        </div>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize dark mode based on user preference or system setting
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <FraudDetectionProvider>
      <AppContent />
    </FraudDetectionProvider>
  );
}

export default App;
