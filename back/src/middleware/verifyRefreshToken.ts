import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { constants } from '../constants';

// eslint-disable-next-line consistent-return
export default (req, res, next): any => {
  const { token } = req.query;

  if (!token) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, constants.JWT_REFRESH_SECRET, (err, userData) => {
    if (err) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }
    res.locals.userId = userData.id;
    next();
  });
};
