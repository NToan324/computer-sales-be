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
router.get('/:id',
    verifyJWT, 
    verifyRole(['ADMIN']),
    asyncHandler(productController.getProductById)
)
router.post(
    '/',
    verifyJWT, 
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.createProduct()), upload.single('product_image'),
    asyncHandler(productController.createProduct)
)
router.put(
    '/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.updateProduct()),
    asyncHandler(productController.updateProduct)
)
router.delete('/:id', verifyJWT, verifyRole(['ADMIN']), asyncHandler(productController.deleteProduct))

router.get('/search', asyncHandler(productController.searchProduct))

export default router
