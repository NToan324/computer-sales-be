import elasticsearchService from './elasticsearch.service';
import { OkResponse, CreatedResponse } from '@/core/success.response';
import { BadRequestError } from '@/core/error.response';

class FeedbackService {
    // Thêm rating cho sản phẩm
    async addRating({
        productVariantId,
        userId,
        rating,
    }: {
        productVariantId: string;
        userId: string;
        rating: number;
    }) {
        // Lưu rating vào Elasticsearch
        await elasticsearchService.indexDocument(
            'ratings',
            `${productVariantId}_${userId}`, // ID duy nhất cho mỗi rating
            {
                product_variant_id: productVariantId,
                user_id: userId,
                rating,
            }
        );

        // Cập nhật average_rating của sản phẩm
        await this.updateAverageRating(productVariantId);

        return new CreatedResponse('Rating added successfully');
    }

    // Tính toán và cập nhật average_rating
    async updateAverageRating(productVariantId: string) {
        // Lấy tất cả rating của sản phẩm
        const response = await elasticsearchService.searchDocuments(
            'ratings',
            {
                query: {
                    term: {
                        product_variant_id: productVariantId,
                    },
                },
            }
        );

        if (response.length === 0) {
            throw new BadRequestError('No ratings found for this product variant');
        }

        // Tính average_rating
        const totalRating = response.reduce((sum: number, hit: any) => sum + hit._source.rating, 0);
        const averageRating = totalRating / response.length;

        // Cập nhật average_rating trong chỉ mục product_variants
        await elasticsearchService.updateDocument(
            'product_variants',
            productVariantId,
            { average_rating: averageRating }
        );
    }

    // Thêm review cho sản phẩm
    async addReview({
        productVariantId,
        userId,
        content,
    }: {
        productVariantId: string;
        userId: string;
        content: string;
    }) {
        // Lưu review vào Elasticsearch
        await elasticsearchService.indexDocument(
            'reviews',
            `${productVariantId}_${userId}`, // ID duy nhất cho mỗi review
            {
                product_variant_id: productVariantId,
                user_id: userId,
                content,
            }
        );

        return new CreatedResponse('Review added successfully');
    }

    // Lấy danh sách review của sản phẩm
    async getReviews(productVariantId: string) {
        const response = await elasticsearchService.searchDocuments(
            'reviews',
            {
                query: {
                    term: {
                        product_variant_id: productVariantId,
                    },
                },
            }
        );

        const reviews = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }));

        return new OkResponse('Get reviews successfully', reviews);
    }

    // Lấy danh sách rating của sản phẩm
    async getRatings(productVariantId: string) {
        const response = await elasticsearchService.searchDocuments(
            'ratings',
            {
                query: {
                    term: {
                        product_variant_id: productVariantId,
                    },
                },
            }
        );

        const ratings = response.map((hit: any) => ({
            _id: hit._id,
            ...hit._source,
        }));

        return new OkResponse('Get ratings successfully', ratings);
    }
}

const feedbackService = new FeedbackService();
export default feedbackService;