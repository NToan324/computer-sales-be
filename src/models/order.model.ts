import mongoose, { InferSchemaType, Schema } from 'mongoose'
const orderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    items: [
      {
        variant_code: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        unit_price: {
          type: Number
        }
      }
    ],
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Canceled', 'Shipping'],
      required: true,
      default: 'Pending'
    },
    total_price: {
      type: Number,
      required: true
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'VNPay'],
      default: 'Cash'
    },
  },
  { timestamps: true }
)
const order = mongoose.model('orders', orderSchema)
type Order = InferSchemaType<typeof orderSchema>

export default order
export type { Order }
