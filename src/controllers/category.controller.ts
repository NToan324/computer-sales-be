import categoryService from '@/services/category.service'
import type { Request, Response } from 'express'
import { UploadService } from '@/services/upload.service'
class CategoryController {
  async createCategory(req: Request, res: Response) {
    const payload = req.body
    res.send(await categoryService.createCategory(payload))
  }

  async getCategories(req: Request, res: Response) {
    res.send(await categoryService.getCategories())
  }

  async getCategoryById(req: Request, res: Response) {
    const { id } = req.params
    res.send(await categoryService.getCategoryById(id))
  }

  async updateCategory(req: Request, res: Response) {
    const payload = req.body
    const { id } = req.params
    res.send(await categoryService.updateCategory({ id, payload }))
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params
    res.send(await categoryService.deleteCategory(id))
  }

  async searchCategories(req: Request, res: Response) {
    const { name } = req.query as { name?: string }

    
    res.send(await categoryService.searchCategories(name || ''))
  }

  async uploadImage(req: Request, res: Response) {
    const { public_id } = req.body
    const image = req.file?.path as string
    res.send(await UploadService.uploadImage(image, public_id))
  }
}



const categoryController = new CategoryController()
export default categoryController
