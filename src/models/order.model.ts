import mongoose, { InferSchemaType, Schema } from 'mongoose'

const orderSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        user_name: {
            type: String,
        },
        coupon_code: {
            type: String,
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
                product_variant_name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    min: 1,
                },
                price: {
                    type: Number,
                    min: 0,
                },
                discount: {
                    type: Number,
                    min: 0,
                    max: 0.5,
                    default: 0,
                },
                images: {
                    url: {
                        type: String,
                        required: true,
                    }
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
        payment_method: {
            type: String,
            enum: ['CASH', 'CREDIT_CARD', 'VNPay'],
            required: true,
        },
        payment_status: {
            type: String,
            enum: ['PENDING', 'PAID', 'FAILED'],
            default: 'PENDING',
        },
        order_tracking: [
            {
                status: {
                    type: String,
                    enum: ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'],
                    default: 'PENDING',
                    required: true,
                },
                updated_at: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
)

const OrderModel = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>
export default OrderModel
export type { Order }
