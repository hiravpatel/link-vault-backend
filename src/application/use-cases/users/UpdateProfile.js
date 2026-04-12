const userRepository = require('../../../infrastructure/database/repositories/UserRepository');

class UpdateProfile {
  async execute(userId, { display_name, avatar, profile_setup_done }) {
    const updates = {};
    if (display_name !== undefined) updates.display_name = display_name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (profile_setup_done !== undefined) updates.profile_setup_done = profile_setup_done;

    const user = await userRepository.update(userId, updates);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      display_name: user.display_name,
      avatar: user.avatar,
      profile_setup_done: user.profile_setup_done,
      role: user.role,
      last_login_at: user.last_login_at || null,
      password_changed_at: user.password_changed_at || null,
    };
  }
}

module.exports = new UpdateProfile();
