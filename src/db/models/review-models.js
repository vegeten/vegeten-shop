import { model } from 'mongoose';
import { ReviewsSchema } from '../schemas/reviews-schema';
const Review = model('reviews', ReviewsSchema);
export class ReviewsModel {
  async findAll() {
    return await Review.find({}).sort({ createdAt: -1 });
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
const reviewModel = new reviewModel();
export { reviewModel };
