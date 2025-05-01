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
                variant_description: z.string().min(1, 'Variant description is required'),
                price: z.number().min(1, 'Price must be greater than 0'),
                quantity: z.number().min(1, 'Quantity must be greater than 0'),
            }),
        };
    }

    // Schema dùng để cập nhật sản phẩm biến thể
    static updateProductVariant() {
        return {
            body: z.object({
                variant_name: z.string().min(1).optional(),
                variant_color: z.string().optional(),
                variant_description: z.string().min(1).optional(),
                price: z.number().min(1, 'Price must be greater than 0').optional(),
                quantity: z.number().min(1, 'Quantity must be greater than 0').optional(),
            }),
        };
    }
}


