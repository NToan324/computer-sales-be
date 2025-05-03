import z from 'zod'

export class BrandValidation {
  static createBrand() {
    return {
      body: z.object({
        brand_name: z.string().nonempty('Tên thương hiệu không được để trống'),
        brand_image: z.object({
          url: z.string().nonempty('URL không được để trống'),
          public_id: z.string()
        }),
      })
    }
  }

  static updateBrand() {
    return {
      body: z.object({
        brand_name: z.string().nonempty('Tên thương hiệu không được để trống').optional(),
        brand_image: z.object({
          url: z.string().nonempty('URL không được để trống'),
          public_id: z.string()
        }).optional(),
      })
    }
  }
}
