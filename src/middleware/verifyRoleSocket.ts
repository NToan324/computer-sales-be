import { ForbiddenError } from '@/core/error.response';

const verifyRoleSocket = (requiredRoles: string[]) => {
    return (socket: any, next: any) => {
        const user = socket.user; // Lấy thông tin user từ socket (đã được xác thực)

        if (!user) {
            next(new Error('Unauthorized: User not authenticated'));
        }

        // Kiểm tra role của user
        const userRole = user.role;
        if (!requiredRoles.includes(userRole)) {
            next(new ForbiddenError('Forbidden: User does not have the required role'));
        }

        next(); // Tiếp tục nếu role hợp lệ
    };
};

export default verifyRoleSocket;