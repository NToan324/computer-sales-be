import { CreatedResponse, OkResponse } from '@/core/success.response'
import { convertToObjectId } from '@/helpers/convertObjectId'
import { BadRequestError } from '@/core/error.response'
import productModel, { Product } from '@/models/product.model'
import elasticsearchService from './elasticsearch.service'
import ProductVariantModel, { ProductVariant } from '@/models/productVariant.model'

class ProductService {

    // ========================Product========================
    //Thêm sản phẩm
    async createProduct(payload: Partial<Product>) {
        var newProduct = await productModel.create({
            ...payload,
        })

        const { _id, ...productWithoutId } = newProduct.toObject();
        
        await elasticsearchService.indexDocument(
            'products',
            _id.toString(),
            productWithoutId,
        )

        return new CreatedResponse('Tạo sản phẩm thành công', { _id, ...productWithoutId });
    }

    //Lấy danh sách sản phẩm
    async getProducts({
        page = 1,
        limit = 10,
    }: {
        page?: number
        limit?: number
    }) {
        const from = (page - 1) * limit; // Tính toán vị trí bắt đầu

        // Tìm kiếm sản phẩm trong Elasticsearch
        const response = await elasticsearchService.searchDocuments(
            'products',
            {
                from,
                size: limit,
                query: {
                    term: {
                        isActive: true,
                    },
                },
            }
        );

        if (response.length === 0) {
            return new OkResponse('No products found', []);
        }

        const products = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }));
        const total = products.length;

        return new OkResponse('Get products successfully', {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: products,
        });
    }

    //Lấy sản phẩm theo id
    async getProductById(id: string) {
        
        const response = await elasticsearchService.searchDocuments(
            'products',
            {
                query: {
                    bool: {
                        must: {
                            term: {
                                _id: id,
                            },
                        },
                        filter: {
                            term: {
                                isActive: true,
                            },
                        },
                    },
                },
            }
        );

        if (response.length === 0) {
            throw new BadRequestError('Sản phẩm không tồn tại')
        }

        const product = { _id: response[0]._id, ...(response[0]._source || {}) }
        return new OkResponse('Get product successfully', product)
    }

    //Xóa sản phẩm theo id
    async deleteProduct(id: string) {
        const deletedProduct = await productModel.findByIdAndUpdate(
            { _id: convertToObjectId(id) },
            {
                isActive: false,
            },
            { new: true }
        )
        
        if (!deletedProduct) throw new BadRequestError('Sản phẩm không tồn tại')
        
        const { _id, ...productWithoutId } = deletedProduct.toObject();
        
        // Remove the product from Elasticsearch
        await elasticsearchService.updateDocument(
            'products',
            _id.toString(),
            productWithoutId
        )

        return new OkResponse('Xóa sản phẩm thành công', {_id, ...productWithoutId})
    }

    //Cập nhật sản phẩm theo id
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

        const { _id, ...productWithoutId } = updatedProduct.toObject();

        // Update the product in Elasticsearch
        await elasticsearchService.indexDocument(
            'products',
            _id.toString(),
            productWithoutId,
        )

        return new OkResponse('Cập nhật sản phẩm thành công', { _id, ...productWithoutId })
    }

    //Tìm kiếm sản phẩm theo tên, danh mục, thương hiệu
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
                    "product_name.keyword": {
                        value: `*${name}*`,
                    },
                },
            });
        }

        if (category_id) {
            must.push({
                term: {
                    "category_id.keyword": category_id,
                },
            });
        }

        if (brand_id) {
            must.push({
                term: {
                    "brand_id.keyword": brand_id,
                },
            });
        }

        const response = await elasticsearchService.searchDocuments(
            'products',
            {
                query: {
                    bool: {
                        must,
                        filter: {
                            term: {
                                isActive: true,
                            },
                        },
                    },
                    
                },
            }
        );

        const products = response.map((hit: any) => {
            return { _id: hit._id, ...hit._source };
        });

        return new OkResponse('Tìm kiếm sản phẩm thành công', products);
    }

    // ========================Product Variant========================
    //Thêm biến thể sản phẩm
    async createProductVariant(payload: Partial<ProductVariant>) {
        const product = await productModel.findById(payload.product_id);

        if (!product) {
            throw new BadRequestError('Sản phẩm gốc không tồn tại');
        }

        // Gộp thêm brand_id và category_id từ sản phẩm gốc
        var newProductVariant = await ProductVariantModel.create({
            ...payload,
        });
        
        const { _id, ...productVariantWithoutId } = {
            ...newProductVariant.toObject(),
            brand_id: product.brand_id,
            category_id: product.category_id,
        };

        // Thêm vào Elasticsearch
        await elasticsearchService.indexDocument(
            'product_variants',
            _id.toString(),
            productVariantWithoutId,
        );

        return new CreatedResponse('Tạo biến thể sản phẩm thành công', { _id, ...productVariantWithoutId });
    }

    //Lấy danh sách biến thể sản phẩm
    async getProductVariants({
        page = 1,
        limit = 10,
    }: {
        page?: number
        limit?: number
    }) {
        const from = (page - 1) * limit; // Tính toán vị trí bắt đầu

        // Tìm kiếm biến thể sản phẩm trong Elasticsearch
        const response = await elasticsearchService.searchDocuments(
            'product_variants',
            {
                from,
                size: limit,
                query: {
                    term: {
                        isActive: true,
                    },
                },
            }
        );

        if (response.length === 0) {
            return new OkResponse('No product variants found', []);
        }

        const productVariants = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }));
        const total = productVariants.length;

        return new OkResponse('Get product variants successfully', {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: productVariants,
        });
    }

    //Lấy biến thể sản phẩm theo id
    async getProductVariantById(id: string) {
        const response = await elasticsearchService.searchDocuments(
            'product_variants',
            {
                query: {
                    bool: {
                        must: {
                            term: {
                                _id: id,
                            },
                        },
                        filter: {
                            term: {
                                isActive: true,
                            },
                        },
                    },
                },
            }
        );

        if (response.length === 0) {
            throw new BadRequestError('Biến thể sản phẩm không tồn tại')
        }

        const productVariant = { _id: response[0]._id, ...(response[0]._source || {}) }
        return new OkResponse('Get product variant successfully', productVariant)
    }

    //Xóa biến thể sản phẩm theo id
    async deleteProductVariant(id: string) {
        const deletedProductVariant = await ProductVariantModel.findByIdAndUpdate(
            { _id: convertToObjectId(id) },
            {
                isActive: false,
            },
            { new: true }
        )
        
        if (!deletedProductVariant) throw new BadRequestError('Biến thể sản phẩm không tồn tại')
        
        const { _id, ...productVariantWithoutId } = deletedProductVariant.toObject();
        
        // Remove the product variant from Elasticsearch
        await elasticsearchService.updateDocument(
            'product_variants',
            _id.toString(),
            productVariantWithoutId
        )

        return new OkResponse('Xóa biến thể sản phẩm thành công', {_id, ...productVariantWithoutId})
    }

    //Cập nhật biến thể sản phẩm theo id
    async updateProductVariant({
        payload,
        productVariantId,
    }: {
        payload: ProductVariant
        productVariantId: string
    }) {
        const updatedProductVariant = await ProductVariantModel.findByIdAndUpdate(
            { _id: convertToObjectId(productVariantId) },
            {
                ...payload,
            },
            { new: true }
        )

        if (!updatedProductVariant) throw new BadRequestError('Biến thể sản phẩm không tồn tại')

        const { _id, ...productVariantWithoutId } = updatedProductVariant.toObject();

        // Update the product variant in Elasticsearch
        await elasticsearchService.indexDocument(
            'product_variants',
            _id.toString(),
            productVariantWithoutId,
        )

        return new OkResponse('Cập nhật biến thể sản phẩm thành công', { _id, ...productVariantWithoutId })
    }
}

const productService = new ProductService()
export default productService