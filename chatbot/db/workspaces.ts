import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  const homeWorkspace = await prisma.workspace.findFirst({
    where: { 
      userId,
      isHome: true 
    }
  })

  if (!homeWorkspace) {
    throw new Error("Home workspace not found")
  }

  return homeWorkspace.id
}

export const getWorkspaceById = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getWorkspacesByUserId = async (userId: string) => {
  const workspaces = await prisma.workspace.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  return workspaces
}

export const createWorkspace = async (
  workspace: Prisma.WorkspaceCreateInput
) => {
  const createdWorkspace = await prisma.workspace.create({
    data: workspace
  })

  return createdWorkspace
}

export const updateWorkspace = async (
  workspaceId: string,
  workspace: Prisma.WorkspaceUpdateInput
) => {
  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: workspace
  })

  return updatedWorkspace
}

export const deleteWorkspace = async (workspaceId: string) => {
  await prisma.workspace.delete({
    where: { id: workspaceId }
  })

  return true
}