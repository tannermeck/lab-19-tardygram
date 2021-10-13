const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Gram = require('../models/Gram.js');

module.exports = Router()
.post('/', ensureAuth, async (req, res, next) => {
  try {
    const username = req.user.username;
    const gram = await Gram.create({ ...req.body, username });
    res.send(gram);
  } catch (err) {
    next(err);
  }
})

