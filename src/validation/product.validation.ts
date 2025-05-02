import z from 'zod'

export class ProductValidation {
    // Schema dùng để tạo sản phẩm chính
    static createProduct() {
        return {
            body: z.object({
                product_name: z.string().min(1, 'Product name is required'),
                brand_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand_id'),
                category_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category_id'),
                product_image: z.object({
                    url: z.string().url('Invalid image URL'),
                    public_id: z.string().optional(),
                }),
            }),
        }
    }

    // Schema dùng để cập nhật sản phẩm
    static updateProduct() {
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
                product_image: z.object({
                    url: z.string().url('Invalid image URL'),
                    public_id: z.string().optional(),
                }),
            }),
        }
    }

    // Schema dùng để tạo sản phẩm biến thể
    static createProductVariant() {
        return {
            body: z.object({
                product_id: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid product_id'),
                variant_name: z.string().min(1, 'Variant name is required'),
                variant_color: z.string().optional(),
                variant_description: z
                    .string()
                    .min(1, 'Variant description is required'),
                price: z.number().min(1, 'Price must be greater than 0'),
                quantity: z.number().min(1, 'Quantity must be greater than 0'),
                // images: z.array(
                //     z.object({
                //         url: z.string().url('Invalid image URL'),
                //         public_id: z.string().optional(),
                //     })
                // ).min(3, 'At least 3 images are required').optional(),
            }),
        }
    }

    // Schema dùng để cập nhật sản phẩm biến thể
    static updateProductVariant() {
        return {
            body: z.object({
                variant_name: z.string().min(1).optional(),
                variant_color: z.string().optional(),
                variant_description: z.string().min(1).optional(),
                price: z
                    .number()
                    .min(1, 'Price must be greater than 0')
                    .optional(),
                quantity: z
                    .number()
                    .min(1, 'Quantity must be greater than 0')
                    .optional(),
            }),
        }
    }
}
