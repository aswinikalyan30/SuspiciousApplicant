import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUp, RefreshCw, FileText } from 'lucide-react';
import { SwipeableFraudCard } from './SwipeableFraudCard';
import { useFraudDetection } from '../context/FraudDetectionContext';
import type { FraudCase } from '../types';

export function CaseReviewPanel() {
  const { state, approveCase, escalateCase, selectCase } = useFraudDetection();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedCases, setProcessedCases] = useState<Set<string>>(new Set());

  // Filter to only pending cases
  const pendingCases = state.fraudCases.filter(
    c => c.status === 'pending' && !processedCases.has(c.id)
  );

  const currentCase = pendingCases[currentIndex];

  const handleSwipeRight = () => {
    if (currentCase) {
      approveCase(currentCase.id);
      setProcessedCases(prev => new Set([...prev, currentCase.id]));
      moveToNext();
    }
  };

  const handleSwipeLeft = () => {
    if (currentCase) {
      escalateCase(currentCase.id);
      setProcessedCases(prev => new Set([...prev, currentCase.id]));
      moveToNext();
    }
  };

  const handleExpand = () => {
    if (currentCase) {
      selectCase(currentCase);
    }
  };

  const moveToNext = () => {
    if (currentIndex < pendingCases.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const resetStack = () => {
    setProcessedCases(new Set());
    setCurrentIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        event.preventDefault();
        handleSwipeRight();
      } else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        handleSwipeLeft();
      } else if (event.code === 'ArrowUp') {
        event.preventDefault();
        handleExpand();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCase]);

  if (pendingCases.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[600px] flex flex-col items-center justify-center text-center space-y-6"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
          <FileText className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Cases Reviewed!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            Great work! You've reviewed all pending fraud cases. 
            {processedCases.size > 0 && ` You've processed ${processedCases.size} cases in this session.`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetStack}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors duration-200"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Review Again</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text">Case Review</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {pendingCases.length} pending cases • Case {currentIndex + 1} of {pendingCases.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentIndex + processedCases.size) / (pendingCases.length + processedCases.size)) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentIndex + processedCases.size) / (pendingCases.length + processedCases.size)) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px] flex justify-center items-center">
        <AnimatePresence>
          {pendingCases.slice(currentIndex, currentIndex + 3).map((fraudCase, index) => (
            <SwipeableFraudCard
              key={fraudCase.id}
              fraudCase={fraudCase}
              onSwipeRight={index === 0 ? handleSwipeRight : () => {}}
              onSwipeLeft={index === 0 ? handleSwipeLeft : () => {}}
              onExpand={index === 0 ? handleExpand : () => {}}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwipeLeft}
          className="w-16 h-16 bg-danger text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200"
          title="Escalate Case (← Arrow Key)"
        >
          <ArrowLeft className="w-8 h-8" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleExpand}
          className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200"
          title="View Details (↑ Arrow Key)"
        >
          <ArrowUp className="w-8 h-8" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwipeRight}
          className="w-16 h-16 bg-safe text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200"
          title="Approve Case (→ Arrow Key)"
        >
          <ArrowRight className="w-8 h-8" />
        </motion.button>
      </div>

      {/* Keyboard Hints */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Use arrow keys: ← Escalate • ↑ Details • → Approve
      </div>

      {/* Session Stats */}
      {processedCases.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-lg p-4 border border-white/20 text-center"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Session Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-safe">{Array.from(processedCases).filter(id => 
                state.fraudCases.find(c => c.id === id)?.status === 'dismissed'
              ).length}</div>
              <div className="text-gray-600 dark:text-gray-300">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-danger">{Array.from(processedCases).filter(id => 
                state.fraudCases.find(c => c.id === id)?.status === 'escalated'
              ).length}</div>
              <div className="text-gray-600 dark:text-gray-300">Escalated</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{processedCases.size}</div>
              <div className="text-gray-600 dark:text-gray-300">Total</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}