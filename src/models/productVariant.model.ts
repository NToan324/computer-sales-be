import mongoose, { InferSchemaType, Schema } from 'mongoose'

const productVariantSchema = new Schema(
    {
        variant_name: String,
        variant_color: String,
        variant_description: String,
        price: Number,
        discount: Number,
        quantity: Number,
        product_id: {
            type: String,
            ref: 'products',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const ProductVariantModel = mongoose.model(
    'product_variants',
    productVariantSchema
)
type ProductVariant = InferSchemaType<typeof productVariantSchema>
export default ProductVariantModel
export type { ProductVariant }
