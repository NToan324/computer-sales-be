import { UnauthorizedError } from '@/core/error.response';
import jwt from 'jsonwebtoken';

const authenticateSocket = (socket: any, next: any) => {
    const token = socket.handshake.headers.authorization?.split(' ')[1]; // Lấy token từ header

    if (!token) {
        next(new UnauthorizedError('Authentication error: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE as string);
        socket.user = decoded; // Lưu thông tin người dùng vào socket
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        next(new UnauthorizedError('Authentication error: Invalid token'));
    }
};

export default authenticateSocket;