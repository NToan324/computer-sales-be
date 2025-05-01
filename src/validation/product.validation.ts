import z from 'zod'

class ProductValidation {
    createProduct() {
        return {
            body: z.object({
                product_name: z.string().min(1, 'Product name is required'),
                brand_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand_id')
                    .optional(),
                category_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category_id')
                    .optional(),
                isActive: z.boolean().optional(),
            }),
        }
    }

    // Schema dùng để cập nhật sản phẩm
    updateProduct() {
        return {
            body: z.object({
                product_name: z.string().min(1).optional(),
                brand_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand_id')
                    .optional(),
                category_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category_id')
                    .optional(),
                isActive: z.boolean().optional(),
            }),
        }
    }
}

const productValidation = new ProductValidation()
export default productValidation
