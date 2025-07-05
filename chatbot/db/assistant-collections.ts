import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getAssistantCollectionsByAssistantId = async (
  assistantId: string
) => {
  const assistantCollections = await prisma.assistant.findUnique({
    where: { id: assistantId },
    select: {
      id: true,
      name: true,
      assistantCollections: {
        include: {
          collection: true
        }
      }
    }
  })

  if (!assistantCollections) {
    throw new Error("Assistant not found")
  }

  return assistantCollections
}

export const createAssistantCollection = async (
  assistantCollection: Prisma.AssistantCollectionCreateInput
) => {
  const createdAssistantCollection = await prisma.assistantCollection.create({
    data: assistantCollection
  })

  return createdAssistantCollection
}

export const createAssistantCollections = async (
  assistantCollections: Prisma.AssistantCollectionCreateManyInput[]
) => {
  const createdAssistantCollections = await prisma.assistantCollection.createMany({
    data: assistantCollections
  })

  return createdAssistantCollections
}

export const deleteAssistantCollection = async (
  assistantId: string,
  collectionId: string
) => {
  await prisma.assistantCollection.delete({
    where: {
      assistantId_collectionId: {
        assistantId,
        collectionId
      }
    }
  })

  return true
}
