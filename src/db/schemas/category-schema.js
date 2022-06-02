import { Schema } from 'mongoose';
const shortId = require('./types/short-id');

const CategorySchema = new Schema(
  {
    shortId,
    label: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: false,
      default: 'active', //활성화
    },
  },
  {
    collection: 'categories',
  }
);

export { CategorySchema };
