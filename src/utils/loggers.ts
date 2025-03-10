import log4js from 'log4js';
import dotenv from 'dotenv';
dotenv.config();

log4js.configure({
  appenders: {
    fileAppender: {
      type: 'file',
      filename: '../logs/MovieValet.log',
      layout: {
        type: 'pattern',
        pattern: '%d [%p] %x{file}:%x{line} - %m',
        tokens: {
          file: (logEvent) => logEvent.fileName || 'unknown',
          line: (logEvent) => logEvent.lineNumber || 'unknown',
          enableCallStack: true, // Still required
        },
      },
      // Also add this to the appender (if needed)
      enableCallStack: true, // ← Some versions require this
    },
    consoleAppender: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d [%p] %x{file}:%x{line} - %m',
        tokens: {
          file: (logEvent) => logEvent.fileName || 'unknown',
          line: (logEvent) => logEvent.lineNumber || 'unknown',
          enableCallStack: true, // Still required
        },
      },
      enableCallStack: true, // ← Some versions require this
    },
  },
  categories: {
    default: {
      appenders: ['fileAppender', 'consoleAppender'],
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  },
});

const logger = log4js.getLogger();
// logger.info("Dumping logEvent:", {
//   // Inspect the logEvent structure
//   fileName: logger.constructor.getLogEventFileName(),
//   lineNumber: logger.constructor.getLogEventLineNumber(),
// });
logger.info('This is an informational message.');
export default logger;
