import { CreatedResponse, OkResponse } from '@/core/success.response' // Giả sử bạn có class này
import { convertToObjectId } from '@/helpers/convertObjectId'
import categoryModel, { Category } from '@/models/category.model'
import elasticsearchService from './elasticsearch.service'
import { BadRequestError } from '@/core/error.response'

class CategoryService {
    async createCategory(payload: Category) {
        const newCategory = await categoryModel.create(payload)

        const { _id, ...categoryWithoutId } = newCategory.toObject()

        await elasticsearchService.indexDocument(
            'categories',
            _id.toString(),
            categoryWithoutId,
        )

        return new CreatedResponse('Category created successfully', {_id: _id, ...categoryWithoutId})
    }

    async getCategories() {

        const response = await elasticsearchService.searchDocuments(
            'categories',
            {
                query: {
                    term: {
                        isActive: true,
                    },
                },
            }
        );

        if (response.length === 0) {
            return new OkResponse('No categories found', [])
        }
        const categories = response.map((hit: any) => {
            return {
                _id: hit._id,
                ...hit._source,
            }
        })

        return new OkResponse('Get all categories successfully', categories)
    }

    async getCategoryById(id: string) {
        
        const response = await elasticsearchService.searchDocuments(
            'categories',
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
            return new BadRequestError('Category not found')
        }

        const category = { _id: response[0]._id, ...(response[0]._source || {}) }

        return new OkResponse('Get category successfully', category)
    }

    async updateCategory({
        id,
        payload,
    }: {
        id: string
        payload: Partial<Category>
    }) {
        const category = await categoryModel.findOneAndUpdate(
            { _id: convertToObjectId(id), isActive: true },
            payload,
            { new: true }
        )

        if (!category) throw new Error('Category not found')
        
        const { _id, ...categoryWithoutId } = category.toObject()

        await elasticsearchService.updateDocument(
            'categories',
            _id.toString(),
            categoryWithoutId,
        )

        return new OkResponse('Category updated successfully', {_id: _id, ...categoryWithoutId})
    }

    async deleteCategory(id: string) {
        const category = await categoryModel.findByIdAndUpdate(id, {
            isActive: false
        }, { new: true })

        if (!category) throw new Error('Category not found')
        
        const { _id, ...categoryWithoutId } = category.toObject()

        await elasticsearchService.indexDocument(
            'categories',
            _id.toString(),
            categoryWithoutId,
        )

        return new OkResponse('Category deleted successfully', {_id: _id, ...categoryWithoutId})
    }

    async searchCategories(name: string) {

        const response = await elasticsearchService.searchDocuments(
            'categories',
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
            return new OkResponse('No categories found', [])
        }

        const categories = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }))

        return new OkResponse('Search categories successfully', categories)
    }
}

const categoryService = new CategoryService()
export default categoryService
