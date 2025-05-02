import productService from '@/services/product.service'
import { UploadService } from '@/services/upload.service'
import type { Request, Response } from 'express'

class ProductController {
    // ========================Product========================
    //Thêm sản phẩm
    async createProduct(req: Request, res: Response) {
        const payload = req.body
       
        res.send(await productService.createProduct(payload))
    }

    //Lấy danh sách sản phẩm
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

    //Lấy sản phẩm theo id
    async getProductById(req: Request, res: Response) {
        const { id } = req.params
        res.send(await productService.getProductById(id))
    }

    //Xóa sản phẩm theo id
    async deleteProduct(req: Request, res: Response) {
        const { id } = req.params
        res.send(await productService.deleteProduct(id))
    }

    //Cập nhật sản phẩm theo id
    async updateProduct(req: Request, res: Response) {
        const productId = req.params.id
        const payload = req.body
        res.send(await productService.updateProduct({ payload, productId }))
    }

    //Tìm kiếm sản phẩm theo tên, danh mục, thương hiệu
    async searchProduct(req: Request, res: Response) {
        const { name, category_id, brand_id } = req.query as {
            name?: string
            category_id?: string
            brand_id?: string
        }

        res.send(await productService.searchProduct({ name, category_id, brand_id }))
    }

    // =========================Product Variant========================
    //Thêm biến thể sản phẩm
    async createProductVariant(req: Request, res: Response) {
        const payload = req.body
        res.send(await productService.createProductVariant(payload))
    }

    //Tải lên ảnh sản phẩm
    async uploadImage(req: Request, res: Response) {
        const { public_id } = req.body
        const image = req.file?.path as string
        res.send(await UploadService.uploadImage(image, public_id))
    }
}

const productController = new ProductController()
export default productController
