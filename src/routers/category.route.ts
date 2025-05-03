import categoryController from '../controllers/category.controller'
import asyncHandler from '@/middleware/asyncHandler'
import { Router } from 'express'
import { CategoryValidation } from '@/validation/category.validation'
import { validationRequest } from '@/middleware/validationRequest'

const router = Router()

router.get('/search', asyncHandler(categoryController.searchCategories))

router.post(
  '/',
  validationRequest(CategoryValidation.createCategory()),
  asyncHandler(categoryController.createCategory)
)

router.get('/', asyncHandler(categoryController.getCategories))

router.get('/:id', asyncHandler(categoryController.getCategoryById))

router.put(
  '/:id',
  validationRequest(CategoryValidation.updateCategory()),
  asyncHandler(categoryController.updateCategory)
)

router.delete('/:id', asyncHandler(categoryController.deleteCategory))



export default router
