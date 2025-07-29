import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ArrowRight, ArrowLeft, ArrowUp, User, Clock, Brain, History } from 'lucide-react';
import type { FraudCase, AgentType } from '../types';
import { format } from 'date-fns';
import { useFraudDetection } from '../context/FraudDetectionContext';

interface SwipeableFraudCardProps {
  fraudCase: FraudCase;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onExpand: () => void;
  index: number;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'from-safe/20 to-safe/40 border-safe/50';
    case 'medium': return 'from-warning/20 to-warning/40 border-warning/50';
    case 'high': return 'from-danger/20 to-danger/40 border-danger/50';
    case 'critical': return 'from-danger/30 to-danger/50 border-danger/70';
    default: return 'from-gray-100 to-gray-200 border-gray-300';
  }
};

const getAgentIcon = (agent: AgentType) => {
  switch (agent) {
    case 'ApplicationAgent': return '🤖';
    case 'MemoryAgent': return '🧠';
    case 'EscalationAgent': return '⚠️';
    case 'ExplainerAgent': return '💡';
    default: return '🔍';
  }
};

export function SwipeableFraudCard({ 
  fraudCase, 
  onSwipeRight, 
  onSwipeLeft, 
  onExpand, 
  index 
}: SwipeableFraudCardProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { generateAISummary } = useFraudDetection();
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const threshold = 150;
    
    if (info.offset.x > threshold) {
      // Swipe right - Approve
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      // Swipe left - Escalate
      onSwipeLeft();
    } else if (info.offset.y < -100) {
      // Swipe up - Expand
      onExpand();
    }
  };

  const generateAI = async () => {
    setIsGeneratingAI(true);
    await generateAISummary(fraudCase.id);
    setIsGeneratingAI(false);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: index === 0 ? 1 : 0.95 - index * 0.05,
        opacity: index === 0 ? 1 : 0.7 - index * 0.1,
        y: index * 10,
        zIndex: 10 - index
      }}
      whileHover={{ scale: index === 0 ? 1.02 : 0.95 - index * 0.05 }}
      className={`
        absolute w-full max-w-md mx-auto cursor-grab active:cursor-grabbing
        ${index === 0 ? 'z-10' : ''}
      `}
    >
      {/* Swipe Indicators */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-200 peer-data-[swiping=right]:opacity-100">
        <div className="bg-safe text-white p-3 rounded-full shadow-lg">
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
      
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-200 peer-data-[swiping=left]:opacity-100">
        <div className="bg-danger text-white p-3 rounded-full shadow-lg">
          <ArrowLeft className="w-6 h-6" />
        </div>
      </div>

      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-200 peer-data-[swiping=up]:opacity-100">
        <div className="bg-primary text-white p-3 rounded-full shadow-lg">
          <ArrowUp className="w-6 h-6" />
        </div>
      </div>

      {/* Main Card */}
      <div className={`
        glassmorphism rounded-2xl border-2 shadow-2xl p-6 min-h-[500px] 
        bg-gradient-to-br ${getSeverityColor(fraudCase.severity)}
        transform transition-all duration-300 hover:shadow-3xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {fraudCase.student.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {fraudCase.student.id} • {fraudCase.student.program}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`
              px-3 py-1 rounded-full text-sm font-semibold
              ${fraudCase.severity === 'critical' ? 'bg-danger text-white animate-pulse' :
                fraudCase.severity === 'high' ? 'bg-danger/80 text-white' :
                fraudCase.severity === 'medium' ? 'bg-warning text-gray-900' :
                'bg-safe text-gray-900'}
            `}>
              {fraudCase.riskScore}% Risk
            </div>
            {fraudCase.memoryEcho && (
              <div className="flex items-center justify-center mt-2">
                <History className="w-4 h-4 text-primary mr-1" />
                <span className="text-xs text-primary font-medium">Memory Echo</span>
              </div>
            )}
          </div>
        </div>

        {/* Stage and Timestamp */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-white/20 dark:bg-black/20 rounded-full text-sm font-medium">
            {fraudCase.stage.replace('_', ' ').toUpperCase()}
          </span>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-1" />
            {format(new Date(fraudCase.flaggedAt), 'MMM dd, HH:mm')}
          </div>
        </div>

        {/* Flags */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white">Detected Flags:</h4>
          {fraudCase.flags.slice(0, 3).map((flag, index) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-white/10 dark:bg-black/10 rounded-lg"
            >
              <span className="text-2xl">{getAgentIcon(flag.triggeredBy)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {flag.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {flag.triggeredBy}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    flag.confidence > 0.8 ? 'bg-danger/20 text-danger' :
                    flag.confidence > 0.6 ? 'bg-warning/20 text-warning' :
                    'bg-safe/20 text-safe'
                  }`}>
                    {Math.round(flag.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {fraudCase.flags.length > 3 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              +{fraudCase.flags.length - 3} more flags
            </p>
          )}
        </div>

        {/* AI Summary */}
        <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <Brain className="w-4 h-4 mr-2 text-primary" />
              AI Analysis
            </h4>
            {!fraudCase.aiSummary && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateAI}
                disabled={isGeneratingAI}
                className="px-3 py-1 bg-primary text-white rounded-md text-xs hover:bg-primary/80 transition-colors duration-200 disabled:opacity-50"
              >
                {isGeneratingAI ? 'Generating...' : 'Generate'}
              </motion.button>
            )}
          </div>
          
          {isGeneratingAI ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300 typing-indicator">
                  AI analyzing case patterns
                </span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary animate-neural-wave"></div>
              </div>
            </div>
          ) : fraudCase.aiSummary ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {fraudCase.aiSummary}
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Click "Generate" to get AI insights for this case
            </p>
          )}
        </div>

        {/* Action Hints */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <ArrowLeft className="w-6 h-6 mx-auto text-danger" />
            <p className="text-xs text-gray-600 dark:text-gray-300">Swipe Left</p>
            <p className="text-xs font-semibold text-danger">Escalate</p>
          </div>
          <div className="space-y-1">
            <ArrowUp className="w-6 h-6 mx-auto text-primary" />
            <p className="text-xs text-gray-600 dark:text-gray-300">Swipe Up</p>
            <p className="text-xs font-semibold text-primary">Details</p>
          </div>
          <div className="space-y-1">
            <ArrowRight className="w-6 h-6 mx-auto text-safe" />
            <p className="text-xs text-gray-600 dark:text-gray-300">Swipe Right</p>
            <p className="text-xs font-semibold text-safe">Approve</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}