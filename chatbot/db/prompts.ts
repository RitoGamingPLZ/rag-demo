import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getPromptById = async (promptId: string) => {
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId }
  })

  if (!prompt) {
    throw new Error("Prompt not found")
  }

  return prompt
}

export const getPromptWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      promptWorkspaces: {
        include: {
          prompt: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getPromptWorkspacesByPromptId = async (promptId: string) => {
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    select: {
      id: true,
      name: true,
      promptWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!prompt) {
    throw new Error("Prompt not found")
  }

  return prompt
}

export const createPrompt = async (
  prompt: Prisma.PromptCreateInput,
  workspace_id: string
) => {
  const createdPrompt = await prisma.prompt.create({
    data: prompt
  })

  await createPromptWorkspace({
    user_id: createdPrompt.userId,
    prompt_id: createdPrompt.id,
    workspace_id
  })

  return createdPrompt
}

export const createPrompts = async (
  prompts: Prisma.PromptCreateManyInput[],
  workspace_id: string
) => {
  const createdPrompts = await prisma.prompt.createMany({
    data: prompts
  })

  // Note: createMany doesn't return the created records, so we need to fetch them
  const promptRecords = await prisma.prompt.findMany({
    where: {
      id: { in: prompts.map(p => p.id) }
    }
  })

  await createPromptWorkspaces(
    promptRecords.map(prompt => ({
      user_id: prompt.userId,
      prompt_id: prompt.id,
      workspace_id
    }))
  )

  return promptRecords
}

export const createPromptWorkspace = async (item: {
  user_id: string
  prompt_id: string
  workspace_id: string
}) => {
  const createdPromptWorkspace = await prisma.promptWorkspace.create({
    data: {
      userId: item.user_id,
      promptId: item.prompt_id,
      workspaceId: item.workspace_id
    }
  })

  return createdPromptWorkspace
}

export const createPromptWorkspaces = async (
  items: { user_id: string; prompt_id: string; workspace_id: string }[]
) => {
  const createdPromptWorkspaces = await prisma.promptWorkspace.createMany({
    data: items.map(item => ({
      userId: item.user_id,
      promptId: item.prompt_id,
      workspaceId: item.workspace_id
    }))
  })

  return createdPromptWorkspaces
}

export const updatePrompt = async (
  promptId: string,
  prompt: Prisma.PromptUpdateInput
) => {
  const updatedPrompt = await prisma.prompt.update({
    where: { id: promptId },
    data: prompt
  })

  return updatedPrompt
}

export const deletePrompt = async (promptId: string) => {
  await prisma.prompt.delete({
    where: { id: promptId }
  })

  return true
}

export const deletePromptWorkspace = async (
  promptId: string,
  workspaceId: string
) => {
  await prisma.promptWorkspace.delete({
    where: {
      promptId_workspaceId: {
        promptId,
        workspaceId
      }
    }
  })

  return true
}