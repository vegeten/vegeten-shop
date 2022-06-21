import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';
const Order = model('orders', OrderSchema);
export class OrderModel {
  async findAll() {
    return await Order.find({}).sort({ createdAt: -1 });
  }
  async findByUser(userId) {
    return await Order.find({ userId: userId });
  }
  async findById(orderId) {
    return await Order.findOne({ shortId: orderId });
  }
  async create(orderInfo) {
    return await Order.create(orderInfo);
  }

  async update({ orderId, update }) {
    const filter = { shortId: orderId };
    const option = { returnOriginal: false };
    return await Order.findOneAndUpdate(filter, update, option);
  }
  async delete(orderId) {
    return await Order.findOneAndDelete({ shortId: orderId });
  }
}
const orderModel = new OrderModel();
export { orderModel };
