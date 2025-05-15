import z from 'zod';

export class CartValidation {
    // Validation for adding an item to the cart
    static addItemToCart() {
        return {
            body: z.object({
                productVariantId: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid productVariantId')
                    .nonempty('Product Variant ID is required'),
                quantity: z
                    .union([
                        z.string().regex(/^\d+$/, 'Quantity must be a valid number').transform((val) => parseInt(val, 10)), // Chuyển từ string sang number
                        z.number().int(), // Hỗ trợ trực tiếp kiểu number
                    ])
                    .refine((val) => val >= 1, { message: 'Quantity must be at least 1' }) // Kiểm tra giá trị tối thiểu
                    .refine((val) => val >= 0, { message: 'Quantity must be a positive number' }), // Kiểm tra giá trị không âm
            }).strict('Invalid field'),
        };
    }

    // Validation for updating item quantity in the cart
    static updateItemQuantity() {
        return {
            body: z.object({
                productVariantId: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid productVariantId')
                    .nonempty('Product Variant ID is required'),
                quantity: z
                    .union([
                        z.string().regex(/^\d+$/, 'Quantity must be a valid number').transform((val) => parseInt(val, 10)), // Chuyển từ string sang number
                        z.number().int(), // Hỗ trợ trực tiếp kiểu number
                    ])
                    .refine((val) => val >= 1, { message: 'Quantity must be at least 1' }) // Kiểm tra giá trị tối thiểu
                    .refine((val) => val >= 0, { message: 'Quantity must be a positive number' }), // Kiểm tra giá trị không âm
            }).strict('Invalid field'),
        };
    }

    // Validation for removing an item from the cart
    static removeItemFromCart() {
        return {
            body: z.object({
                productVariantId: z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid productVariantId')
                    .nonempty('Product Variant ID is required'),
            }).strict('Invalid field'),
        };
    }
}

export default CartValidation;