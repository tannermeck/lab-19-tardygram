const { Router } = require('express');
const User = require('../models/User');

module.exports = Router().get('/popular', async (req, res, next) => {
  try {
    const popularUsers = await User.getPopular();
    res.send(popularUsers);
  } catch (err) {
    next(err);
  }
});
