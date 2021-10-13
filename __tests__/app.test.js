const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');
const setupDb = require('../lib/utils/setupDb.js');

jest.mock('../lib/middleware/ensure-auth.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test_user',
      photoUrl: 'https://example.com/image.png',
      iat: Date.now(),
      exp: Date.now(),
    };

    next();
  };
});

describe('lab-19-tardygram routes', () => {
  beforeAll(async () => {
    await setup(pool);
    await setupDb();
  });

  it('should create and return a new post using POST /grams', async () => {
    const user = await User.insert({
      username: 'test_user',
      photoUrl: 'https://example.com/image.png'
    })
    const res = await request(app)
      .post('/grams')
      .send({
        photoUrl: 'catpictures.com/cat',
        caption: 'my first post!',
        tags: ['cat', 'first-post', 'tardygram'],
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      username: user.username,
      photo_url: 'catpictures.com/cat',
      caption: 'my first post!',
      tags: ['cat', 'first-post', 'tardygram'],
    });
  });

  it('should return a list of posts', async () => {
    const res = await request(app)
      .get('/grams')
    expect(res.body).toEqual(
      expect.arrayContaining([
        {
      // id: expect.any(String),
      username: expect.any(String),
      photoUrl: expect.any(String),
      caption: expect.any(String),
      tags: expect.arrayContaining([ expect.any(String) ]),
    }])
  )});

  afterAll(() => {
    pool.end();
  });
});
