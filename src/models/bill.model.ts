import mongoose, { InferSchemaType, Schema } from "mongoose";

const billSchema = new Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["cash", "credit_card", "VNPay"],
      required: true,
    },
    payment_status: {
        type: String,
        enum: ["PENDING", "PAID", "FAIL"],
        default: "PENDING",
    },
  },
  { timestamps: true }
);