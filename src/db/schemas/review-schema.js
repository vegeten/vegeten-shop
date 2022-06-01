import { Schema } from 'mongoose';
const shortId = require('./types/short-id');

const ReviewSchema = new Schema(
  {
    shortId,
    userId: {
      type: String,
      required: true,
    },
    productId: {
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
  },
  {
    collection: 'reviews',
    timestamps: true,
  }
);

export { ReviewSchema };
