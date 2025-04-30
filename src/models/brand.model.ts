import mongoose, { InferSchemaType, Schema } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    logo_url: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const brand = mongoose.model('brand', brandSchema);
type Brand = InferSchemaType<typeof brandSchema>;
export default brand;
export type { Brand };