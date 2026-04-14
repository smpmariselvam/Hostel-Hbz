import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Check,
  ChevronDown
} from 'lucide-react';

const ThemeToggle = ({ showLabel = true, size = 'md' }) => {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme, isDark } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const themeOptions = [
    {
      key: 'light',
      label: 'Light',
      icon: Sun,
      action: setLightTheme,
      description: 'Light theme'
    },
    {
      key: 'dark',
      label: 'Dark',
      icon: Moon,
      action: setDarkTheme,
      description: 'Dark theme'
    },
    {
      key: 'system',
      label: 'System',
      icon: Monitor,
      action: setSystemTheme,
      description: 'Follow system preference'
    }
  ];

  const getCurrentThemeOption = () => {
    const savedTheme = localStorage.getItem('hostel-theme');
    if (!savedTheme) return themeOptions[2]; // System
    return themeOptions.find(option => option.key === theme) || themeOptions[0];
  };

  const currentOption = getCurrentThemeOption();

  // Simple toggle version
  if (!showDropdown && size === 'sm') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`${sizeClasses[size]} rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className={`${iconSizes[size]} text-yellow-500`} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className={`${iconSizes[size]} text-blue-600`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // Dropdown version
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className={`${showLabel ? 'px-4 py-2' : sizeClasses[size]} rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-gray-700 dark:text-gray-300`}
        aria-label="Theme options"
        aria-expanded={showDropdown}
      >
        <currentOption.icon className={iconSizes[size]} />
        {showLabel && (
          <>
            <span className="text-sm font-medium">{currentOption.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20"
            >
              {themeOptions.map((option) => {
                const isActive = option.key === currentOption.key;
                const Icon = option.icon;
                
                return (
                  <motion.button
                    key={option.key}
                    whileHover={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}
                    onClick={() => {
                      option.action();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;