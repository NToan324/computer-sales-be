import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponUsageSchema = new Schema({
    coupon_code: { type: String, ref: 'coupons' },
    order_id: { type: String, ref: 'orders' },
    used_at: Date,
})

const CouponUsage = mongoose.model('coupon_usages', couponUsageSchema)
type CouponUsage = InferSchemaType<typeof couponUsageSchema>
export default CouponUsage
export type { CouponUsage }
