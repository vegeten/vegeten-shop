import { model } from 'mongoose';
import { ReviewSchema } from '../schemas/review-schema';
const Review = model('reviews', ReviewSchema);
export class ReviewModel {
  async findAll() {
    return await Review.find({}).sort({ createdAt: -1 });
  }
  async findByUser(userId) {
    return await Review.find({ userId: userId }).sort({ createdAt: -1 });
  }
  async findByProduct(productId) {
    return await Review.find({ productId: productId }).sort({ createdAt: -1 });
  }
  async findById(reviewId) {
    return await Review.findOne({ shortId: reviewId });
  }
  async create(reviewsInfo) {
    return await Review.create(reviewsInfo);
  }

  async update({ reviewId, update }) {
    const option = { returnOriginal: false };
    return await Review.findOneAndUpdate({ shortId: reviewId }, update, option);
  }
  async delete(reviewId) {
    return await Review.findOneAndDelete({ shortId: reviewId });
  }
}
const reviewModel = new ReviewModel();
export { reviewModel };
