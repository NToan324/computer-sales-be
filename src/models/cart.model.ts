import mongoose, { InferSchemaType, Schema } from 'mongoose'

const cartSchema = new Schema(
    {
        user_id: { type: String, ref: 'users' },
    },
    { timestamps: { createdAt: 'created_at' } }
)

const Cart = mongoose.model('carts', cartSchema)
type Cart = InferSchemaType<typeof cartSchema>
export default Cart
export type { Cart }
