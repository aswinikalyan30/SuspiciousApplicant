import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from './KPICard';
import { FraudRiskChart } from './FraudRiskChart';
import { RecentAlertsTable } from './RecentAlertsTable';
import { useFraudDetection } from '../context/FraudDetectionContext';

export function Dashboard() {
  const { state, selectCase, dispatch } = useFraudDetection();
  const [activeKPI, setActiveKPI] = useState<string | null>(null);

  const handleKPIClick = (type: string) => {
    setActiveKPI(activeKPI === type ? null : type);
    
    // Filter cases based on KPI type
    switch (type) {
      case 'financial':
        dispatch({ type: 'SET_FILTER_STATUS', payload: 'pending' });
        dispatch({ type: 'SET_SEARCH_QUERY', payload: 'financial_aid' });
        break;
      case 'ghost':
        dispatch({ type: 'SET_SEARCH_QUERY', payload: 'no_lms_activity' });
        break;
      case 'escalated':
        dispatch({ type: 'SET_FILTER_STATUS', payload: 'escalated' });
        break;
      default:
        dispatch({ type: 'SET_FILTER_STATUS', payload: 'all' });
        dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
    }
  };

  const filteredCases = state.fraudCases.filter(fraudCase => {
    const matchesStatus = state.filterStatus === 'all' || fraudCase.status === state.filterStatus;
    const matchesSearch = state.searchQuery === '' || 
      fraudCase.student.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      fraudCase.student.id.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      fraudCase.stage.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      fraudCase.flags.some(flag => flag.type.toLowerCase().includes(state.searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading fraud detection data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold gradient-text">
            AI Fraud Detection Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Multi-Agent Detection System for Higher Education
          </p>
        </motion.div>

        {/* KPI Cards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <KPICard
            title="Total Flags"
            value={state.kpiData.totalFlags}
            type="total"
            trend={12}
            onClick={() => handleKPIClick('total')}
            isActive={activeKPI === 'total'}
          />
          <KPICard
            title="Financial Aid Flags"
            value={state.kpiData.financialAidFlags}
            type="financial"
            trend={-5}
            onClick={() => handleKPIClick('financial')}
            isActive={activeKPI === 'financial'}
          />
          <KPICard
            title="Ghost Students"
            value={state.kpiData.ghostStudents}
            type="ghost"
            trend={8}
            onClick={() => handleKPIClick('ghost')}
            isActive={activeKPI === 'ghost'}
          />
          <KPICard
            title="Escalated Cases"
            value={state.kpiData.escalatedCases}
            type="escalated"
            trend={18}
            onClick={() => handleKPIClick('escalated')}
            isActive={activeKPI === 'escalated'}
          />
        </motion.section>

        {/* Fraud Risk Trend Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            7-Day Fraud Risk Trend
          </h2>
          <FraudRiskChart data={state.kpiData.trend} height={300} />
        </motion.section>

        {/* Recent Alerts Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecentAlertsTable 
            cases={filteredCases}
            onCaseSelect={selectCase}
          />
        </motion.section>

        {/* Agent Status Panel */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Agent Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(state.userSettings.enabledAgents).map(([agent, enabled]) => (
              <div
                key={agent}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  enabled 
                    ? 'bg-safe/10 border-safe/30 text-safe' 
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{agent.replace('Agent', '')}</span>
                  <div className={`w-3 h-3 rounded-full ${enabled ? 'bg-safe animate-pulse' : 'bg-gray-400'}`} />
                </div>
                <p className="text-xs mt-1 opacity-70">
                  {enabled ? 'Active' : 'Disabled'}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Neural Network Background Effect */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 neural-bg opacity-5"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}