import { orderModel } from '../db';
import { customError } from '../middlewares/error/customError';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async getOrderlist() {
    const orders = await this.orderModel.findAll();
    return orders;
  }

  async getOrdersByUser(userId) {
    const orders = await this.orderModel.findByUser(userId);
    if (!orders || orders === null) {
      throw new customError(404, '해당 id의 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    return orders;
  }

  async getOrder(orderId) {
    const order = await this.orderModel.findById(orderId);
    if (!order || order === null) {
      throw new customError(404, '해당 id의 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    return order;
  }

  async addOrder(orderInfo) {
    const createdNewOrder = await this.orderModel.create(orderInfo);
    return createdNewOrder;
  }
  async setOrder(orderId, orderInfo) {
    return await this.orderModel.update({ orderId, update: orderInfo });
  }

  async deleteOrder(orderId) {
    let order = await this.orderModel.delete(orderId);
    if (!order || order === null) {
      throw new customError(404, '해당 id의 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    return order;
  }
}
const orderService = new OrderService(orderModel);
export { orderService };
