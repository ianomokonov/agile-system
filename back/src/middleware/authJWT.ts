const { HttpCode, JWT_ACCESS_SECRET } = require('../constants');

const jwt = require(`jsonwebtoken`);

// eslint-disable-next-line consistent-return
export default (req, res, next): any => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  const [, token] = authorization.split(` `);

  if (!token) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, JWT_ACCESS_SECRET, (err, userData) => {
    if (err) {
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    res.locals.user = userData;
    next();
  });
};
