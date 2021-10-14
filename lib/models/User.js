const pool = require('../utils/pool.js');
const jwt = require('jsonwebtoken');

module.exports = class User {
  constructor(row) {
    this.username = row.github_name;
    this.photoUrl = row.github_avatar_url;
    this.totalComments = row.comments;
  }

  static async findByUsername(username) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE github_name = $1',
      [username]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async insert({ username, photoUrl }) {
    const { rows } = await pool.query(
      'INSERT INTO users (github_name, github_avatar_url) VALUES ($1, $2) RETURNING *',
      [username, photoUrl]
    );
    return new User(rows[0]);
  }

  static async updateByName({ username, photoUrl }) {
    const { rows } = await pool.query(
      'UPDATE users SET github_avatar_url=$1 WHERE github_name=$2 RETURNING *',
      [photoUrl, username]
    );
    return new User(rows[0]);
  }

  static async getPopular() {
    const { rows } = await pool.query(`
      SELECT grams.username, count(comments.comment) as comments
      FROM grams
      INNER JOIN comments
      ON comments.grams_id = grams.id
      GROUP BY grams.username
      ORDER BY comments DESC
      LIMIT 10;
    `);

    return rows.map((row) => {
      return { username: row.username, totalComments: row.comments };
    });
  }

  authToken() {
    return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
      expiresIn: '24h',
    });
  }

  toJSON() {
    return {
      username: this.username,
      photoUrl: this.photoUrl,
    };
  }
};
