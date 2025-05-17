import userController from '../controllers/user.controller';
import asyncHandler from '@/middleware/asyncHandler';
import { validationRequest } from '@/middleware/validationRequest';
import verifyJWT from '@/middleware/verifyJWT';
import { UserValidation } from '@/validation/user.validation';
import { Router } from 'express';
import upload from '@/storage/multerConfig';
import verifyRole from '@/middleware/verifyRoles';

const router = Router();

// Lấy order theo user_id
router.get('/orders',
    verifyJWT,
    asyncHandler(userController.getOrdersByUserId));

// Xem chi tiết người dùng
router.get('/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(userController.getUserProfile));

// Lấy hồ sơ người dùng
router.get('/profile',
    verifyJWT,
    asyncHandler(userController.getUserProfile));

// Đổi mật khẩu
router.put('/change-password',
    verifyJWT,
    validationRequest(UserValidation.changePassword()),
    asyncHandler(userController.changePassword));

// Cập nhật thông tin người dùng với quyền ADMIN
router.put('/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(UserValidation.updateUserInfo()),
    asyncHandler(userController.updateUserInfo));

// Cập nhật thông tin người dùng với quyền USER
router.put('/profile',
    verifyJWT,
    validationRequest(UserValidation.updateUserInfo()),
    asyncHandler(userController.updateUserInfo));

// tải lên avatar
router.post(
    '/upload',
    verifyJWT,
    upload.single('file'),
    asyncHandler(userController.uploadImage))

export default router;