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
<<<<<<< HEAD
        enum: ["PENDING", "PAID", "FAIL"],
=======
        enum: ["PENDING", "PAID", "FAILED"],
>>>>>>> fef5ac3054e1b060efdb8798ca1f7c45e37ce7a9
        default: "PENDING",
    },
  },
  { timestamps: true }
);