import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getFoldersByWorkspaceId = async (workspaceId: string) => {
  const folders = await prisma.folder.findMany({
    where: { workspaceId }
  })

  return folders
}

export const createFolder = async (folder: Prisma.FolderCreateInput) => {
  const createdFolder = await prisma.folder.create({
    data: folder
  })

  return createdFolder
}

export const updateFolder = async (
  folderId: string,
  folder: Prisma.FolderUpdateInput
) => {
  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: folder
  })

  return updatedFolder
}

export const deleteFolder = async (folderId: string) => {
  await prisma.folder.delete({
    where: { id: folderId }
  })

  return true
}
