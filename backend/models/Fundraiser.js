import mongoose from 'mongoose';

const fundraiserSchema = new mongoose.Schema(
  {
    businessOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessUser',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a fundraiser title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a fundraiser description'],
      trim: true,
    },
    goalAmount: {
      type: Number,
      required: [true, 'Please specify the fundraising goal'],
      min: [1000, 'Goal amount must be at least ₹1000'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    purpose: {
      type: String,
      required: [true, 'Please specify the purpose of funds'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Please specify campaign duration in days'],
      min: 7,
      max: 90,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    supporters: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'NormalUser',
        },
        amount: {
          type: Number,
          required: true,
        },
        message: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate end date before saving
fundraiserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.endDate = new Date(Date.now() + this.duration * 24 * 60 * 60 * 1000);
  }
  next();
});

const Fundraiser = mongoose.model('Fundraiser', fundraiserSchema);

export default Fundraiser;