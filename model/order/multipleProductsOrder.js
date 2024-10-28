import mongoose from 'mongoose';
const multipleProductsOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orders: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          min: 1,
          required: true
        },
        price: {
          type: Number,
          min: 0
        },
        name: {
          type: String,
          trim: true
        },
        status: {
          type: String,
          enum: ['pending', 'completed', 'canceled'],
          default: 'pending'
        }
      }
    ],
    chargeId: { type: String, required: true },
    finalPrice: {
      type: Number
    }
  },
  { timestamps: true }
);

export const MultipleProductsOrder = mongoose.model(
  'MultipleProductsOrder',
  multipleProductsOrderSchema
);
