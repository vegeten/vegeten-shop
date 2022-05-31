import { reviewModel } from '../db';
class ReviewService {
  constructor(reviewModel) {
    this.reviewModel = reviewModel;
  }

  async getReviewlist() {
    const reviews = await this.reviewModel.findAll();
    return reviews;
  }

  async getReviewsByUser(userId) {
    const reviews = await this.reviewModel.findByUser(userId);
    if (!userId || userId === null) {
      const e = new Error('user not found');
      e.status = 404;
      throw e;
    }
    return reviews;
  }

  async getReviewsByProduct(userId) {
    const reviews = await this.reviewModel.findByProduct(productId);
    if (!productId || productId === null) {
      const e = new Error('product not found');
      e.status = 404;
      throw e;
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
      const e = new Error('해당 리뷰의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }
  }

  async deleteReview(reviewId) {
    let review = await this.reviewModel.delete(reviewId);
    if (!order || order === null) {
      const e = new Error('해당 리뷰의 id가 없습니다. 다시 한 번 확인해 주세요.');
      e.status = 404;
      throw e;
    }
    return review;
  }
}
const reviewService = new ReviewService(reviewModel);
export { reviewService };
