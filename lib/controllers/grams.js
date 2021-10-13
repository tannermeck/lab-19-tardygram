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
  .get('/', async (req, res, next) => {
    try {
      const posts = await Gram.getAll();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const posts = await Gram.getById(id);
      res.send(posts);
    } catch (error) {
      next(error);
    }
  })
  .patch('/:id', ensureAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const updateWith = req.body;
      const username = req.user.username;
      const updatedGram = await Gram.update({ id, updateWith, username });
      res.send(updatedGram);
    } catch (err) {
      next(err);
    }
  })
  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const username = req.user.username;
      const gramsId = req.params.id;
      const deleted = await Gram.delete({ gramsId, username });
      res.send(deleted);
    } catch (err) {
      next(err);
    }
  });
