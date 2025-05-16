import UserModel from '@/models/user.model';
import elasticsearchService from './elasticsearch.service';
import { BadRequestError } from '@/core/error.response';
import { OkResponse } from '@/core/success.response';
import bcrypt from 'bcryptjs'

class UserService {
    // Lấy hồ sơ người dùng
    async getUserProfile(user_id: string) {
        // Tìm người dùng trong MongoDB
        const user = await elasticsearchService.getDocumentById('users', user_id);
        if (!user) {
            throw new BadRequestError('User not found');
        }

        return new OkResponse('Get user profile successfully', user);
    }

    // Đổi mật khẩu
    async changePassword(user_id: string, oldPassword: string, newPassword: string) {
        // Tìm người dùng trong MongoDB
        const user = await UserModel.findById(user_id);

        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password as string);
        if (!isMatch) {
            throw new BadRequestError('Old password is incorrect');
        }

        // Hash mật khẩu mới và cập nhật
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return new OkResponse('Password changed successfully');
    }

    // Cập nhật thông tin người dùng
    async updateUserInfo(user_id: string, updatedData: any) {
        // Cập nhật thông tin trong MongoDB
        const updatedUser = await UserModel.findByIdAndUpdate(user_id, updatedData, {
            new: true,
        }).lean();

        if (!updatedUser) {
            throw new BadRequestError('User not found');
        }

        // Đồng bộ thông tin lên Elasticsearch
        await elasticsearchService.updateDocument('users', user_id, updatedUser);

        return updatedUser;
    }

}

export default new UserService();