import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getMessageById = async (messageId: string) => {
  const message = await prisma.message.findUnique({
    where: { id: messageId }
  })

  if (!message) {
    throw new Error("Message not found")
  }

  return message
}

export const getMessagesByChatId = async (chatId: string) => {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { sequenceNumber: 'asc' }
  })

  return messages
}

export const createMessage = async (message: Prisma.MessageCreateInput) => {
  const createdMessage = await prisma.message.create({
    data: message
  })

  return createdMessage
}

export const createMessages = async (messages: Prisma.MessageCreateManyInput[]) => {
  const createdMessages = await prisma.message.createMany({
    data: messages
  })

  return createdMessages
}

export const updateMessage = async (
  messageId: string,
  message: Prisma.MessageUpdateInput
) => {
  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: message
  })

  return updatedMessage
}

export const deleteMessage = async (messageId: string) => {
  await prisma.message.delete({
    where: { id: messageId }
  })

  return true
}

export async function deleteMessagesIncludingAndAfter(
  userId: string,
  chatId: string,
  sequenceNumber: number
) {
  await prisma.message.deleteMany({
    where: {
      userId,
      chatId,
      sequenceNumber: {
        gte: sequenceNumber
      }
    }
  })

  return true
}
