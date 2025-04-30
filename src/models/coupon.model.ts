import mongoose, { Schema, InferSchemaType } from 'mongoose';

const couponSchema = new Schema(
    {
        coupon_code: {
            type: String,
            required: true,
            unique: true,
        },
        discount_value: {
            type: Number,
            required: true,
        },
        usage_limit: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true
    }
);

const coupon = mongoose.model('coupon', couponSchema);
type Coupon = InferSchemaType<typeof couponSchema>;

export default coupon;
export type { Coupon };