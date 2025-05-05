import { BadRequestError } from '@/core/error.response'
import { CreatedResponse, OkResponse } from '@/core/success.response'
import { convertToObjectId } from '@/helpers/convertObjectId'
import brandModel, { Brand } from '@/models/brand.model'
import elasticsearchService from './elasticsearch.service'

class BrandService {
    async createBrand(payload: Brand) {
        const newBrand = await brandModel.create(payload)

        const { _id, ...brandWithoutId } = newBrand.toObject()

        await elasticsearchService.indexDocument(
            'brands',
            _id.toString(),
            brandWithoutId,
        )

        return new CreatedResponse('Brand created successfully', { _id, ...brandWithoutId })
    }

    async getBrands() {
        const response = await elasticsearchService.searchDocuments(
            'brands',
            {
                query: {
                    term: {
                        isActive: true,
                    },
                },
            }
        )

        if (response.length === 0) {
            return new OkResponse('No brands found', [])
        }

        const brands = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }))

        return new OkResponse('Get all brands successfully', brands)
    }

    async getBrandById(id: string) {
        const response = await elasticsearchService.searchDocuments(
            'brands',
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
        )

        if (response.length === 0) {
            throw new BadRequestError('Brand not found')
        }

        const brand = { _id: response[0]._id, ...(response[0]._source || {}) }

        return new OkResponse('Get brand successfully', brand)
    }

    async updateBrand({
        id,
        payload,
    }: {
        id: string
        payload: Partial<Brand>
    }) {
        const brand = await brandModel.findOneAndUpdate(
            { _id: convertToObjectId(id), isActive: true },
            payload,
            { new: true }
        )

        if (!brand) throw new BadRequestError('Brand not found')

        const { _id, ...brandWithoutId } = brand.toObject()

        await elasticsearchService.updateDocument(
            'brands',
            _id.toString(),
            brandWithoutId,
        )

        return new OkResponse('Brand updated successfully', { _id, ...brandWithoutId })
    }

    async deleteBrand(id: string) {
        const brand = await brandModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        )

        if (!brand) throw new Error('Brand not found')

        const { _id, ...brandWithoutId } = brand.toObject()

        await elasticsearchService.indexDocument(
            'brands',
            _id.toString(),
            brandWithoutId,
        )

        return new OkResponse('Brand deleted successfully', { _id, ...brandWithoutId })
    }

    async searchBrands(name: string) {
        const response = await elasticsearchService.searchDocuments(
            'brands',
            {
                query: {
                    bool: {
                        must: [
                            {
                                wildcard: {
                                    "category_name.keyword": {
                                        value: `*${name}*`,
                                    },
                                },
                            },
                            {
                                term: {
                                    isActive: true,
                                },
                            },
                        ],
                    },
                },
            }
        )

        if (response.length === 0) {
            return new OkResponse('No brands found', [])
        }

        const brands = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }))

        return new OkResponse('Get all brands successfully', brands)
    }
}

const brandService = new BrandService()
export default brandService