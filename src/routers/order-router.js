import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { orderService } from '../services/order-service';
import { userService } from '../services';
const orderRouter = Router();
// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)

// 전체 주문내역 조회(미들웨어에 admin 인증 넣어야 함)
orderRouter.get('/orders', async (req, res, next) => {
  try {
    const orders = await orderService.getOrderlist();
    res.status(200).json({
      statusCode: 200,
      message: '전체 주문 목록 조회 성공',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
});

// 주문번호로 조회
orderRouter.get('/orders/:orderId', async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrder(orderId);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

// 이메일로 주문내역 조회
orderRouter.get('/orders/email/:email', async (req, res, next) => {
  const { email } = req.params;
  try {
    const orders = await orderService.getOrdersByEmail(email);
    res.status(201).json(orders);
  } catch (err) {
    next(err);
  }
});

// 주문 등록
orderRouter.post('/orders', async (req, res, next) => {
  try {
    const { email, phoneNumber, address, price } = req.body;
    const newOrder = await orderService.addOrder({
      email,
      phoneNumber,
      address,
      price: Number(price),
    });
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

orderRouter.delete('/orders/:orderId', async function (req, res, next) {
  try {
    const orderId = req.params.orderId;
    // 특정 id에 맞는 사용자 정보를 얻음
    await orderService.deleteOrder(orderId);
    // 사용자 정보를 JSON 형태로 프론트에 보냄
    res.status(200).json({
      statusCode: 200,
      message: '주문 정보 삭제 성공',
      data: {
        orderId: orderId,
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
