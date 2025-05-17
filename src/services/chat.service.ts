// class ChatService {
//     async sendMessage({
//         senderId,
//         receiverId,
//         message
//     }: {
//         senderId: string
//         receiverId: string
//         message: string
//     }) {
//         // Kiểm tra và tạo cuộc hội thoại nếu chưa có
//         let conversation = await Conversation.findOne({
//             user: senderId === receiverId ? null : (senderId), // user luôn khác admin
//             admin: receiverId
//         });

//         if (!conversation) {
//             conversation = new Conversation({
//                 user_id: senderId,
//                 admin_id: receiverId,
//                 last_message: content
//             });
//             await conversation.save();
//         }

//         // Lưu tin nhắn
//         const message = new Message({
//             conversation: conversation._id,
//             sender: senderId,
//             messageType,
//             content
//         });
//         await message.save();

//         // Return the saved message
//         return savedMessage
//     }
// }
// const chatService = new ChatService()
// export default chatService