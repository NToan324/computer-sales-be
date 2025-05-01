import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discount_amount: Number,
        usage_count: {
            type: Number,
            default: 0,
        },
        usage_limit: {
            type: Number,
            min: 1,
            max: 10,
        },
    },
    { timestamps: true }
)

const CouponModel = mongoose.model('coupons', couponSchema)
type Coupon = InferSchemaType<typeof couponSchema>
export default CouponModel
export type { Coupon }
