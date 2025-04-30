import mongoose, { InferSchemaType, Schema } from 'mongoose'

const userSchema = new Schema(
    {
        email: { type: String, unique: true },
        fullname: String,
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['CUSTOMER', 'ADMIN'],
            default: 'CUSTOMER',
        },
        loyalty_points: Number,
        isActive: Boolean,
    },
    { timestamps: { createdAt: 'created_at' } }
)

const User = mongoose.model('users', userSchema)
type User = InferSchemaType<typeof userSchema>
export default User
export type { User }
