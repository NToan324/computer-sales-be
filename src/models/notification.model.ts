import mongoose, { InferSchemaType, Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    type: {
        type: String,
        enum: ['ORDER', 'MESSAGE', 'SYSTEM', 'PROMOTION'],
        required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);