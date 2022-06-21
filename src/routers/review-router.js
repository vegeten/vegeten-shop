import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuth, customError } from '../middlewares';
import { reviewService, userService, orderService } from '../services';
import jwt from 'jsonwebtoken';

const reviewRouter = Router();

// 리뷰 등록
reviewRouter.post('/:orderId/:productId', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    const { orderId, productId } = req.params;
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);
    const { fullName } = user;

    const { comment, image, score } = req.body;
    const reviewInfo = {
      userId: userId,
      fullName: fullName,
      productId: productId,
      orderId: orderId,
      comment: comment,
      image: image,
      score: score,
    };
    const addedReview = await reviewService.addReview(reviewInfo);
    let order = await orderService.getOrder(orderId);
    order.products.forEach((product) => {
      if (product.productId === productId) {
        if (product.review) {
          throw new customError(403, 'Forbidden');
        }
        product.reviewed = true;
      }
    });
    const { products, shortId } = order;
    const toUpdate = {
      ...(products && { products }),
    };
    console.log(products, shortId);
    const updatedOrder = await orderService.setOrder(shortId, toUpdate);

    res.status(201).json({
      status: 201,
      message: '리뷰 추가 성공',
      data: addedReview,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

reviewRouter.get('/', adminAuth, async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewlist();
    res.status(200).json({
      status: 200,
      message: '전체 리뷰 목록 조회 성공',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

// 리뷰 ID로 조회
reviewRouter.get('/:reviewId', async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewService.getReview(reviewId);
    res.status(200).json({
      status: 200,
      message: '리뷰 조회 성공',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 ID로 조회
reviewRouter.get('/product/:productId', async (req, res, next) => {
  try {
    let currentUserId = null;
    const userToken = req.headers['authorization']?.split(' ')[1];
    if (userToken) {
      const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
      const jwtDecoded = jwt.verify(userToken, secretKey);
      currentUserId = jwtDecoded.userId;
    }

    const { productId } = req.params;
    let reviews = await reviewService.getReviewsByProduct(productId);
    let totalScore = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalScore += reviews[i].score;
    }
    let averageScore = totalScore / reviews.length;

    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 9);

    const reviewsPerPage = reviews.slice(perPage * (page - 1), perPage * (page - 1) + perPage);
    const total = reviews.length;
    const totalPage = Math.ceil(total / perPage);
    reviews = reviewsPerPage;

    res.status(200).json({
      status: 200,
      message: '해당 상품 리뷰 목록 조회 성공',
      data: {
        currentUserId,
        totalScore,
        averageScore,
        reviewCount: total,
        totalPage: totalPage,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 주문 ID로 조회
reviewRouter.get('/order/:orderId', loginRequired, async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const reviews = await reviewService.getReviewsByOrder(orderId);
    res.status(200).json({
      status: 200,
      message: '해당 주문 리뷰 목록 조회 성공',
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
});

// 유저 ID로 조회
reviewRouter.get('/user/:userId', loginRequired, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (userId !== req.currentUserId) {
      throw new customError(401, 'Unauthorized');
    }
    const reviews = await reviewService.getReviewsByUser(userId);
    res.status(200).json({
      status: 200,
      message: '유저 리뷰 목록 조회 성공',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

reviewRouter.patch('/:reviewId', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const { reviewId } = req.params;
    const { comment, image, score } = req.body;
    const review = await reviewService.getReview(reviewId);
    if (review.userId !== userId) {
      throw new customError(401, 'Unauthorized');
    }

    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    const toUpdate = {
      ...(comment && { comment }),
      ...(image && { image }),
      ...(score && { score }),
    };

    const updatedReview = await reviewService.setReview(reviewId, toUpdate);
    res.status(201).json({
      status: 201,
      message: '리뷰 업데이트 완료',
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
});

reviewRouter.delete('/:reviewId', loginRequired, async (req, res, next) => {
  try {
    const userId = req.currentUserId;

    const { reviewId } = req.params;
    const review = await reviewService.getReview(reviewId);
    if (!review || review === undefined || review === null) {
      throw new customError(404, 'Not found Error');
    }
    if (review.userId !== userId) {
      throw new customError(401, 'Unauthorized');
    }
    const deletedReview = await reviewService.deleteReview(reviewId);
    let order = await orderService.getOrder(review.orderId);
    order.products.forEach((product) => {
      if (product.productId === review.productId) {
        product.reviewed = false;
      }
    });
    await orderService.setOrder(review.orderId, order);

    res.status(201).json({
      status: 200,
      message: '리뷰 삭제 완료',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

export { reviewRouter };
