import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponSchema = new Schema(
    {
        code: {
            type: String,
            match: /^[A-Z0-9]{5}$/,
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
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    { timestamps: true, _id: false }
)

const CouponModel = mongoose.model('coupons', couponSchema)
type Coupon = InferSchemaType<typeof couponSchema>
export default CouponModel
export type { Coupon }
