import mongoose, { InferSchemaType, Schema } from 'mongoose'

const brandSchema = new Schema({
    brand_name: { type: String, required: true },
    brand_imageURL: String,
    isActive: Boolean,
})

const Brand = mongoose.model('brands', brandSchema)
type Brand = InferSchemaType<typeof brandSchema>
export default Brand
export type { Brand }
