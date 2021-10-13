const pool = require('../utils/pool.js');

module.exports = class Comment {
  constructor(row) {
    this.id = row.id;
    this.comment = row.comment;
    this.username = row.username;
    this.gramsId = row.grams_id;
  }

  static async insert({ comment, username, gramsId }) {
    const { rows } = await pool.query(
      'INSERT INTO comments(comment, username, grams_id) VALUES ($1, $2, $3) RETURNING *',
      [comment, username, gramsId]
    );
    return new Comment(rows[0]);
  }
};
