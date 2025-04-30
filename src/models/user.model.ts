import mongoose, { InferSchemaType, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'CUSTOMER'],
      default: 'CUSTOMER'
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, saltRounds)
  }
  next()
})

const user = mongoose.model('user', userSchema)
type User = InferSchemaType<typeof userSchema>

export default user
export type { User }
