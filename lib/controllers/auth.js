const { Router } = require('express');
const fetch = require('cross-fetch');
const User = require('../models/User.js');

module.exports = Router()
  .get('/login', (req, res) => {
      res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scopes=read:user`)
  })
  .get('/login/callback', async (req, res, next) => {
      try {
        //   const user = UserService.create(req.query.code);
          const tokenReponse = await fetch(`https://github.com/login/oauth/access_token`, 
      {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              code: req.query.code,
          }),
      })
        const tokenBody = await tokenReponse.json();

        const profileResponse = await fetch('https://api.github.com/user', 
        {
            headers: {
                Authorization: `token ${tokenBody.access_token}`,
            }
        })
        const profileBody = await profileResponse.json();
        console.log(profileBody);
        let user = await User.findByUsername(profileBody.login);
        if (!user) {
            user = await User.insert({
                username: profileBody.login,
                photoUrl: profileBody.avatar_url
            })
        }

          res.send(user);
      } catch (error) {
          next(error);
      }
  })