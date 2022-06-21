import { reviewModel } from '../db';
import { customError } from '../middlewares/error/customError';

class ReviewService {
  constructor(reviewModel) {
    this.reviewModel = reviewModel;
  }

  async getReview(reviewId) {
    return await this.reviewModel.findById(reviewId);
  }
  async getReviewlist() {
    const reviews = await this.reviewModel.findAll();

    return reviews;
  }

  async getReviewsByUser(userId) {
    const reviews = await this.reviewModel.findByUser(userId);
    if (!userId || userId === null) {
      throw new customError(404, '해당 id의 유저가 없습니다. 다시 한 번 확인해주세요.');
    }
    return reviews;
  }

  async getReviewsByProduct(productId) {
    const reviews = await this.reviewModel.findByProduct(productId);
    if (!productId || productId === null) {
      throw new customError(404, '해당 id의 상품이 없습니다. 다시 한 번 확인해주세요.');
    }
    return reviews;
  }

  async getReviewsByOrder(orderId) {
    const reviews = await this.reviewModel.findByOrder(orderId);
    if (!orderId || orderId === null) {
      throw new customError(404, '해당 id의 주문이 없습니다. 다시 한 번 확인해주세요.');
    }
    return reviews;
  }

  async addReview(reviewInfo) {
    const createdNewReview = await this.reviewModel.create(reviewInfo);
    return createdNewReview;
  }

  async setReview(reviewId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let review = await this.reviewModel.findById(reviewId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!review || review == null) {
      throw new customError(404, '해당 id의 리뷰가 없습니다. 다시 한 번 확인해주세요.');
    }
    return await this.reviewModel.update({
      reviewId,
      update: toUpdate,
    });
  }

  async deleteReview(reviewId) {
    let review = await this.reviewModel.delete(reviewId);
    if (!review || review === null) {
      throw new customError(404, '해당 id의 리뷰가 없습니다. 다시 한 번 확인해주세요.');
    }
    return review;
  }
}
const reviewService = new ReviewService(reviewModel);
export { reviewService };
