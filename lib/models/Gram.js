const pool = require('../utils/pool.js');

module.exports = class Gram {
  constructor(row) {
    this.username = row.username;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
  }

  static async create({ username, photoUrl, caption, tags }) {
    //TODO promise.all our tag insert
    const tagInsert = await pool.query(
      'INSERT INTO tags (tags) VALUES ($1) RETURNING *',
      [tags]
    );
    const { rows } = await pool.query(
      'INSERT INTO grams (username, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [username, photoUrl, caption]
    );
    return {
      ...rows[0],
      tags: tagInsert.rows.map((row) => row.tags),
    };
  }
};