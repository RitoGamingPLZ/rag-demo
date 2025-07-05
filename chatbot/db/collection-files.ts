import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getCollectionFilesByCollectionId = async (
  collectionId: string
) => {
  const collectionFiles = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: {
      id: true,
      name: true,
      collectionFiles: {
        include: {
          file: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        }
      }
    }
  })

  if (!collectionFiles) {
    throw new Error("Collection not found")
  }

  return collectionFiles
}

export const createCollectionFile = async (
  collectionFile: Prisma.CollectionFileCreateInput
) => {
  const createdCollectionFile = await prisma.collectionFile.create({
    data: collectionFile
  })

  return createdCollectionFile
}

export const createCollectionFiles = async (
  collectionFiles: Prisma.CollectionFileCreateManyInput[]
) => {
  const createdCollectionFiles = await prisma.collectionFile.createMany({
    data: collectionFiles
  })

  return createdCollectionFiles
}

export const deleteCollectionFile = async (
  collectionId: string,
  fileId: string
) => {
  await prisma.collectionFile.delete({
    where: {
      collectionId_fileId: {
        collectionId,
        fileId
      }
    }
  })

  return true
}
