import mongoose, { InferSchemaType, Schema } from 'mongoose'

const productSchema = new Schema(
  {
    product_code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      required: true
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brand',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
)

const product = mongoose.model('product', productSchema)
type Product = InferSchemaType<typeof productSchema>
export default product
export type { Product }
