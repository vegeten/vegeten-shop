import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, adminAuth } from '../middlewares';
import { reviewService, userService } from '../services';
import jwt from 'jsonwebtoken';
import { json } from 'express/lib/response';

const reviewRouter = Router();

reviewRouter.post('/:productId', loginRequired, async (req, res, next) => {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error('headers의 Content-Type을 application/json으로 설정해주세요');
    }
    const { productId } = req.params;
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);
    const { fullName } = user;

    const { comment, image, score } = req.body;
    const reviewInfo = {
      userId: userId,
      fullName: fullName,
      productId: productId,
      comment: comment,
      image: image,
      score: score,
    };
    const addedReview = await reviewService.addReview(reviewInfo);
    res.status(201).json({
      status: 201,
      message: '리뷰 추가 성공',
      data: addedReview,
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
    const reviews = await reviewService.getReviewsByProduct(productId);
    let totalScore = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalScore += reviews[i].score;
    }
    let averageScore = totalScore / reviews.length;
    res.status(200).json({
      status: 200,
      message: '해당 상품 리뷰 목록 조회 성공',
      data: { reviews, currentUserId, totalScore, averageScore },
    });
  } catch (error) {
    next(error);
  }
});

reviewRouter.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
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
      const e = new Error('자신의 리뷰만 수정할 수 있습니다.');
      e.status = 500;
      throw e;
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
    if (review.userId !== userId) {
      const e = new Error('자신의 리뷰만 삭제할 수 있습니다.');
      e.status = 500;
      throw e;
    }
    const deletedReview = await reviewService.deleteReview(reviewId);
    res.status(201).json({
      status: 200,
      message: '리뷰 삭제 완료',
    });
  } catch (error) {
    next(error);
  }
});

export { reviewRouter };
