import morgan from 'morgan';
import logger from './logger.ts';

const stream = {
  write: (message: String) => {
    logger.info(message.trim());
  },
};
export const morganMiddleware = morgan(
  ':method :url :status :response-time ms',
  { stream },
);
