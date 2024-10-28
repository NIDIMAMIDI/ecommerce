import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: [String],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    description: {
      type: String
    }
  },
  { timestamps: true }
);
export const Product = mongoose.model('Product', productSchema);
