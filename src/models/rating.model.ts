import mongoose, { InferSchemaType, Schema } from 'mongoose'

const ratingSchema = new Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product_variants',
        },
    },
    { timestamps: true }
)

const RatingModel = mongoose.model('ratings', ratingSchema)
type Rating = InferSchemaType<typeof ratingSchema>
export default RatingModel
export type { Rating }
