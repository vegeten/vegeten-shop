import { model } from 'mongoose';
import { ReviewSchema } from '../schemas/review-schema';
const Review = model('reviews', ReviewSchema);
export class ReviewModel {
  async findAll() {
    return await Review.find({});
  }
  async findByUser(userId) {
    return await Review.find({ userId: userId });
  }
  async findByProduct(productId) {
    return await Review.find({ productId: productId });
  }
  async findById(reviewId) {
    return await Review.findOne({ shortId: reviewId });
  }
  async create(reviewsInfo) {
    return await Review.create(reviewsInfo);
  }
  async delete(reviewId) {
    return await Review.findOneAndDelete({ reviewId: shortId });
  }
}
const reviewModel = new ReviewModel();
export { reviewModel };
