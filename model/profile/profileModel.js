import { User } from '../../model/user/userModel.js';
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    customerId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);
