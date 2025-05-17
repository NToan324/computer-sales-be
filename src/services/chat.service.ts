class ChatService {
    async sendMessage({
        senderId,
        receiverId,
        message
    }: {
        senderId: string
        receiverId: string
        message: string
    }) {
        // Validate input
        if (!senderId || !receiverId || !message) {
            throw new Error('Invalid input')
        }

        // Check if the conversation exists
        const conversation = await this.getConversation(senderId, receiverId)
        if (!conversation) {
            throw new Error('Conversation not found')
        }

        // Save the message to the database
        const savedMessage = await this.saveMessage(senderId, receiverId, message)

        // Return the saved message
        return savedMessage
    }
}
const chatService = new ChatService()
export default chatService