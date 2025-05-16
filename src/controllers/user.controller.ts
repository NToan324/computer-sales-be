import type { Request, Response } from 'express';
import userService from '@/services/user.service';
import orderService from '@/services/order.service';
import { CreatedResponse, OkResponse } from '@/core/success.response';
import { UploadService } from '@/services/upload.service';

class UserController {
    // Lấy danh sách đơn hàng theo user_id
    async getOrdersByUserId(req: Request, res: Response) {
        const { id } = req.user as { id: string };
        const { page = '1', limit = '10' } = req.query as {
            page?: string;
            limit?: string;
        };

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        res.send(await orderService.getOrderByUserId({
            user_id: id,
            page: pageNumber,
            limit: limitNumber,
        }));
    }

    // Lấy hồ sơ người dùng
    async getUserProfile(req: Request, res: Response) {
        const { id } = req.user as { id: string };
        res.send(await userService.getUserProfile(id));
    }

    // Đổi mật khẩu
    async changePassword(req: Request, res: Response) {
        const { id } = req.user as { id: string };
        const { oldPassword, newPassword } = req.body;

        res.send(await userService.changePassword(id, oldPassword, newPassword));
    }

    // Cập nhật thông tin người dùng
    async updateUserInfo(req: Request, res: Response) {
        const { id } = req.user as { id: string };
        const updatedData = req.body;
        const updatedUser = await userService.updateUserInfo(id, updatedData);
        res.send(new OkResponse('User information updated successfully', updatedUser));
    }

    // Tải lên ảnh avatar
    async uploadImage(req: Request, res: Response) {
        const { public_id } = req.body
        const image = req.file?.path as string
        res.send(await UploadService.uploadImage(image, public_id))
    }
}

export default new UserController();