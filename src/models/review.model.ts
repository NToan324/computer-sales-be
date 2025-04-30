import mongoose, {InferSchemaType, Schema} from "mongoose";

const reviewSchema = new Schema(
    {
        variant_code: {
            type: String,
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: false,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const review = mongoose.model("review", reviewSchema);
type Review = InferSchemaType<typeof reviewSchema>;

export default review;
export type {Review};
