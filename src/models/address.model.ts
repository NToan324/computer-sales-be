import mongoose, { InferSchemaType, Schema } from "mongoose";

const addressSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const address = mongoose.model("address", addressSchema);
type Address = InferSchemaType<typeof addressSchema>;
    
export default address;
export type { Address };
