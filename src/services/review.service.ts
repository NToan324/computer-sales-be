import elasticsearchService from './elasticsearch.service';
import { OkResponse, CreatedResponse } from '@/core/success.response';
import { BadRequestError } from '@/core/error.response';
import productVariantModel from '@/models/productVariant.model';
import reviewModel from '@/models/review.model';

class ReviewService {
    // Thêm review cho sản phẩm
    async addReview({
        productVariantId,
        userId,
        content,
        rating,
        socket,
    }: {
        productVariantId: string;
        userId?: string;
        content: string;
        rating?: number;
        socket?: any;
    }) {
        // Kiểm tra xem productVariant có tồn tại và isActive hay không
        const productVariant = await productVariantModel.findOne({
            _id: productVariantId,
            isActive: true,
        });

        if (!productVariant) {
            socket.emit('error', { message: 'Product variant does not exist or is inactive' });
            return;
        }

        const reviewData: any = {
            product_variant_id: productVariantId,
            content,
        };

        if (userId) {
            reviewData.user_id = userId;
        }

        if (rating) {
            reviewData.rating = rating;
        }

        let newReview;

        try {
            newReview = await reviewModel.create(reviewData);
        }
        catch (error: any) {
            if (error.code === 11000) {
                socket.emit('error', { message: 'Already rated this product' });
                return;
            }
            socket.emit('error', { message: 'Failed to add review' });
            return;
        }

        // Cập nhật average_rating và số lượng review của product variant
        await this.updateProductVariantStats(productVariantId, socket);

        const { _id, ...reviewWithoutId } = newReview.toObject();

        // Thêm review vào Elasticsearch
        await elasticsearchService.indexDocument(
            'reviews',
            _id.toString(),
            reviewWithoutId,
        );

        socket.emit('review_added', { message: 'Review added successfully', review: newReview });
    }

    // Cập nhật average_rating và số lượng review của product variant
    async updateProductVariantStats(productVariantId: string, socket?: any) {
        // Lấy tất cả các review của product variant
        const reviews = await reviewModel.find({ product_variant_id: productVariantId });

        if (reviews.length === 0) {
            socket.emit('error', { message: 'No reviews found for this product variant' });
            return;
        }

        // Tính toán average_rating
        const reviewsWithRating = reviews.filter((review) => review.rating !== undefined && review.rating !== null);
        const totalRating = reviewsWithRating.reduce((sum, review) => sum + (review.rating as number), 0);
        const averageRating = reviewsWithRating.length > 0 ? totalRating / reviewsWithRating.length : 0;

        // Cập nhật số lượng review và average_rating trong MongoDB
        await productVariantModel.findByIdAndUpdate(productVariantId, {
            average_rating: averageRating,
            review_count: reviews.length,
        });

        // Cập nhật average_rating và review_count trong Elasticsearch
        await elasticsearchService.updateDocument('product_variants', productVariantId, {
            average_rating: averageRating,
            review_count: reviews.length,
        });
    }


}

const reviewService = new ReviewService();
export default reviewService;