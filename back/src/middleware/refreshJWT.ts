/* eslint-disable consistent-return */
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { constants } from '../constants';
import refreshTokenService from '../services/refresh-token-service';
import { makeTokens } from '../utils';

export default async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }

  const isTokenActual = await refreshTokenService.find(token);

  if (!isTokenActual) {
    return res.sendStatus(StatusCodes.NOT_FOUND);
  }

  jwt.verify(token, constants.JWT_REFRESH_SECRET, async (err, userData) => {
    if (err) {
      console.log(err);
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    const { id } = userData;
    const { accessToken, refreshToken } = makeTokens({ id });

    await refreshTokenService.drop(token);
    await refreshTokenService.add(refreshToken);

    res.json({ accessToken, refreshToken });
  });
};
