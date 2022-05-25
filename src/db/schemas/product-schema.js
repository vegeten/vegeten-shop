import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    category: {
      // type: Schema.Types.ObjectId,
      // ref: "Category",
      type: String,
      required: true,
    },
  },
  {
    collection: "products",
  }
);

export { ProductSchema };
