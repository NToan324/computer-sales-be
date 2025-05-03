import z from 'zod'

export class CategoryValidation {
  static createCategory() {
    return {
      body: z.object({
        category_name: z.string().nonempty('Tên danh mục không được để trống'),
        category_description: z.string().optional()
      })
    }
  }

  static updateCategory() {
    return {
      body: z.object({
        category_name: z.string().optional(),
        category_description: z.string().optional()
      })
    }
  }
}
