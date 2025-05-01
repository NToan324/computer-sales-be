import mongoose, { InferSchemaType, Schema } from 'mongoose'

const reviewSchema = new Schema(
    {
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product_variants',
            required: false,
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
