const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('lab-19-tardygram routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should create and return a new post using POST /grams', async () => {
    const res = await request(app)
      .post('/grams')
      .send({
        photoUrl: 'catpictures.com/cat',
        caption: 'my first post!',
        tags: ['cat', 'first-post', 'tardygram'],
      });

    expect(res.body).toEqual({
      user: 'pete-hamrick',
      photoUrl: 'catpictures.com/cat',
      caption: 'my first post!',
      tags: ['cat', 'first-post', 'tardygram'],
    });
  });

  afterAll(() => {
    pool.end();
  });
});
