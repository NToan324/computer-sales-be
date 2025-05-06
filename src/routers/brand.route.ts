import brandController from '../controllers/brand.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import verifyRole from '@/middleware/verifyRoles'
import { BrandValidation } from '@/validation/brand.validation'
import { Router } from 'express'

const router = Router()

router.post('/',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(BrandValidation.createBrand()),
    asyncHandler(brandController.createBrand))

router.get('/', asyncHandler(brandController.getBrands))

router.get('/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(brandController.getBrandById))

router.put('/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    validationRequest(BrandValidation.updateBrand()), asyncHandler(brandController.updateBrand))

router.delete('/:id',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(brandController.deleteBrand))

router.post('/upload',
    verifyJWT,
    verifyRole(['ADMIN']),
    asyncHandler(brandController.uploadImage))

export default router
