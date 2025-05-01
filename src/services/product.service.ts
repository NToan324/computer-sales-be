import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
import productModel, { Product } from '@/models/product.model'
import orderModel from '@/models/order.model'
class ProductService {
    async createProduct( payload: Product ) {
        const newProduct = await productModel.create({
            ...payload,
        })
        return new CreatedResponse('Product created successfully', newProduct)
    }

    async getProducts({
        page = 1,
        limit = 10,
    }: {
        page?: number
        limit?: number
    }) {
        const skip = (page - 1) * limit

        const [products, total] = await Promise.all([
            productModel.find().skip(skip).limit(limit),
            productModel.countDocuments(),
        ])

        if (!products || products.length === 0) {
            return new OkResponse('No products found', [])
        }

        return new OkResponse('Get products successfully', {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: products,
        })
    }

    async getProductById(id: string) {
        const product = await productModel.findById(id)
        if (!product) throw new BadRequestError('Sản phẩm không tồn tại')
        return new OkResponse('Get product successfully', product)
    }

    async deleteProduct(id: string) {
        const isSoldProduct = await orderModel.findOne({
            'items.product_id': convertToObjectId(id),
            status: 'Completed',
        })
        if (isSoldProduct) {
            throw new Error('Sản phẩm đã được bán không thể xóa')
        }

        const product = await productModel.findByIdAndDelete(id)
        if (!product) throw new Error('Sản phẩm không tồn tại')
        return new OkResponse('Xóa sản phẩm thành công', product)
    }

    async updateProduct({
        payload,
        id,
        productId,
    }: {
        payload: Product
        id: string
        productId: string
    }) {
        const updatedProduct = await productModel.findByIdAndUpdate(
            { _id: convertToObjectId(productId) },
            {
                ...payload,
                updated_by: id,
            },
            { new: true }
        )

        if (!updatedProduct) throw new BadRequestError('Sản phẩm không tồn tại')
        return new OkResponse('Cập nhật sản phẩm thành công', updatedProduct)
    }

    async searchProduct(code: string) {
        const products = await productModel
            .find({
                code: { $regex: code, $options: 'i' },
            })
            .limit(5)
        return new OkResponse('Tìm kiếm sản phẩm thành công', products)
    }

    async deleteManyProduct() {
        const products = await productModel.deleteMany()
        return new OkResponse('Xóa sản phẩm thành công', products)
    }
}

const productService = new ProductService()
export default productService
