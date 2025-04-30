import mongoose, { InferSchemaType, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
        },
        fullname: String,
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['CUSTOMER', 'ADMIN'],
            default: 'CUSTOMER',
        },
        loyalty_points: Number,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: { createdAt: 'created_at' } }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (err) {
        next(err as Error)
    }
})

const UserModel = mongoose.model('users', userSchema)
type User = InferSchemaType<typeof userSchema>
export default UserModel
export type { User }
