import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { constants } from '../constants';

// eslint-disable-next-line consistent-return
export default (req, res, next): any => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  const [, token] = authorization.split(` `);

  if (!token) {
    return res.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, constants.JWT_ACCESS_SECRET, (err, userData) => {
    if (err) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    res.locals.user = userData;
    next();
  });
};
