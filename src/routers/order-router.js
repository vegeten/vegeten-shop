import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from '../services/order-service';
import { adminAuth, loginRequired } from '../middlewares';
const orderRouter = Router();

// 전체 주문내역 조회, admin 전용
orderRouter.get('/orderlist', loginRequired, adminAuth, async (req, res, next) => {
  try {
    const orders = await orderService.getOrderlist();
    res.status(200).json({
      status: 200,
      message: '전체 주문 목록 조회 성공',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// 유저별 주문내역 조회, 로그인한 사용자만 가능
orderRouter.get('/', loginRequired, async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUser(req.currentUserId);
    res.status(200).json({
      status: 200,
      message: '유저별 주문 목록 조회 성공',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// 주문번호로 조회, admin 전용 필요시 사용
orderRouter.get('/:orderId', loginRequired, adminAuth, async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrder(orderId);
    res.status(200).json({
      status: 200,
      message: '주문번호 조회 성공',
      data: order,
    });
  } catch (err) {
    next(err);
  }
});

// 주문 등록, 로그인한 사용자만 가능
orderRouter.post('/', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const { email, phoneNumber, address, totalPrice, products } = req.body;
    const newOrder = await orderService.addOrder({
      // email,
      address,
      phoneNumber,
      totalPrice: Number(totalPrice),
      products,
      userId,
    });
    res.status(201).json({
      status: 201,
      message: '주문 등록 성공',
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
});

// 주문 삭제 admin 유저만 가능
orderRouter.delete('/:orderId', loginRequired, async function (req, res, next) {
  try {
    const orderId = req.params.orderId;
    // 특정 id에 맞는 주문 정보를 얻음
    const deleteOrder = await orderService.deleteOrder(orderId);
    console.log(deleteOrder);
    // 사용자 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      status: 200,
      message: '주문 내역 삭제 성공',
      data: {
        deleteOrder,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 주문 추가 - 사용자는 장바구니에 속한 상품들로 주문을 추가(진행)할 수 있다.
// 주문 완료 - 주문 완료 시, 주문 완료 페이지로 이동한다.
// 주문 조회 - 사용자는 개인 페이지에서 자신의 주문 내역을 조회할 수 있다.
// 주문 조회 - 관리자는 관리 페이지에서 사용자들의 주문 내역을 조회할 수 있다.
// 주문 취소 - 사용자는 개인 페이지에서 자신의 주문 내역을 취소할 수 있다.
// 주문 취소 - 관리자는 관리 페이지에서 사용자들의 주문 내역을 취소할 수 있다.
// 주문 정보 - db에 배송지 정보, 주문 총액, 수령자 이름 및 연락처가 저장된다.

export { orderRouter };
