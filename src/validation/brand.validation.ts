import z from 'zod'

export class BrandValidation {
  static createBrand() {
    return {
      body: z.object({
        brand_name: z.string().nonempty('Tên thương hiệu không được để trống'),
        brand_image: z.object({
          url: z.string().url('Invalid image URL').nonempty('Image URL is required'),
          public_id: z.string().optional()
        }),
      }).strict('Invalid field')
    }
  }

  static updateBrand() {
    return {
      body: z.object({
        brand_name: z.string().nonempty('Tên thương hiệu không được để trống').optional(),
        brand_image: z.object({
          url: z.string().url('Invalid image URL').nonempty('Image URL is required'),
          public_id: z.string()
        }).optional(),
      }).strict('Invalid field')
    }
  }
  static searchBrand() {
    return {
      query: z.object({
        name: z.string(),
      }).strict('Invalid field')
    }
  }
}
