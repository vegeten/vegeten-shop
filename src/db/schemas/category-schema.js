import { Schema } from "mongoose";

const CategorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
});

export { CategorySchema };
