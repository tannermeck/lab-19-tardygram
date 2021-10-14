const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const username = req.user.username;
      const commentData = req.body;
      const newComment = await Comment.insert({ ...commentData, username });
      res.send(newComment);
    } catch (err) {
      next(err);
    }
  })
  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const id = req.params.id;
      const username = req.user.username;
      const deletedComment = await Comment.delete({ id, username });
      res.send(deletedComment);
    } catch (err) {
      next(err);
    }
  });
