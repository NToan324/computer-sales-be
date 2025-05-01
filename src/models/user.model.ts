import mongoose, { InferSchemaType, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
<<<<<<< HEAD
        phone: {
            type: String,
            unique: true,
            required: true,
        },
=======
>>>>>>> fef5ac3054e1b060efdb8798ca1f7c45e37ce7a9
        fullname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
<<<<<<< HEAD
=======
        phone: {
            type: String,
            required: false,
        },
>>>>>>> fef5ac3054e1b060efdb8798ca1f7c45e37ce7a9
        role: {
            type: String,
            enum: ['CUSTOMER', 'ADMIN'],
            default: 'CUSTOMER',
        },
        loyalty_points: {
            type: Number,
            default: 0,
            min: 0,
         },

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
