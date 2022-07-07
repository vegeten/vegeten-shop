import { Schema } from 'mongoose';
const shortId = require('./types/short-id');

const ReviewSchema = new Schema(
  {
    shortId,
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: null,
    },
    score: {
      type: Number,
      required: false,
      default: 5,
    },
  },
  {
    collection: 'reviews',
    timestamps: true,
  }
);

export { ReviewSchema };
