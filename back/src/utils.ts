import jwt from 'jsonwebtoken';
import { constants } from './constants';

export const makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, constants.JWT_ACCESS_SECRET, { expiresIn: `600s` });
  const refreshToken = jwt.sign(tokenData, constants.JWT_REFRESH_SECRET);
  return { accessToken, refreshToken };
};

export const getQueryText = (text: string) => text.replace(/\$\d+/g, '?');

export enum Permissions {
  CanEditProject = 'CanEditProject',
  CanReadProject = 'CanReadProject',
}
