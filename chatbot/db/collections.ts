import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getCollectionById = async (collectionId: string) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId }
  })

  if (!collection) {
    throw new Error("Collection not found")
  }

  return collection
}

export const getCollectionWorkspacesByWorkspaceId = async (
  workspaceId: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      collectionWorkspaces: {
        include: {
          collection: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getCollectionWorkspacesByCollectionId = async (
  collectionId: string
) => {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: {
      id: true,
      name: true,
      collectionWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!collection) {
    throw new Error("Collection not found")
  }

  return collection
}

export const createCollection = async (
  collection: Prisma.CollectionCreateInput,
  workspace_id: string
) => {
  const createdCollection = await prisma.collection.create({
    data: collection
  })

  await createCollectionWorkspace({
    user_id: createdCollection.userId,
    collection_id: createdCollection.id,
    workspace_id
  })

  return createdCollection
}

export const createCollections = async (
  collections: Prisma.CollectionCreateManyInput[],
  workspace_id: string
) => {
  const createdCollections = await prisma.collection.createMany({
    data: collections
  })

  // Note: createMany doesn't return the created records, so we need to fetch them
  const collectionRecords = await prisma.collection.findMany({
    where: {
      id: { in: collections.map(c => c.id) }
    }
  })

  await createCollectionWorkspaces(
    collectionRecords.map(collection => ({
      user_id: collection.userId,
      collection_id: collection.id,
      workspace_id
    }))
  )

  return collectionRecords
}

export const createCollectionWorkspace = async (item: {
  user_id: string
  collection_id: string
  workspace_id: string
}) => {
  const createdCollectionWorkspace = await prisma.collectionWorkspace.create({
    data: {
      userId: item.user_id,
      collectionId: item.collection_id,
      workspaceId: item.workspace_id
    }
  })

  return createdCollectionWorkspace
}

export const createCollectionWorkspaces = async (
  items: { user_id: string; collection_id: string; workspace_id: string }[]
) => {
  const createdCollectionWorkspaces = await prisma.collectionWorkspace.createMany({
    data: items.map(item => ({
      userId: item.user_id,
      collectionId: item.collection_id,
      workspaceId: item.workspace_id
    }))
  })

  return createdCollectionWorkspaces
}

export const updateCollection = async (
  collectionId: string,
  collection: Prisma.CollectionUpdateInput
) => {
  const updatedCollection = await prisma.collection.update({
    where: { id: collectionId },
    data: collection
  })

  return updatedCollection
}

export const deleteCollection = async (collectionId: string) => {
  await prisma.collection.delete({
    where: { id: collectionId }
  })

  return true
}

export const deleteCollectionWorkspace = async (
  collectionId: string,
  workspaceId: string
) => {
  await prisma.collectionWorkspace.delete({
    where: {
      collectionId_workspaceId: {
        collectionId,
        workspaceId
      }
    }
  })

  return true
}
