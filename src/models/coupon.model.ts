import mongoose, { InferSchemaType, Schema } from 'mongoose'

const couponSchema = new Schema(
    {
        name: {
            type: String,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discount_amount: Number,
        usage_count: {
            type: Number,
            default: 0,
        },
        usage_limit: {
            type: Number,
            min: 1,
            max: 10,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
            validate: {
                validator: function (this: any) {
                    return this.end_date > this.start_date
                },
                message: 'End date must be after start date',
            },
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'EXPIRED'],
            default: 'ACTIVE',
        },
    },
    { timestamps: true }
)

const CouponModel = mongoose.model('coupons', couponSchema)
type Coupon = InferSchemaType<typeof couponSchema>
export default CouponModel
export type { Coupon }
