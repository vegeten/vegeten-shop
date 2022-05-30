import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';
const User = model('users', UserSchema);
export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }
  async findById(userId) {
    return await User.findOne({ _id: userId });
  }
  async create(userInfo) {
    return await User.create(userInfo);
  }
  async findAll() {
    return await User.find({}, { email: 1, fullName: 1, password: 1, address: 1, role: 1 });
  }
  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };
    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }
  async delete(userId) {
    return await User.deleteOne({ _id: userId });
  }
}
const userModel = new UserModel();
export { userModel };
