import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getToolById = async (toolId: string) => {
  const tool = await prisma.tool.findUnique({
    where: { id: toolId }
  })

  if (!tool) {
    throw new Error("Tool not found")
  }

  return tool
}

export const getToolWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      toolWorkspaces: {
        include: {
          tool: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getToolWorkspacesByToolId = async (toolId: string) => {
  const tool = await prisma.tool.findUnique({
    where: { id: toolId },
    select: {
      id: true,
      name: true,
      toolWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!tool) {
    throw new Error("Tool not found")
  }

  return tool
}

export const createTool = async (
  tool: Prisma.ToolCreateInput,
  workspace_id: string
) => {
  const createdTool = await prisma.tool.create({
    data: tool
  })

  await createToolWorkspace({
    user_id: createdTool.userId,
    tool_id: createdTool.id,
    workspace_id
  })

  return createdTool
}

export const createTools = async (
  tools: Prisma.ToolCreateManyInput[],
  workspace_id: string
) => {
  const createdTools = await prisma.tool.createMany({
    data: tools
  })

  // Note: createMany doesn't return the created records, so we need to fetch them
  const toolRecords = await prisma.tool.findMany({
    where: {
      id: { in: tools.map(t => t.id) }
    }
  })

  await createToolWorkspaces(
    toolRecords.map(tool => ({
      user_id: tool.userId,
      tool_id: tool.id,
      workspace_id
    }))
  )

  return toolRecords
}

export const createToolWorkspace = async (item: {
  user_id: string
  tool_id: string
  workspace_id: string
}) => {
  const createdToolWorkspace = await prisma.toolWorkspace.create({
    data: {
      userId: item.user_id,
      toolId: item.tool_id,
      workspaceId: item.workspace_id
    }
  })

  return createdToolWorkspace
}

export const createToolWorkspaces = async (
  items: { user_id: string; tool_id: string; workspace_id: string }[]
) => {
  const createdToolWorkspaces = await prisma.toolWorkspace.createMany({
    data: items.map(item => ({
      userId: item.user_id,
      toolId: item.tool_id,
      workspaceId: item.workspace_id
    }))
  })

  return createdToolWorkspaces
}

export const updateTool = async (
  toolId: string,
  tool: Prisma.ToolUpdateInput
) => {
  const updatedTool = await prisma.tool.update({
    where: { id: toolId },
    data: tool
  })

  return updatedTool
}

export const deleteTool = async (toolId: string) => {
  await prisma.tool.delete({
    where: { id: toolId }
  })

  return true
}

export const deleteToolWorkspace = async (
  toolId: string,
  workspaceId: string
) => {
  await prisma.toolWorkspace.delete({
    where: {
      toolId_workspaceId: {
        toolId,
        workspaceId
      }
    }
  })

  return true
}