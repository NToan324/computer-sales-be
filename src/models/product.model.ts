import mongoose, { InferSchemaType, Schema } from 'mongoose'

const productSchema = new Schema(
    {
        //code for product to use easily in the system
        code: {
            type: String,
            required: true,
            unique: true,
        },
        product_name: {
            type: String,
            required: true,
        },
        brand_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'brands',
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const ProductModel = mongoose.model('products', productSchema)
type Product = InferSchemaType<typeof productSchema>
export default ProductModel
export type { Product }
