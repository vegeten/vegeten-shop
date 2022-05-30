import mongoose, { Schema } from 'mongoose';
const shortId = require('./types/short-id');

// 주문 정보 - db에 배송지 정보, 주문 총액, 수령자 이름 및 연락처가 저장된다.
const OrderSchema = new Schema(
  {
    shortId,
    address: {
      type: new Schema(
        {
          postalCode: String,
          address1: String,
          address2: String,
        },
        {
          _id: false,
        }
      ),
      required: true,
      default: {},
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    products: {
      type: Object,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // 유저 _id 만 가져오기위해 User 스키마와 연동
    userId: {
      type: String,
      ref: 'users',
      required: true,
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

export { OrderSchema };
