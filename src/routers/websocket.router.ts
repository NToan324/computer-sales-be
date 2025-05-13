import { Server } from 'socket.io';
import reviewController from '@/controllers/review.controller';
import authenticateSocket from '@/middleware/authenticateSocket';

const setupWebSocketRoutes = (io: Server) => {
    // Namespace cho các sự kiện cần xác thực
    const authenticatedNamespace = io.of('/authenticated');

    // Middleware xác thực người dùng
    authenticatedNamespace.use(authenticateSocket);

    authenticatedNamespace.on('connection', (socket) => {

        // Gọi controller xử lý các sự kiện liên quan đến review
        reviewController.setupReviewWebSocket(socket);
    });

    // Namespace cho các sự kiện không cần xác thực
    const publicNamespace = io.of('/public');
    publicNamespace.on('connection', (socket) => {
        console.log('Public user connected:', socket.id);

        // Ví dụ: Lắng nghe sự kiện không cần xác thực
        socket.on('public_event', (data) => {
            console.log('Public event received:', data);
        });
    });
};

export default setupWebSocketRoutes;