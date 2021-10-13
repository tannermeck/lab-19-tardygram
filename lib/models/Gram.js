const pool = require('../utils/pool.js');

module.exports = class Gram {
  constructor(row) {
    this.username = row.username;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
  }

  static async create({ username, photoUrl, caption, tags }) {
    const { rows } = await pool.query(
      'INSERT INTO grams (username, photo_url, caption, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, photoUrl, caption, tags]
    );
    return new Gram(rows[0]);
  }
};
