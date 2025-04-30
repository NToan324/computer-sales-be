import mongoose, { InferSchemaType, Schema } from 'mongoose'

const orderSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        address: String,
        total_amount: Number,
        items: [
            {
                product_variant_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product_variants',
                },
                quantity: Number,
                price: Number,
            },
        ],
        discount_amount: Number,
        loyalty_points_earned: Number,
    },
    { timestamps: true }
)

const OrderModel = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>
export default OrderModel
export type { Order }
