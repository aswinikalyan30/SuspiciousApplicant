import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Clock, User, AlertTriangle, CheckCircle, XCircle, ArrowUpCircle } from 'lucide-react';
import type { FraudCase, AgentType } from '../types';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

interface RecentAlertsTableProps {
  cases: FraudCase[];
  onCaseSelect: (fraudCase: FraudCase) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'text-safe bg-safe/10 border-safe/30';
    case 'medium': return 'text-warning bg-warning/10 border-warning/30';
    case 'high': return 'text-danger bg-danger/10 border-danger/30';
    case 'critical': return 'text-danger bg-danger/20 border-danger/50 animate-pulse';
    default: return 'text-gray-500 bg-gray-100 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4 text-warning" />;
    case 'reviewed': return <CheckCircle className="w-4 h-4 text-safe" />;
    case 'escalated': return <ArrowUpCircle className="w-4 h-4 text-danger" />;
    case 'dismissed': return <XCircle className="w-4 h-4 text-gray-500" />;
    default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
};

const getAgentColor = (agent: AgentType) => {
  switch (agent) {
    case 'ApplicationAgent': return 'bg-primary text-white';
    case 'MemoryAgent': return 'bg-secondary text-gray-900';
    case 'EscalationAgent': return 'bg-danger text-white';
    case 'ExplainerAgent': return 'bg-warning text-gray-900';
    default: return 'bg-gray-500 text-white';
  }
};

export function RecentAlertsTable({ cases, onCaseSelect }: RecentAlertsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newCaseIds, setNewCaseIds] = useState<Set<string>>(new Set());
  // Remove: const { state } = useFraudDetection();

  const filteredCases = cases.filter(fraudCase =>
    fraudCase.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fraudCase.student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fraudCase.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Track new cases for animation
  useEffect(() => {
    const newIds = new Set<string>();
    cases.forEach(fraudCase => {
      if (Date.now() - new Date(fraudCase.flaggedAt).getTime() < 5000) {
        newIds.add(fraudCase.id);
      }
    });
    setNewCaseIds(newIds);

    // Clear new case indicators after animation
    const timer = setTimeout(() => {
      setNewCaseIds(new Set());
    }, 3000);

    return () => clearTimeout(timer);
  }, [cases]);

  const MiniTimeline = ({ timeline }: { timeline: FraudCase['timeline'] }) => {
    const recentEvents = timeline.slice(-3);
    return (
      <div className="flex items-center space-x-1">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className={`w-2 h-2 rounded-full ${
              event.agent === 'ApplicationAgent' ? 'bg-primary' :
              event.agent === 'MemoryAgent' ? 'bg-secondary' :
              event.agent === 'EscalationAgent' ? 'bg-danger' :
              'bg-gray-400'
            }`}
            title={`${event.description} - ${format(new Date(event.timestamp), 'HH:mm')}`}
          />
        ))}
        {timeline.length > 3 && (
          <span className="text-xs text-gray-500 ml-1">+{timeline.length - 3}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent High-Risk Alerts
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary/20 focus:border-primary
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glassmorphism rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence>
                {filteredCases.map((fraudCase, index) => (
                  <motion.tr
                    key={fraudCase.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      hover:bg-white/5 transition-colors duration-200 cursor-pointer
                      ${newCaseIds.has(fraudCase.id) ? 'bg-primary/10 animate-slide-in' : ''}
                    `}
                    onClick={() => onCaseSelect(fraudCase)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {fraudCase.student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {fraudCase.student.id}
                          </div>
                        </div>
                        {fraudCase.memoryEcho && (
                          <div className="ml-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse-glow"
                                 title="Memory Echo - Previous incidents detected" />
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {fraudCase.stage.replace('_', ' ')}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${getSeverityColor(fraudCase.severity)}
                        `}>
                          {fraudCase.riskScore}%
                        </div>
                        {getStatusIcon(fraudCase.status)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {[...new Set(fraudCase.flags.map(flag => flag.triggeredBy))].map(agent => (
                          <span
                            key={agent}
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getAgentColor(agent)}`}
                          >
                            {agent.replace('Agent', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MiniTimeline timeline={fraudCase.timeline} />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCaseSelect(fraudCase);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-primary text-primary hover:bg-primary hover:text-white rounded-md transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Case
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No cases match your search.' : 'No fraud cases found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}