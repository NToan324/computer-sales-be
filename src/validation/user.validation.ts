import { z } from 'zod';

export class UserValidation {
    // Validation cho việc đổi mật khẩu
    static changePassword() {
        return {
            body: z.object({
                oldPassword: z
                    .string()
                    .nonempty('Old password is required'),
                newPassword: z
                    .string()
                    .nonempty('New password is required')
                    .min(6, 'New password must be at least 6 characters long'),
            }).strict('Invalid field'),
        };
    }

    // Validation cho việc cập nhật thông tin người dùng
    static updateUserInfo() {
        return {
            body: z.object({
                fullName: z.string().optional(),
                phone: z
                    .string()
                    .regex(/^[0-9]{10,11}$/, 'Invalid phone number')
                    .optional(),
                address: z.string().optional(),
                avatar: z
                    .object({
                        url: z.string().url('Invalid avatar URL'),
                        public_id: z.string().optional(),
                    })
                    .optional(),
            }).strict('Invalid field'),
        };
    }
}

export default UserValidation;