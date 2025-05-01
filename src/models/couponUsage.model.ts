import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponUsageSchema = new Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
    },
},
    { timestamps: true, }
)

const CouponUsageModel = mongoose.model('coupon_usages', couponUsageSchema)
type CouponUsage = InferSchemaType<typeof couponUsageSchema>
export default CouponUsageModel
export type { CouponUsage }
