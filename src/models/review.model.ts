import mongoose, { InferSchemaType, Schema } from 'mongoose'

const reviewSchema = new Schema(
    {
        product_id: { type: String, ref: 'products' },
        user_id: { type: String, ref: 'users' },
        content: String,
    },
    { timestamps: { createdAt: 'created_at' } }
)

const Review = mongoose.model('reviews', reviewSchema)
type Review = InferSchemaType<typeof reviewSchema>
export default Review
export type { Review }
