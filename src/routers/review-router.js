import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { reviewService } from '../services';

const reviewRouter = Router();

reviewRouter.get('/', async (req, res, next) => {
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

reviewRouter.get('/:productId', async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(productId);

    res.status(200).json({
      status: 200,
      message: '해당 상품 리뷰 목록 조회 성공',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

reviewRouter.get('/:userId', async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(userId);
    res.status(200).json({
      status: 200,
      message: '유저 리뷰 목록 조회 성공',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

export { reviewRouter };
