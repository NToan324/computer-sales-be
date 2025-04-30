import mongoose, { InferSchemaType, Schema } from 'mongoose'

const productVariantSchema = new Schema(
    {
        variant_name: String,
        variant_color: String,
        variant_description: String,
        price: Number,
        discount: Number,
        quantity: Number,
        product_id: { type: String, ref: 'products' },
        isActive: Boolean,
    },
    { timestamps: { createdAt: 'created_at' } }
)

const ProductVariant = mongoose.model('product_variants', productVariantSchema)
type ProductVariant = InferSchemaType<typeof productVariantSchema>
export default ProductVariant
export type { ProductVariant }
