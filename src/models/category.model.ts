import mongoose, { InferSchemaType, Schema } from 'mongoose'

const categorySchema = new Schema(
    {
        category_name: { type: String, required: true },
        category_description: String,
        isActive: Boolean,
    },
    { timestamps: { createdAt: 'created_at' } }
)

const Category = mongoose.model('categories', categorySchema)
type Category = InferSchemaType<typeof categorySchema>
export default Category
export type { Category }
