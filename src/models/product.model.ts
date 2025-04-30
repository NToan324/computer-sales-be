import mongoose, { InferSchemaType, Schema } from 'mongoose'

const productSchema = new Schema(
    {
        product_name: { type: String, required: true },
        brand_id: { type: String, ref: 'brands' },
        category_id: { type: String, ref: 'categories' },
        isActive: Boolean,
    },
    { timestamps: { createdAt: 'created_at' } }
)

const Product = mongoose.model('products', productSchema)
type Product = InferSchemaType<typeof productSchema>
export default Product
export type { Product }
