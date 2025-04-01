import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Define log directory and file paths
const logDir = 'logs';
const errorLog = path.join(logDir, 'error');
const combinedLog = path.join(logDir, 'combined');

// Custom format for readable logs
const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
    // For error logs, include the stack trace
    if (meta.stack) {
        return `${timestamp} [${level.toUpperCase()}]: ${message}\nStack: ${meta.stack}`;
    }
    
    // For HTTP requests, format them nicely
    if (meta.method && meta.path) {
        return `${timestamp} [${level.toUpperCase()}] ${meta.method} ${meta.path} - ${message}`;
    }

    // For regular logs
    const metaStr = Object.keys(meta).length ? `\nDetails: ${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
});

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        customFormat
    ),
    defaultMeta: { service: 'e-commerce-api' },
    transports: [
        // Error logs
        new winston.transports.DailyRotateFile({
            filename: `${errorLog}/%DATE%.error.log`,
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d'
        }),
        // Combined logs
        new winston.transports.DailyRotateFile({
            filename: `${combinedLog}/%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d'
        })
    ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            customFormat
        )
    }));
}

// Simplified Morgan stream format
export const stream = {
    write: (message: string) => {
        const [method, path] = message.split(' ').filter(Boolean);
        logger.info(`${method} ${path}`, { method, path });
    },
};

export default logger; 