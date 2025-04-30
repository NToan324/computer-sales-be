import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponUsageSchema = new Schema({
    coupon_code: {
        type: String,
        ref: 'coupons',
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
    },
    used_at: Date,
})

const CouponUsageModel = mongoose.model('coupon_usages', couponUsageSchema)
type CouponUsage = InferSchemaType<typeof couponUsageSchema>
export default CouponUsageModel
export type { CouponUsage }
