/* eslint-disable consistent-return */
import { StatusCodes } from 'http-status-codes';

export default async (req, res) => {
  const { id: projectId } = req.query;
  if (!projectId) {
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};
