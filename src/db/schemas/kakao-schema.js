import { Schema } from 'mongoose';
const shortId = require('./types/short-id');

const KakaoSchema = new Schema(
  {},
  {
    timestamps: true,
    collation: 'kakao-users',
  }
);

export { KakaoSchema };
