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
      'INSERT INTO grams (username, photo_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [username, photoUrl, caption]
    );
    //TODO promise.all our tag insert
    const tagsResults = await Promise.all(
      tags.map(tag => {
        return pool.query(
          'INSERT INTO tags (tag, grams_id) VALUES ($1, $2) RETURNING *',
          [tag, rows[0].id]
        );
        
      })
    )
    return {
      ...rows[0],
      tags: tagsResults.map((result) => result.rows[0].tag),
    };
  }

  static async getAll(){
    const { rows } = await pool.query(
      `SELECT grams.photo_url, grams.username, grams.caption, ARRAY_AGG(tags.tag) tags 
        FROM grams 
        LEFT JOIN tags 
        ON grams.id = tags.grams_id
        GROUP BY grams.id`
    )
    return rows.map(row => {
      return new Gram(row)
    })
  }
  static async getById(id){
    const { rows } = await pool.query(
      `SELECT * FROM `
    )
    return rows.map(row => {
      return new Gram(row)
    })
  }
};
