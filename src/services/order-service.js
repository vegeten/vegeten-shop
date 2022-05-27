import { orderModel } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
class OrderService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
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
      const e = new Error('Id not found');
      e.status = 404;
      throw e;
    }
    return orders;
  }

  async getOrder(orderId) {
    const order = await this.orderModel.findById(orderId);
    if (!order || order === null) {
      const e = new Error('해당 id의 주문 내역이 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }
    return order;
  }

  async addOrder(orderInfo) {
    const createdNewOrder = await this.orderModel.create(orderInfo);
    return createdNewOrder;
  }

  async deleteOrder(orderId) {
    let order = await this.orderModel.delete(orderId);
    if (!order || order === null) {
      const e = new Error('해당 주문의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }
    return order;
  }
}
const orderService = new OrderService(orderModel);
export { orderService };

// 주문 추가 - 사용자는 장바구니에 속한 상품들로 주문을 추가(진행)할 수 있다.
// 주문 완료 - 주문 완료 시, 주문 완료 페이지로 이동한다.
// 주문 조회 - 사용자는 개인 페이지에서 자신의 주문 내역을 조회할 수 있다.
// 주문 조회 - 관리자는 관리 페이지에서 사용자들의 주문 내역을 조회할 수 있다.
// 주문 취소 - 사용자는 개인 페이지에서 자신의 주문 내역을 취소할 수 있다.
// 주문 취소 - 관리자는 관리 페이지에서 사용자들의 주문 내역을 취소할 수 있다.
// 주문 정보 - db에 배송지 정보, 주문 총액, 수령자 이름 및 연락처가 저장된다.
