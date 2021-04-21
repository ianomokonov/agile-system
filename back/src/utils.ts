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

export enum Permissions {
  CanEditProject = 'CanEditProject',
  CanReadProject = 'CanReadProject',
}

export const getFileExtension = (mimeType) => {
  switch (mimeType) {
    case 'image/png': {
      return '.png';
    }
    case 'image/jpg': {
      return '.jpg';
    }
    default: {
      return '.jpeg';
    }
  }
};

export const removeFile = (fileName) => {
  try {
    if (fileName.indexOf('userimages') > -1) {
      const file = fileName.split('/userimages/')[1];
      fs.unlinkSync(path.resolve(`./src/files/userimages/${file}`));
    }
  } catch (err) {
    logger.error('File not found');
  }
};
