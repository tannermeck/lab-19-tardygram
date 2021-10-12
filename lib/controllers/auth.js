const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scopes=read:user`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const user = UserService.create(req.query.code);

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: 86400000, // one day
        secure: true,
      });

      res.send(user);
    } catch (error) {
      next(error);
    }
  });
