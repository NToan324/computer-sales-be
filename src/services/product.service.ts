import { CreatedResponse, OkResponse } from '@/core/success.response'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
import productModel, { Product } from '@/models/product.model'
import elasticsearchService from './elasticsearch.service'

class ProductService {

    async createProduct(payload: Partial<Product>) {
        const newProduct = await productModel.create({
            ...payload,
        })

        const { _id, ...productWithoutId } = newProduct; 
        
        await elasticsearchService.indexDocument(
            'products',
            _id.toString(),
            productWithoutId,
        )

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
            productModel.find({isActive: true}).skip(skip).limit(limit),
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
        if (!product || !product.isActive) throw new BadRequestError('Sản phẩm không tồn tại')
        return new OkResponse('Get product successfully', product)
    }

    async deleteProduct(id: string) {
        const deletedProduct = await productModel.findByIdAndUpdate(
            { _id: convertToObjectId(id) },
            {
                isActive: false,
            },
            { new: true }
        )
        
        if (!deletedProduct) throw new BadRequestError('Sản phẩm không tồn tại')
        
        const { _id, ...productWithoutId } = deletedProduct;
        
        // Remove the product from Elasticsearch
        await elasticsearchService.updateDocument(
            'products',
            _id.toString(),
            productWithoutId
        )

        return new OkResponse('Xóa sản phẩm thành công', deletedProduct)
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

        const { _id, ...productWithoutId } = updatedProduct; 

        // Update the product in Elasticsearch
        await elasticsearchService.indexDocument(
            'products',
            _id.toString(),
            productWithoutId,
        )

        return new OkResponse('Cập nhật sản phẩm thành công', updatedProduct)
    }

    async searchProduct({
        name,
        category_id,
        brand_id,
    }: {
        name?: string
        category_id?: string
        brand_id?: string
    }) {
        const must: any[] = [];

        // Add filters dynamically based on the provided parameters
        if (name) {
            must.push({
                wildcard: {
                    "_doc.product_name.keyword": {
                        value: `*${name}*`,
                    },
                },
            });
        }

        if (category_id) {
            must.push({
                term: {
                    "_doc.category_id.keyword": category_id,
                },
            });
        }

        if (brand_id) {
            must.push({
                term: {
                    "_doc.brand_id.keyword": brand_id,
                },
            });
        }

        const response = await elasticsearchService.searchDocuments(
            'products',
            {
                query: {
                    bool: {
                        must,
                    },
                },
            }
        );

        console.log('response', response);
        const products = response.map((hit: any) => {
            // Check if data is in the nested _doc structure or directly in _source
            return hit._source._doc || hit._source;
        });

        return new OkResponse('Tìm kiếm sản phẩm thành công', products);
    }
}

const productService = new ProductService()
export default productService