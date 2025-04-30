import { url } from "inspector";
import mongoose, { InferSchemaType, Schema } from "mongoose";

const productVariantSchema = new Schema(
{
    variant_code: {
        type: String,
        required: true,
    },
    variant_name: {
        type: String,
        required: true,
    },
    variant_color: {
        type: String,
    },
    variant_description: {
        type: String,
        required: true,
    },
    variant_images: [
        {
            url: {
                type: String,
                required: true,
            }
        }
    ],
    price: {
        type: Number,
        required: true,
    }, 
    discount_price: {
        type: Number,
        default: 0,
    },    
    stock_quantity: {
        type: Number,
        required: true,
    },
    product_code: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
  },
  { timestamps: true }
);

const productVariant = mongoose.model("product_variant", productVariantSchema);
type ProductVariant = InferSchemaType<typeof productVariantSchema>;

export default productVariant;
export type { ProductVariant };