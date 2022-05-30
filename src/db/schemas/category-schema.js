import { Schema } from 'mongoose';
const shortId = require('./types/short-id');

const CategorySchema = new Schema(
  {
    shortId,
    label: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'categories',
  }
);

export { CategorySchema };
