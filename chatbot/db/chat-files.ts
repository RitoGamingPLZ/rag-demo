import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getChatFilesByChatId = async (chatId: string) => {
  const chatFiles = await prisma.chat.findUnique({
    where: { id: chatId },
    select: {
      id: true,
      name: true,
      files: {
        include: {
          file: true
        }
      }
    }
  })

  if (!chatFiles) {
    throw new Error("Chat not found")
  }

  return chatFiles
}

export const createChatFile = async (chatFile: Prisma.ChatFileCreateInput) => {
  const createdChatFile = await prisma.chatFile.create({
    data: chatFile
  })

  return createdChatFile
}

export const createChatFiles = async (
  chatFiles: Prisma.ChatFileCreateManyInput[]
) => {
  const createdChatFiles = await prisma.chatFile.createMany({
    data: chatFiles
  })

  return createdChatFiles
}
