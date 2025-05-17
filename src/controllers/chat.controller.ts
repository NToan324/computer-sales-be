import { Server } from 'socket.io'
import { Request, Response } from 'express'
import Conversation from '@/models/conversation.model'
import Message from '@/models/message.model'
// import chatService from '@/services/chat.service';

class ChatController {
    // Thêm review
    async setupReviewWebSocket(socket: any, io: Server) {
        // Nhận tin nhắn
        // socket.on('send_message', async (data: any) => {
        //     try {
        //         const { sender_id, receiverId, content, messageType = 'text' } = data

        //         const message = chatService.sendMessage({ senderId, receiverId, content, messageType })

        //         io.of('/chat').to(roomId).emit('new_message', {})
        //     } catch (err) {
        //         console.error('Send message error:', err);
        //     }
        // });
    }

}

const chatController = new ChatController()
export default chatController
