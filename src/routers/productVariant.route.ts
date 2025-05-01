import productController from '../controllers/product.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import verifyRole from '@/middleware/verifyRoles'
import { ProductValidation } from '@/validation/product.validation'
import { Router } from 'express'

const router = Router()

router.get('/', asyncHandler(productController.getProductVariants))
router.get('/:id', asyncHandler(productController.getProductVariantById))
router.post(
    '/',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.createProductVariant()),
    asyncHandler(productController.createProductVariant)
)
router.put(
    '/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(ProductValidation.updateProductVariant()),
    asyncHandler(productController.updateProductVariant)
)
router.delete('/:id', verifyJWT, verifyRole(['ADMIN']), asyncHandler(productController.deleteProductVariant))

router.get('/search', asyncHandler(productController.searchProductVariant))

export default router
