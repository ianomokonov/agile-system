const { HttpCode, JWT_ACCESS_SECRET } = require('../constants');
const jwt = require(`jsonwebtoken`);

module.exports = (req, res, next) => {
  const authorization = req.headers[`authorization`];

  if (!authorization) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  const [, token] = authorization.split(` `);

  if (!token) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, userData) => {
    if (err) {
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    res.locals.user = userData;
    next();
  });
};
