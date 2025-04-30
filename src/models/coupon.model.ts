import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discount_amount: Number,
        usage_count: Number,
        usage_limit: Number,
    },
    { timestamps: true }
)

const CouponModel = mongoose.model('coupons', couponSchema)
type Coupon = InferSchemaType<typeof couponSchema>
export default CouponModel
export type { Coupon }
