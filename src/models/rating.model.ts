import mongoose, { InferSchemaType, Schema } from 'mongoose'

const ratingSchema = new Schema(
    {
        rating: Number,
        user_id: { type: String, ref: 'users' },
        product_id: { type: String, ref: 'products' },
    },
    { timestamps: { createdAt: 'created_at' } }
)

const Rating = mongoose.model('ratings', ratingSchema)
type Rating = InferSchemaType<typeof ratingSchema>
export default Rating
export type { Rating }
