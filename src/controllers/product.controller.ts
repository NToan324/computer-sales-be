import productService from '@/services/product.service'
import type { Request, Response } from 'express'

class ProductController {
    // ========================Product========================
    //Thêm sản phẩm
    async createProduct(req: Request, res: Response) {
        const product_image = req.file?.path as string
        const payload = req.body
       
        res.send(await productService.createProduct(product_image, payload))
    }

    async getProducts(req: Request, res: Response) {
        const { page = '1', limit = '10' } = req.query as {
            page?: string
            limit?: string
        }

        const pageNumber = parseInt(page, 10)
        const limitNumber = parseInt(limit, 10)

        res.send(
            await productService.getProducts({
                page: pageNumber,
                limit: limitNumber,
            })
        )
    }

    async getProductById(req: Request, res: Response) {
        const { id } = req.params
        res.send(await productService.getProductById(id))
    }

    async deleteProduct(req: Request, res: Response) {
        const { id } = req.params
        res.send(await productService.deleteProduct(id))
    }

    async updateProduct(req: Request, res: Response) {
        const productId = req.params.id
        const payload = req.body
        res.send(await productService.updateProduct({ payload, productId }))
    }

    async searchProduct(req: Request, res: Response) {
        const { product_name } = req.query as { product_name: string }
        res.send(await productService.searchProduct(product_name))
    }
}

const productController = new ProductController()
export default productController
