import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessUser',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessUser',
      required: true,
    },
    collaborationType: {
      type: String,
      required: [true, 'Please specify collaboration type'],
      enum: [
        'Joint Marketing',
        'Cross Promotion',
        'Resource Sharing',
        'Event Partnership',
        'Product Bundling',
        'Other',
      ],
    },
    message: {
      type: String,
      required: [true, 'Please provide collaboration details'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    responseMessage: {
      type: String,
      trim: true,
      default: '',
    },
    responseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

export default Collaboration;