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

        user.password = newPassword;
        await user.save();

        return new OkResponse('Password changed successfully');
    }

    // Cập nhật thông tin người dùng
    async updateUserInfo({
        user_id,
        fullName,
        address,
        avatar,
        isActive
    }: {
        user_id: string;
        fullName?: string;
        address?: string;
        avatar?: {
            url?: string;
            public_id?: string;
        };
        isActive?: boolean;
    }) {
        // Cập nhật thông tin trong MongoDB
        const updatedUser = await UserModel.findByIdAndUpdate(user_id,
            {
                fullName: fullName,
                address: address,
                avatar: avatar,
                isActive: isActive,
            },
            {
                new: true,
            });

        if (!updatedUser) {
            throw new BadRequestError('User not found');
        }

        const { _id, ...userWithoutId } = updatedUser.toObject();

        // Đồng bộ thông tin lên Elasticsearch
        await elasticsearchService.updateDocument('users', _id.toString(), userWithoutId);

        const { password, role, isActive: userStatus, ...userWithoutSensitiveField } = userWithoutId;

        return new OkResponse('User information updated successfully', {
            _id: _id,
            ...userWithoutSensitiveField,
        });
    }

}

export default new UserService();