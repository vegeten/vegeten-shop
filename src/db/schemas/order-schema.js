import { Schema } from 'mongoose';
import { ProductSchema } from './product-schema';
// 주문 정보 - db에 배송지 정보, 주문 총액, 수령자 이름 및 연락처가 저장된다.
const OrderSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    products: {
      type: Object,
      required: false,
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

export { OrderSchema };
