import categoryController from '../controllers/category.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
import { CategoryValidation } from '@/validation/category.validation'
import { validationRequest } from '@/middleware/validationRequest'
import verifyJWT from '@/middleware/verifyJWT'
import verifyRole from '@/middleware/verifyRoles'

const router = Router()

router.get('/search',
  verifyJWT,
  verifyRole(['ADMIN']),
  asyncHandler(categoryController.searchCategories))

router.post(
  '/',
  verifyJWT,
  verifyRole(['ADMIN']),
  validationRequest(CategoryValidation.createCategory()),
  asyncHandler(categoryController.createCategory)
)

router.get('/',
  verifyJWT,
  verifyRole(['ADMIN']),
  asyncHandler(categoryController.getCategories))

router.get('/:id',
  verifyJWT,
  verifyRole(['ADMIN']),
  asyncHandler(categoryController.getCategoryById))

router.put(
  '/:id',
  verifyJWT,
  verifyRole(['ADMIN']),
  validationRequest(CategoryValidation.updateCategory()),
  asyncHandler(categoryController.updateCategory)
)

router.delete('/:id',
  verifyJWT,
  verifyRole(['ADMIN']),
  asyncHandler(categoryController.deleteCategory))

export default router
