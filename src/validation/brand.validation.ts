import z from 'zod'

export class BrandValidation {
  static createBrand() {
    return {
      body: z.object({
        brand_name: z.string().nonempty('Tên thương hiệu không được để trống'),
        country: z.string().optional(),
        logo_url: z.string().optional()
      })
    }
  }

  static updateBrand() {
    return {
      body: z.object({
        brand_name: z.string().optional(),
        brand_image: z.string().optional(),
        country: z.string().optional(),
        logo_url: z.string().optional()
      })
    }
  }
}
