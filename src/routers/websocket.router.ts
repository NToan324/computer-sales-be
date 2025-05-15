import { Server } from 'socket.io';
import reviewController from '@/controllers/review.controller';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@/core/error.response';

declare module 'socket.io' {
    interface Socket {
        user?: any; // Thêm thuộc tính user vào Socket
    }
}

const websocketRoutes = (io: Server) => {
    const reviewNamespace = io.of('/review');

    reviewNamespace.use((socket, next) => {
        const token = socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            next();
        }

        if (token) {
            try {
                // Kiểm tra token
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE as string);
                socket.user = decoded; // Lưu thông tin người dùng vào socket
                next();
            } catch (error) {
                return next(new UnauthorizedError('Invalid token'));
            }
        }
    });

    // Connect sự kiện cho namespace review
    reviewNamespace.on('connection', (socket) => {
        console.log('User connected to review namespace:', socket.id);

        // Lắng nghe sự kiện join room
        socket.on('join_room', (product_variant_id: string) => {
            socket.join(product_variant_id);
            console.log(`User ${socket.id} joined room ${product_variant_id}`);
        });

        // Connect controller xử lý các sự kiện liên quan đến review
        reviewController.setupReviewWebSocket(socket, io);

        // Lắng nghe sự kiện leave room
        socket.on('leave_room', (product_variant_id: string) => {
            socket.leave(product_variant_id);
            console.log(`User ${socket.id} left room ${product_variant_id}`);
        });

        // Xử lý sự kiện ngắt kết nối
        socket.on('disconnect', () => {
            console.log('User disconnected from review namespace:', socket.id);
        });
    });
};

export default websocketRoutes;