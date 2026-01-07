import mongoose from 'mongoose';
import User from './User.js';

const normalUserSchema = new mongoose.Schema({
  location: {
    type: String,
    trim: true,
    default: '',
  },
  interests: {
    type: [String],
    enum: [
      'Food & Beverage',
      'Retail & Shopping',
      'Services',
      'Handicrafts',
      'Agriculture',
      'Manufacturing',
      'Technology',
      'Healthcare',
      'Education',
      'Other',
    ],
    default: [],
  },
  savedBusinesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessUser',
    },
  ],
  donationHistory: [
    {
      fundraiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fundraiser',
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const NormalUser = User.discriminator('normal', normalUserSchema);

export default NormalUser;