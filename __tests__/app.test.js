const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const User = require('../lib/models/User.js');

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
  beforeEach(() => {
    return setup(pool);
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

  afterAll(() => {
    pool.end();
  });
});
