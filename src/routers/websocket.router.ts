// import { Server } from 'socket.io';
// import { setupReviewWebSocket } from '@/controllers/review.websocket.controller';

// const setupWebSocketRoutes = (io: Server) => {
//     // Namespace cho các sự kiện cần xác thực
//     const authenticatedNamespace = io.of('/authenticated');
//     authenticatedNamespace.use((socket, next) => {
//         const token = socket.handshake.query.token;

//         if (!token) {
//             return next(new Error('Authentication error: No token provided'));
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE as string);
//             socket.user = decoded; // Lưu thông tin người dùng vào socket
//             next();
//         } catch (err) {
//             next(new Error('Authentication error: Invalid token'));
//         }
//     });

//     authenticatedNamespace.on('connection', (socket) => {
//         console.log('Authenticated user connected:', socket.user);

//         // Gọi controller xử lý các sự kiện liên quan đến review
//         setupReviewWebSocket(socket);
//     });

//     // Namespace cho các sự kiện không cần xác thực
//     const publicNamespace = io.of('/public');
//     publicNamespace.on('connection', (socket) => {
//         console.log('Public user connected:', socket.id);

//         // Ví dụ: Lắng nghe sự kiện không cần xác thực
//         socket.on('public_event', (data) => {
//             console.log('Public event received:', data);
//         });
//     });
// };

// export default setupWebSocketRoutes;