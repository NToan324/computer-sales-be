import productService from '@/services/product.service'
import { UploadService } from '@/services/upload.service'
import type { Request, Response } from 'express'

class ProductController {
    //Tải lên ảnh sản phẩm
    async uploadImage(req: Request, res: Response) {
        const { public_id } = req.body
        const image = req.file?.path as string
        res.send(await UploadService.uploadImage(image, public_id))
    }

    // ========================Product========================
    //Thêm sản phẩm
    async createProduct(req: Request, res: Response) {
        const payload = req.body

        res.send(await productService.createProduct(payload))
    }

    //Lấy danh sách sản phẩm
    async getProducts(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query as {
            page?: number
            limit?: number
        }

        res.send(
            await productService.getProducts({
                page: page,
                limit: limit,
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

        res.send(
            await productService.searchProduct({ name, category_id, brand_id })
        )
    }

    // =========================Product Variant========================
    //Thêm biến thể sản phẩm
    async createProductVariant(req: Request, res: Response) {
        const payload = req.body
        res.send(await productService.createProductVariant(payload))
    }

    //Lấy danh sách biến thể sản phẩm
    async getProductVariants(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query as {
            page?: number
            limit?: number
        }


        res.send(
            await productService.getProductVariants({
                page: page,
                limit: limit,
            })
        )
    }

    //Lấy biến thể sản phẩm theo id
    async getProductVariantById(req: Request, res: Response) {
        const { id } = req.params
        res.send(await productService.getProductVariantById(id))
    }

    //Xóa biến thể sản phẩm theo id
    async deleteProductVariant(req: Request, res: Response) {
        const { id } = req.params
        res.send(await productService.deleteProductVariant(id))
    }

    //Cập nhật biến thể sản phẩm theo id
    async updateProductVariant(req: Request, res: Response) {
        const productVariantId = req.params.id
        const payload = req.body
        res.send(
            await productService.updateProductVariant({
                payload,
                productVariantId,
            })
        )
    }

    //Lấy danh sách biến thể sản phẩm theo id sản phẩm
    async getProductVariantsByProductId(req: Request, res: Response) {
        const { id } = req.params
        const { page = 1, limit = 10 } = req.query as {
            page?: number
            limit?: number
        }

        res.send(
            await productService.getProductVariantsByProductId({
                productId: id,
                page: page,
                limit: limit,
            })
        )
    }

    //Lấy danh sách sản phẩm bán chạy nhất
    async getBestSellingProductVariants(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query as {
            page?: number
            limit?: number
        }


        res.send(
            await productService.getBestSellingProductVariants({
                page: page,
                limit: limit,
            })
        )
    }

    //Lấy danh sách biến thể sản phẩm giảm giá
    async getDiscountedProductVariants(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query as {
            page?: number
            limit?: number
        }

        res.send(
            await productService.getDiscountedProductVariants({
                page: page,
                limit: limit,
            })
        )
    }

    //Lấy danh sách biến thể sản phẩm mới nhất
    async getNewestProductVariants(req: Request, res: Response) {
        const { page = 1, limit = 10 } = req.query as {
            page?: number
            limit?: number
        }

        res.send(
            await productService.getNewestProductVariants({
                page: page,
                limit: limit,
            })
        )
    }

    //Tìm kiếm biến thể sản phẩm theo tên, danh mục, thương hiệu, khoảng giá, rating trung bình
    async searchProductVariant(req: Request, res: Response) {
        const {
            name,
            category_ids,
            brand_ids,
            min_price,
            max_price,
            ratings,
            sort_price,
            sort_name,
            page = 1,
            limit = 10,
        } = req.query as {
            name?: string;
            category_ids?: string | string[];
            brand_ids?: string | string[];
            min_price?: number;
            max_price?: number;
            ratings?: number | number[];
            sort_price?: 'asc' | 'desc';
            sort_name?: 'asc' | 'desc';
            page?: number;
            limit?: number;
        };

        // Đảm bảo các tham số là mảng
        const categoryIdsArray = Array.isArray(category_ids)
            ? category_ids
            : category_ids
                ? [category_ids]
                : []
        const brandIdsArray = Array.isArray(brand_ids)
            ? brand_ids
            : brand_ids
                ? [brand_ids]
                : []
        const ratingsArray = Array.isArray(ratings)
            ? ratings
            : ratings
                ? [ratings]
                : []

        res.send(
            await productService.searchProductVariant({
                name,
                category_ids: categoryIdsArray,
                brand_ids: brandIdsArray,
                min_price: min_price,
                max_price: max_price,
                ratings: ratingsArray,
                sort_price,
                sort_name,
                page: page,
                limit: limit,
            })
        )
    }
}

const productController = new ProductController()
export default productController
