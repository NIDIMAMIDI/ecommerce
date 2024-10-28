import mongoose from 'mongoose';
const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
