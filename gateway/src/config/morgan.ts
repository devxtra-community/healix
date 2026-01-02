import morgan from 'morgan';
import logger from './logger.js';

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
export const morganMiddleware = morgan(
  ':method :url :status :response-time ms',
  { stream },
);
