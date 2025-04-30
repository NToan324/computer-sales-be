import mongoose, { InferSchemaType, Schema } from 'mongoose'

const orderSchema = new Schema(
    {
        user_id: { type: String, ref: 'users' },
        address: String,
        total_amount: Number,
        items: [
            {
                product_id: { type: String, ref: 'products' },
                quantity: Number,
                price: Number,
            },
        ],
        discount_amount: Number,
        loyalty_points_earned: Number,
    },
    { timestamps: { createdAt: 'created_at' } }
)

const Order = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>
export default Order
export type { Order }
