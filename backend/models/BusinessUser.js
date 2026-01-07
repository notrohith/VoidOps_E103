import mongoose from 'mongoose';
import User from './User.js';

const businessProfileSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [true, 'Please provide your business name'],
    trim: true,
  },
  businessType: {
    type: String,
    required: [true, 'Please select your business type'],
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
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide your city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide your state'],
      trim: true,
    },
  },
  yearsInOperation: {
    type: Number,
    min: 0,
    default: 0,
  },
  weeklyTime: {
    type: Number,
    required: [true, 'Please specify weekly hours available'],
    min: 1,
    max: 168,
  },
  monthlyBudget: {
    type: Number,
    required: [true, 'Please specify monthly marketing budget'],
    min: 0,
  },
  teamSize: {
    type: Number,
    required: [true, 'Please specify team size'],
    min: 1,
  },
  techComfort: {
    type: Number,
    required: [true, 'Please rate your technical comfort'],
    min: 1,
    max: 5,
  },
  primaryGoal: {
    type: String,
    required: [true, 'Please select your primary goal'],
    enum: ['Increase Visibility', 'Boost Sales', 'Build Foundation'],
  },
});

const businessUserSchema = new mongoose.Schema({
  businessProfile: {
    type: businessProfileSchema,
    required: true,
  },
  growthPlan: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  lastPlanUpdate: {
    type: Date,
    default: null,
  },
});

const BusinessUser = User.discriminator('business', businessUserSchema);

export default BusinessUser;