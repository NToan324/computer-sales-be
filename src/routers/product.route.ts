import productController from '../controllers/product.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import verifyRole from '@/middleware/verifyRoles'
import { ProductValidation } from '@/validation/product.validation'
import { Router } from 'express'
import upload from '@/storage/multerConfig'

const router = Router()

router.get(
    '/',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(productController.getProducts)
)

router.get('/search',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(productController.searchProduct))

router.post(
    '/upload',
    verifyJWT,
    verifyRole(['ADMIN']),
    upload.single('file'),
    asyncHandler(productController.uploadImage))

router.post(
    '/',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.createProduct()),
    asyncHandler(productController.createProduct)
)

router.get(
    '/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(productController.getProductById)
)

router.put(
    '/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.updateProduct()),
    asyncHandler(productController.updateProduct)
)
router.delete(
    '/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(productController.deleteProduct)
)


export default router
