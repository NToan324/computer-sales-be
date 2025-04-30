import mongoose, { InferSchemaType, Schema } from 'mongoose'

const addressSchema = new Schema({
    user_id: { type: String, ref: 'users' },
    address: { type: String, required: true },
})

const Address = mongoose.model('addresses', addressSchema)
type Address = InferSchemaType<typeof addressSchema>
export default Address
export type { Address }
