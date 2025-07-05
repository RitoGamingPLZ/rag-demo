import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getAssistantFilesByAssistantId = async (assistantId: string) => {
  const assistantFiles = await prisma.assistant.findUnique({
    where: { id: assistantId },
    select: {
      id: true,
      name: true,
      assistantFiles: {
        include: {
          file: true
        }
      }
    }
  })

  if (!assistantFiles) {
    throw new Error("Assistant not found")
  }

  return assistantFiles
}

export const createAssistantFile = async (
  assistantFile: Prisma.AssistantFileCreateInput
) => {
  const createdAssistantFile = await prisma.assistantFile.create({
    data: assistantFile
  })

  return createdAssistantFile
}

export const createAssistantFiles = async (
  assistantFiles: Prisma.AssistantFileCreateManyInput[]
) => {
  const createdAssistantFiles = await prisma.assistantFile.createMany({
    data: assistantFiles
  })

  return createdAssistantFiles
}

export const deleteAssistantFile = async (
  assistantId: string,
  fileId: string
) => {
  await prisma.assistantFile.delete({
    where: {
      assistantId_fileId: {
        assistantId,
        fileId
      }
    }
  })

  return true
}
