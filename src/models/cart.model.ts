import mongoose, { InferSchemaType, Schema } from 'mongoose'

const cartSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
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
    },
    { timestamps: true }
)

const CartModel = mongoose.model('carts', cartSchema)
type Cart = InferSchemaType<typeof cartSchema>
export default CartModel
export type { Cart }
