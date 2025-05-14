import reviewService from '@/services/review.service';

class ReviewController {
    // Thêm review
    async setupReviewWebSocket(socket: any) {
        console.log('User connected to review namespace:', socket.id);

        // Lắng nghe sự kiện thêm review
        socket.on('add_review', async (data: any) => {
            try {
                await reviewService.addReview({ ...data, socket });
            } catch (error: any) {
                socket.emit('error', { message: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from review namespace:', socket.id);
        });
    }
}

const reviewController = new ReviewController();
export default reviewController;