import mongoose, { InferSchemaType, Schema } from 'mongoose'

const orderSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        coupon_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'coupons',
        },
        address: {
            type: String,
            required: true,
        },
        total_amount: Number,
        items: [
            {
                product_variant_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product_variants',
                },
                quantity: {
                    type: Number,
                    min: 1,
                },
                price: {
                    type: Number,
                    min: 0,
                },
            },
        ],
        discount_amount: {
            type: Number,
            min: 0,
            default: 0,
        },
        loyalty_points_earned: {
            type: Number,
        },
        status: {
            type: String,
            enum: [
                'PENDING',
                'SHIPPING',
                'DELIVERED',
                'CANCELLED',
            ],
            default: 'PENDING',
        },
    },
    { timestamps: true }
)

const OrderModel = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>
export default OrderModel
export type { Order }
