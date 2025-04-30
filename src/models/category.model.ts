import mongoose, { InferSchemaType, Schema } from 'mongoose'

const categorySchema = new Schema(
    {
        category_name: {
            type: String,
            required: true,
        },
        category_description: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const CategoryModel = mongoose.model('categories', categorySchema)
type Category = InferSchemaType<typeof categorySchema>
export default CategoryModel
export type { Category }
