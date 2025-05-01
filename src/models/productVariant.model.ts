import mongoose, { InferSchemaType, Schema } from 'mongoose'

const productVariantSchema = new Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true,
        },
        variant_name: {
            type: String,
            required: true,
        },
        variant_color: String,
        variant_description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            min: 0,
        },
        discount: {
            type: Number,
            min: 0,
            max: 0.5,
        },
        quantity: {
            type: Number,
            min: 0
        },
        images_url: [String],
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
