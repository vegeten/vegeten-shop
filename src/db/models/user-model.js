import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';
const User = model('users', UserSchema);
export class UserModel {
  async findByEmail(email) {
    return await User.findOne({ email: email });
  }
  async findById(userId) {
    return await User.findOne({ shortId: userId });
  }
  async create(userInfo) {
    return await User.create(userInfo);
  }
  async findAll() {
    return await User.find({});
  }
  async update({ userId, update }) {
    const filter = { shortId: userId };
    const option = { returnOriginal: false };
    return await User.findOneAndUpdate(filter, update, option);
  }
  async delete(userId) {
    return await User.findOneAndDelete({ shortId: userId });
  }
}
const userModel = new UserModel();
export { userModel };
