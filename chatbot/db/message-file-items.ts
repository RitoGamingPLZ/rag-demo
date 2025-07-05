import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getMessageFileItemsByMessageId = async (messageId: string) => {
  const messageFileItems = await prisma.message.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      fileItems: true
    }
  })

  if (!messageFileItems) {
    throw new Error("Message not found")
  }

  return messageFileItems
}

export const createMessageFileItems = async (
  messageFileItems: Prisma.MessageFileItemCreateManyInput[]
) => {
  const createdMessageFileItems = await prisma.messageFileItem.createMany({
    data: messageFileItems
  })

  return createdMessageFileItems
}
