import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { constants } from '../constants';
import { WebError } from '../models/error';

// eslint-disable-next-line consistent-return
export default (socket, next): any => {
  const { token } = socket.handshake.query;

  if (!token) {
    next(new WebError(StatusCodes.UNAUTHORIZED));
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, constants.JWT_ACCESS_SECRET, (err, userData) => {
    if (err) {
      return next(new WebError(StatusCodes.UNAUTHORIZED));
    }

    // eslint-disable-next-line no-param-reassign
    socket.userId = userData.userId;
    next();
  });
};
