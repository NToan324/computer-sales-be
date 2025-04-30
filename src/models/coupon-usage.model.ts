import mongoose, { InferSchemaType, Schema } from "mongoose";

const couponUsageSchema = new Schema(
    {
        coupon_code: {
            type: String,
            required: true,
        },
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
            required: true,
        },
    },
    { timestamps: true }
);

const couponUsage = mongoose.model("coupon_usage", couponUsageSchema);
type CouponUsage = InferSchemaType<typeof couponUsageSchema>;

export default couponUsage;
export type { CouponUsage };