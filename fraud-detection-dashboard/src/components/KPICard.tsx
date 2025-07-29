import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Users, Flag } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  type: 'total' | 'financial' | 'ghost' | 'escalated';
  trend?: number;
  onClick?: () => void;
  isActive?: boolean;
}

const iconMap = {
  total: Flag,
  financial: AlertTriangle,
  ghost: Users,
  escalated: TrendingUp,
};

const colorMap = {
  total: {
    bg: 'bg-gradient-to-br from-primary/10 to-primary/20',
    border: 'border-primary/30',
    icon: 'text-primary',
    glow: 'shadow-primary/20',
  },
  financial: {
    bg: 'bg-gradient-to-br from-warning/10 to-warning/20',
    border: 'border-warning/30',
    icon: 'text-warning',
    glow: 'shadow-warning/20',
  },
  ghost: {
    bg: 'bg-gradient-to-br from-secondary/10 to-secondary/20',
    border: 'border-secondary/30',
    icon: 'text-secondary',
    glow: 'shadow-secondary/20',
  },
  escalated: {
    bg: 'bg-gradient-to-br from-danger/10 to-danger/20',
    border: 'border-danger/30',
    icon: 'text-danger',
    glow: 'shadow-danger/20',
  },
};

export function KPICard({ title, value, type, trend, onClick, isActive = false }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const Icon = iconMap[type];
  const colors = colorMap[type];

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300
        ${colors.bg} ${colors.border} ${colors.glow}
        ${isActive ? 'ring-2 ring-primary/50 shadow-xl' : 'hover:shadow-lg'}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
      onClick={onClick}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className="neural-bg opacity-20 w-full h-full"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-white/10 ${colors.icon}`}>
            <Icon size={24} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <motion.div
            key={displayValue}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {displayValue.toLocaleString()}
          </motion.div>
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {title}
          </div>
        </div>

        {/* Agent insights overlay */}
        <div className="mt-4 flex space-x-1">
          {['ApplicationAgent', 'MemoryAgent', 'EscalationAgent'].map((agent, index) => (
            <div
              key={agent}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-danger'
              } ${isActive ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {/* Memory Echo badge for repeat offenders */}
        {type === 'total' && (
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse-glow"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
}