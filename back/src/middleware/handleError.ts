import logger from '../logger';

// eslint-disable-next-line consistent-return
export default (req, res, next): any => {
  try {
    next();
  } catch (error) {
    logger.error(error);
    res.status(error.statusCode || 500).json(error);
  }
};
