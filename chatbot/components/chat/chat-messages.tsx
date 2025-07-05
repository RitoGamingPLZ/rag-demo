import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { Message } from "../messages/message"
import { Message as MessageEntity } from "@/lib/generated/prisma"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages, chatFileItems } = useContext(ChatbotUIContext)

  const { handleSendEdit } = useChatHandler()

  const [editingMessage, setEditingMessage] = useState<MessageEntity>()

  return chatMessages
    .sort((a, b) => a.message.sequenceNumber - b.message.sequenceNumber)
    .map((chatMessage, index, array) => {
      const messageFileItems = chatFileItems.filter(
        (chatFileItem, _, self) =>
          chatMessage.fileItems.includes(chatFileItem.id) &&
          self.findIndex(item => item.id === chatFileItem.id) === _
      )

      return (
        <Message
          key={chatMessage.message.sequenceNumber}
          message={chatMessage.message}
          fileItems={messageFileItems}
          isEditing={editingMessage?.id === chatMessage.message.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          onSubmitEdit={handleSendEdit}
        />
      )
    })
}
