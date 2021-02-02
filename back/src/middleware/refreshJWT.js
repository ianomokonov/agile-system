const { HttpCode, JWT_REFRESH_SECRET } = require('../constants');
const refreshTokenService = require(`../services/refresh-token-service`);
const jwt = require(`jsonwebtoken`);
const { makeTokens } = require('../utils');

module.exports = async (req, res) => {
  const { token } = req.body;
  if (!token) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
  };

  const existToken = await refreshTokenService.find(token);

  // if (!existToken) {
  //     return res.sendStatus(HttpCode.NOT_FOUND);
  // }

  jwt.verify(token, JWT_REFRESH_SECRET, async (err, userData) => {
      if (err) {
          return res.sendStatus(HttpCode.FORBIDDEN);
      }

      const {id} = userData;
      const {accessToken, refreshToken}  = makeTokens({id});

      // await refreshTokenService.drop(existToken);
      // await refreshTokenService.add(refreshToken);
      console.log({accessToken, refreshToken});
      res.json({accessToken, refreshToken});
  });
};
