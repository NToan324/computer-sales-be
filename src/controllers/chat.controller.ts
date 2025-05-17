import { Server } from 'socket.io'
import { Request, Response } from 'express'
import Conversation from '@/models/conversation.model'
import Message from '@/models/message.model'

class ChatController {
    // Thêm review
    async setupReviewWebSocket(socket: any, io: Server) {
        // Nhận tin nhắn
        socket.on('send_message', async (data: any) => {
            try {
                const { senderId, receiverId, content, messageType = 'text' } = data

                // Kiểm tra và tạo cuộc hội thoại nếu chưa có
                let conversation = await Conversation.findOne({
                    user: senderId === receiverId ? null : (senderId), // user luôn khác admin
                    admin: receiverId
                });

                if (!conversation) {
                    conversation = new Conversation({
                        user_id: senderId,
                        admin_id: receiverId,
                        last_message: content
                    });
                    await conversation.save();
                }

                // Lưu tin nhắn
                const message = new Message({
                    conversation: conversation._id,
                    sender: senderId,
                    messageType,
                    content
                });
                await message.save();

                // Gửi lại cho người nhận nếu đang online
                const receiverSocket = connectedUsers.get(receiverId);
                if (receiverSocket) {
                    io.to(receiverSocket).emit('receive_message', {
                        senderId,
                        content,
                        messageType,
                        createdAt: message.createdAt
                    });
                }
            } catch (err) {
                console.error('Send message error:', err);
            }
        });
    }

}

const chatController = new ChatController()
export default chatController
