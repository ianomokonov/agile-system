import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { constants } from './constants';
import logger from './logger';

export const makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, constants.JWT_ACCESS_SECRET, { expiresIn: `600s` });
  const refreshToken = jwt.sign(tokenData, constants.JWT_REFRESH_SECRET);
  return { accessToken, refreshToken };
};

export const getQueryText = (text: string) => text.replace(/\$\d+/g, '?');

export const getFileExtension = (fileName: string) => {
  const result = fileName.match(/\.\w+$/);

  if (result) {
    return result[0];
  }

  return '';
};

export const removeFile = (fileName) => {
  try {
    if (fileName.indexOf('userimages') > -1) {
      const file = fileName.split('/userimages/')[1];
      fs.unlinkSync(path.resolve(`./files/userimages/${file}`));
      return;
    }

    const file = fileName.split('/taskfiles/')[1];
    fs.unlinkSync(path.resolve(`./files/taskfiles/${file}`));
  } catch (err) {
    logger.error('File not found');
  }
};
