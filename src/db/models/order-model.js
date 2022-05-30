import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';
const Order = model('orders', OrderSchema);
export class OrderModel {
  async findAll() {
    return await Order.find({});
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
  async delete(orderId) {
    return await Order.findOneAndDelete({ shortId: orderId });
  }
}
const orderModel = new OrderModel();
export { orderModel };
