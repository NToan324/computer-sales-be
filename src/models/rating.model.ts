import mongoose, { InferSchemaType, Schema } from "mongoose";

const ratingSchema = new Schema(
    {
        variant_code: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const rating = mongoose.model("rating", ratingSchema);
type Rating = InferSchemaType<typeof ratingSchema>;

export default rating;
export type { Rating };
    