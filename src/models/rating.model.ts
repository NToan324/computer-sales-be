import mongoose, { InferSchemaType, Schema } from 'mongoose'

const ratingSchema = new Schema(
    {
        rating: Number,
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
        },
    },
    { timestamps: true }
)

const RatingModel = mongoose.model('ratings', ratingSchema)
type Rating = InferSchemaType<typeof ratingSchema>
export default RatingModel
export type { Rating }
