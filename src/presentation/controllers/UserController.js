const ApiResponse = require('../../shared/ApiResponse');
const getProfile = require('../../application/use-cases/users/GetProfile');
const updateProfile = require('../../application/use-cases/users/UpdateProfile');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await getProfile.execute(req.user._id);
      return ApiResponse.success(res, 'Profile fetched', user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await updateProfile.execute(req.user._id, req.body);
      return ApiResponse.success(res, 'Profile updated', user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
