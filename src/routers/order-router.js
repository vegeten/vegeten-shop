import { Router } from 'express';
import { orderService } from '../services';
import { loginRequired, adminAuth } from '../middlewares';
const orderRouter = Router();

// 주문 목록 조회 (/api/orders/list) ⇒ admin 한정
orderRouter.get('/list', adminAuth, async (req, res, next) => {
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

// 유저별(본인) 주문 조회 (/api/orders)
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

// 주문 등록  (/api/orders)
orderRouter.post('/', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const { phoneNumber, address, totalPrice, products } = req.body;
    const newOrder = await orderService.addOrder({
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

// 주문 삭제 (/api/orders/:orderId )
orderRouter.delete('/:orderId', loginRequired, async function (req, res, next) {
  try {
    const { orderId } = req.params;
    // 특정 id에 맞는 주문 정보를 얻음
    const deleteOrder = await orderService.deleteOrder(orderId);
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

// 주문 id로 주문상세 조회 (/api/orders/:orderId) ⇒ admin 한정
orderRouter.get('/:orderId', adminAuth, async (req, res, next) => {
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

export { orderRouter };
