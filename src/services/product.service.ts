import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
import productModel, { Product } from '@/models/product.model'
import orderModel from '@/models/order.model'
import { Cloudinary } from '@/helpers/uploadImageToCloudinary'
import fs from 'fs'

class ProductService {
    async createProduct(product_image: string, payload: Product) {
        
        const uploadedImage = await Cloudinary.uploadImage(product_image)

        fs.unlinkSync(product_image);

        const newProduct = await productModel.create({
            ...payload,
            product_image: {
                url: uploadedImage.url,
                public_id: uploadedImage.public_id,
            },
        })

        return new CreatedResponse('Tạo sản phẩm thành công', newProduct)
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
        productId,
    }: {
        payload: Product
        productId: string
    }) {
        const updatedProduct = await productModel.findByIdAndUpdate(
            { _id: convertToObjectId(productId) },
            {
                ...payload,
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
