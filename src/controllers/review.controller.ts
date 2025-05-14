import reviewService from '@/services/review.service';
import { Server } from 'socket.io';
import { Request, Response } from 'express';
import verifyRoleSocket from '@/middleware/verifyRoleSocket';
class ReviewController {
    // Thêm review
    async setupReviewWebSocket(socket: any, io: Server) {

        // Lắng nghe sự kiện thêm review
        socket.on('add_review', async (data: any) => {
            try {
                const { product_variant_id, content, rating } = data;
                const userId = socket.user?.id; // Lấy userId từ socket

                // Gọi service để thêm review
                const newReview = await reviewService.addReview({
                    productVariantId: product_variant_id,
                    userId: userId,
                    content: content,
                    rating: rating,
                });

                // Phát sự kiện cho tất cả người dùng trong room
                io.to(product_variant_id).emit('new_review', newReview);

            } catch (error: any) {
                socket.emit('error', { message: error.message });
            }
        });

        // Lắng nghe sự kiện xóa review
        socket.on('delete_review', verifyRoleSocket(['ADMIN']), async (data: any) => {
            try {
                const { reviewId, product_variant_id } = data;

                // Gọi service để xóa review
                const deletedReview = await reviewService.deleteReview(reviewId);

                // Phát sự kiện cho tất cả người dùng trong room
                io.to(product_variant_id).emit('review_deleted', deletedReview);

            } catch (error: any) {
                socket.emit('error', { message: error.message });
            }
        });
    }

    // Lấy danh sách review theo product_variant_id
    async getReviewsByProductVariantId(req: Request, res: Response) {
        const { product_variant_id } = req.params;
        const { page = '1', limit = '10' } = req.query as {
            page?: string;
            limit?: string;
        };

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        res.send(await reviewService.getReviewsByProductVariantId({
            productVariantId: product_variant_id,
            page: pageNumber,
            limit: limitNumber,
        }));
    }
}

const reviewController = new ReviewController();
export default reviewController;