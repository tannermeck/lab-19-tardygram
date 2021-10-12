const User = require('../models/User');
const { exchangeCodeForToken, getUserProfile } = require('../utils/githubApi');

module.exports = class UserService {
  static async create(code) {
    const accessToken = await exchangeCodeForToken(code);

    const profileBody = await getUserProfile(accessToken);

    let user = await User.findByUsername(profileBody.login);

    if (!user) {
      user = await User.insert({
        username: profileBody.login,
        photoUrl: profileBody.avatar_url,
      });
    }
    return user;
  }
};
