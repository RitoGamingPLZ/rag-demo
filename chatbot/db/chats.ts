import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getChatById = async (chatId: string) => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId }
  })

  return chat
}

export const getChatsByWorkspaceId = async (workspaceId: string) => {
  const chats = await prisma.chat.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' }
  })

  return chats
}

export const createChat = async (chat: Prisma.ChatCreateInput) => {
  const createdChat = await prisma.chat.create({
    data: chat
  })

  return createdChat
}

export const createChats = async (chats: Prisma.ChatCreateManyInput[]) => {
  const createdChats = await prisma.chat.createMany({
    data: chats
  })

  return createdChats
}

export const updateChat = async (
  chatId: string,
  chat: Prisma.ChatUpdateInput
) => {
  const updatedChat = await prisma.chat.update({
    where: { id: chatId },
    data: chat
  })

  return updatedChat
}

export const deleteChat = async (chatId: string) => {
  await prisma.chat.delete({
    where: { id: chatId }
  })

  return true
}
