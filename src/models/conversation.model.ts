import mongoose, {InferSchemaType, Schema} from "mongoose";

const conversationSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        last_message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message", 
            required: true,
        },
    },
    {timestamps: true}
);

const conversation = mongoose.model("conversation", conversationSchema);
type Conversation = InferSchemaType<typeof conversationSchema>;

export default conversation;
export type {Conversation};
