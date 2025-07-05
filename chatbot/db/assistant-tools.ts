import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getAssistantToolsByAssistantId = async (assistantId: string) => {
  const assistantTools = await prisma.assistant.findUnique({
    where: { id: assistantId },
    select: {
      id: true,
      name: true,
      assistantTools: {
        include: {
          tool: true
        }
      }
    }
  })

  if (!assistantTools) {
    throw new Error("Assistant not found")
  }

  return assistantTools
}

export const createAssistantTool = async (
  assistantTool: Prisma.AssistantToolCreateInput
) => {
  const createdAssistantTool = await prisma.assistantTool.create({
    data: assistantTool
  })

  return createdAssistantTool
}

export const createAssistantTools = async (
  assistantTools: Prisma.AssistantToolCreateManyInput[]
) => {
  const createdAssistantTools = await prisma.assistantTool.createMany({
    data: assistantTools
  })

  return createdAssistantTools
}

export const deleteAssistantTool = async (
  assistantId: string,
  toolId: string
) => {
  await prisma.assistantTool.delete({
    where: {
      assistantId_toolId: {
        assistantId,
        toolId
      }
    }
  })

  return true
}
