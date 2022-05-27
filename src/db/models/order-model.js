import res from 'express/lib/response';
import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';
const Order = model('orders', OrderSchema);
export class OrderModel {
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }
  async findByUser(userId) {
    const orders = await Order.find({ userId: userId });
    // .populate('userId');
    return orders;
  }
  async findById(orderId) {
    const order = await Order.findOne({ _id: orderId });
    return order;
  }
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }
  async delete(orderId) {
    return await Order.findOneAndDelete({ _id: orderId });
  }
}
const orderModel = new OrderModel();
export { orderModel };

// 주문 추가 - 사용자는 장바구니에 속한 상품들로 주문을 추가(진행)할 수 있다.
// 주문 완료 - 주문 완료 시, 주문 완료 페이지로 이동한다.
// 주문 조회 - 사용자는 개인 페이지에서 자신의 주문 내역을 조회할 수 있다.
// 주문 조회 - 관리자는 관리 페이지에서 사용자들의 주문 내역을 조회할 수 있다.
// 주문 취소 - 사용자는 개인 페이지에서 자신의 주문 내역을 취소할 수 있다.
// 주문 취소 - 관리자는 관리 페이지에서 사용자들의 주문 내역을 취소할 수 있다.
// 주문 정보 - db에 배송지 정보, 주문 총액, 수령자 이름 및 연락처가 저장된다.
