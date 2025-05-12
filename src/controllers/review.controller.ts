// import reviewService from '@/services/review.service';

// export const setupReviewWebSocket = (socket: any) => {
//     console.log('User connected to review namespace:', socket.id);

//     // Lắng nghe sự kiện thêm review
//     socket.on('add_review', async (data) => {
//         try {
//             await reviewService.addReview({ ...data, socket });
//         } catch (error) {
//             socket.emit('error', { message: error.message });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected from review namespace:', socket.id);
//     });
// };