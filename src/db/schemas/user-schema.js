import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: new Schema(
        {
          postalCode: {
            type: String,
            required: false,
            default: null,
          },
          address1: {
            type: String,
            required: false,
            default: null,
          },
          address2: {
            type: String,
            required: false,
            default: null,
          },
        },
        {
          _id: false,
        }
      ),
      required: false,
      default: {},
    },
    role: {
      type: String,
      required: false,
      default: 'basic-user',
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export { UserSchema };
