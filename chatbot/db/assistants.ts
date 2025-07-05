import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getAssistantById = async (assistantId: string) => {
  const assistant = await prisma.assistant.findUnique({
    where: { id: assistantId }
  })

  if (!assistant) {
    throw new Error("Assistant not found")
  }

  return assistant
}

export const getAssistantWorkspacesByWorkspaceId = async (
  workspaceId: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      assistantWorkspaces: {
        include: {
          assistant: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getAssistantWorkspacesByAssistantId = async (
  assistantId: string
) => {
  const assistant = await prisma.assistant.findUnique({
    where: { id: assistantId },
    select: {
      id: true,
      name: true,
      assistantWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!assistant) {
    throw new Error("Assistant not found")
  }

  return assistant
}

export const createAssistant = async (
  assistant: Prisma.AssistantCreateInput,
  workspace_id: string
) => {
  const createdAssistant = await prisma.assistant.create({
    data: assistant
  })

  await createAssistantWorkspace({
    user_id: createdAssistant.userId,
    assistant_id: createdAssistant.id,
    workspace_id
  })

  return createdAssistant
}

export const createAssistants = async (
  assistants: Prisma.AssistantCreateManyInput[],
  workspace_id: string
) => {
  const createdAssistants = await prisma.assistant.createMany({
    data: assistants
  })

  // Note: createMany doesn't return the created records, so we need to fetch them
  const assistantRecords = await prisma.assistant.findMany({
    where: {
      id: { in: assistants.map(a => a.id) }
    }
  })

  await createAssistantWorkspaces(
    assistantRecords.map(assistant => ({
      user_id: assistant.userId,
      assistant_id: assistant.id,
      workspace_id
    }))
  )

  return assistantRecords
}

export const createAssistantWorkspace = async (item: {
  user_id: string
  assistant_id: string
  workspace_id: string
}) => {
  const createdAssistantWorkspace = await prisma.assistantWorkspace.create({
    data: {
      userId: item.user_id,
      assistantId: item.assistant_id,
      workspaceId: item.workspace_id
    }
  })

  return createdAssistantWorkspace
}

export const createAssistantWorkspaces = async (
  items: { user_id: string; assistant_id: string; workspace_id: string }[]
) => {
  const createdAssistantWorkspaces = await prisma.assistantWorkspace.createMany({
    data: items.map(item => ({
      userId: item.user_id,
      assistantId: item.assistant_id,
      workspaceId: item.workspace_id
    }))
  })

  return createdAssistantWorkspaces
}

export const updateAssistant = async (
  assistantId: string,
  assistant: Prisma.AssistantUpdateInput
) => {
  const updatedAssistant = await prisma.assistant.update({
    where: { id: assistantId },
    data: assistant
  })

  return updatedAssistant
}

export const deleteAssistant = async (assistantId: string) => {
  await prisma.assistant.delete({
    where: { id: assistantId }
  })

  return true
}

export const deleteAssistantWorkspace = async (
  assistantId: string,
  workspaceId: string
) => {
  await prisma.assistantWorkspace.delete({
    where: {
      assistantId_workspaceId: {
        assistantId,
        workspaceId
      }
    }
  })

  return true
}
