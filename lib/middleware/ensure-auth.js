const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const { session } = req.cookies;

    const user = jwt.verify(session, process.env.APP_SECRET);

    req.user = user;

    next();
  } catch (err) {
    err.status = 401;
    err.message = 'Please sign in to continue';
    next(err);
  }
};
