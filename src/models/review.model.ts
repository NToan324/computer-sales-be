import mongoose, { InferSchemaType, Schema } from 'mongoose'

const reviewSchema = new Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        content: String,
    },
    { timestamps: true }
)

const ReviewModel = mongoose.model('reviews', reviewSchema)
type Review = InferSchemaType<typeof reviewSchema>
export default ReviewModel
export type { Review }
