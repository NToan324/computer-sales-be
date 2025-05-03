import productController from '../controllers/product.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import verifyRole from '@/middleware/verifyRoles'
import { ProductValidation } from '@/validation/product.validation'
import { Router } from 'express'

const router = Router()

// Lấy danh sách biến thể sản phẩm
router.get('/', asyncHandler(productController.getProductVariants))

// Tạo biến thể sản phẩm
router.post(
    '/',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.createProductVariant()),
    asyncHandler(productController.createProductVariant)
)

// Tìm kiếm biến thể sản phẩm theo tên, danh mục, thương hiệu, khoảng giá, rating trung bình
router.get('/search', asyncHandler(productController.searchProductVariant))

// Cập nhật biến thể sản phẩm
router.put(
    '/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.updateProductVariant()),
    asyncHandler(productController.updateProductVariant)
)

// Lấy biến thể sản phẩm theo id biến thể sản phẩm
router.get('/:id', asyncHandler(productController.getProductVariantById))

// Xóa biến thể sản phẩm
router.delete('/:id', verifyJWT, verifyRole(['ADMIN']), asyncHandler(productController.deleteProductVariant))

// Lấy danh sách biến thể sản phẩm mới nhất
router.get('/newest', asyncHandler(productController.getNewestProductVariants))

// Lấy danh sách biến thể sản phẩm bán chạy nhất
router.get('/best-seller', asyncHandler(productController.getBestSellingProductVariants))

// Lấy danh sách biến thể sản phẩm giảm giá
router.get('/discount', asyncHandler(productController.getDiscountedProductVariants))
export default router
