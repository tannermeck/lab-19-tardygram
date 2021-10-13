const pool = require('../utils/pool.js');

module.exports = class Gram {
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
    this.comments = row.comments;
  }

  static async create({ username, photoUrl, caption, tags }) {
    const { rows } = await pool.query(
      'INSERT INTO grams (username, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [username, photoUrl, caption]
    );
    //TODO promise.all our tag insert
    const tagsResults = await Promise.all(
      tags.map((tag) => {
        return pool.query(
          'INSERT INTO tags (tag, grams_id) VALUES ($1, $2) RETURNING *',
          [tag, rows[0].id]
        );
      })
    );
    return {
      ...rows[0],
      tags: tagsResults.map((result) => result.rows[0].tag),
    };
  }

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT grams.photo_url, grams.username, grams.caption, ARRAY_AGG(tags.tag) tags 
        FROM grams 
        LEFT JOIN tags 
        ON grams.id = tags.grams_id
        GROUP BY grams.id`
    );
    return rows.map((row) => {
      return new Gram(row);
    });
  }
  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT grams.photo_url, grams.username, grams.caption, ARRAY_AGG(DISTINCT tags.tag) AS tags,
      ARRAY_AGG(DISTINCT comments.comment) AS comments 
      FROM grams 
      LEFT JOIN tags 
      ON grams.id = tags.grams_id
      LEFT JOIN comments
      ON grams.id = comments.grams_id
      WHERE grams.id = $1
      GROUP BY grams.photo_url, grams.username, grams.caption`,
      [id]
    );
    return new Gram(rows[0]);
  }

  static async update({ id, updateWith, username }) {
    const { rows } = await pool.query(
      `UPDATE grams
      SET caption=$1
      WHERE id=$2 AND username=$3 
      RETURNING *;`,
      [updateWith.caption, id, username]
    );
    const tags = await pool.query(
      `SELECT tag
      FROM tags 
      WHERE grams_id=$1`,
      [id]
    );

    return new Gram({ ...rows[0], tags: tags.rows.map((tag) => tag.tag) });
  }
};
