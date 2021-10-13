const { users, grams, tags } = require('./fakeData.js');
const pool = require('./pool.js');

module.exports = async () => {
    const gitHubNames = [];
    for (let i = 0; i < 20; i++){
        const fakeUser = users();
        gitHubNames.push(fakeUser.github_name)
        await pool.query('INSERT INTO users (github_name, github_avatar_url) VALUES ($1, $2) RETURNING *',
        [fakeUser.github_name, fakeUser.github_avatar_url]
        )

    }
    for (let i = 0; i < 50; i++){
        const randomNumber = Math.floor(Math.random() * gitHubNames.length)
        const fakeGrams = grams(gitHubNames[randomNumber])
        await pool.query('INSERT INTO grams (username, photo_url, caption) VALUES ($1, $2, $3)',
        [fakeGrams.username, fakeGrams.photo_url, fakeGrams.caption]
        )
    }
    for (let i = 0; i < 150; i++){
        const randomNumberString = Math.ceil(Math.random() * 50).toString();
        const fakeTags = tags(randomNumberString)
        await pool.query('INSERT INTO tags (tag, grams_id) VALUES ($1, $2)',
        [fakeTags.tag, fakeTags.grams_id])
    }
}

