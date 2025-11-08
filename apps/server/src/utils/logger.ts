// Simple logger utility (replaces console.* for SonarQube compliance)
/* eslint-disable no-console */

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`ℹ️  ${message}`, ...args);
    }
  },

  success: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`✅ ${message}`, ...args);
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`⚠️  ${message}`, ...args);
    }
  },

  error: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`❌ ${message}`, ...args);
    }
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 ${message}`, ...args);
    }
  },
};

export default logger;

