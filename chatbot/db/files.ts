import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"
import mammoth from "mammoth"
import { toast } from "sonner"
import { uploadFile } from "./storage/files"

export const getFileById = async (fileId: string) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId }
  })

  if (!file) {
    throw new Error("File not found")
  }

  return file
}

export const getFileWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      fileWorkspaces: {
        include: {
          file: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getFileWorkspacesByFileId = async (fileId: string) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: {
      fileWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!file) {
    throw new Error("File not found")
  }

  return file
}

export const createFileBasedOnExtension = async (
  file: File,
  fileRecord: Prisma.FileCreateInput,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  const fileExtension = file.name.split(".").pop()

  if (fileExtension === "docx") {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({
      arrayBuffer
    })

    return createDocXFile(
      result.value,
      file,
      fileRecord,
      workspace_id,
      embeddingsProvider
    )
  } else {
    return createFile(file, fileRecord, workspace_id, embeddingsProvider)
  }
}

// For non-docx files
export const createFile = async (
  file: File,
  fileRecord: Prisma.FileCreateInput,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  let validFilename = fileRecord.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()
  const extension = file.name.split(".").pop()
  const extensionIndex = validFilename.lastIndexOf(".")
  const baseName = validFilename.substring(0, (extensionIndex < 0) ? undefined : extensionIndex)
  const maxBaseNameLength = 100 - (extension?.length || 0) - 1
  if (baseName.length > maxBaseNameLength) {
    fileRecord.name = baseName.substring(0, maxBaseNameLength) + "." + extension
  } else {
    fileRecord.name = baseName + "." + extension
  }
  
  const createdFile = await prisma.file.create({
    data: fileRecord
  })

  await createFileWorkspace({
    userId: createdFile.userId,
    fileId: createdFile.id,
    workspaceId: workspace_id
  })

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    userId: createdFile.userId,
    fileId: createdFile.name
  })

  await updateFile(createdFile.id, {
    filePath: filePath
  })

  const formData = new FormData()
  formData.append("file_id", createdFile.id)
  formData.append("embeddingsProvider", embeddingsProvider)

  const response = await fetch("/api/retrieval/process", {
    method: "POST",
    body: formData
  })

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

// Handle docx files
export const createDocXFile = async (
  text: string,
  file: File,
  fileRecord: Prisma.FileCreateInput,
  workspace_id: string,
  embeddingsProvider: "openai" | "local"
) => {
  const createdFile = await prisma.file.create({
    data: fileRecord
  })

  await createFileWorkspace({
    userId: createdFile.userId,
    fileId: createdFile.id,
    workspaceId: workspace_id
  })

  const filePath = await uploadFile(file, {
    name: createdFile.name,
    userId: createdFile.userId,
    fileId: createdFile.name
  })

  await updateFile(createdFile.id, {
    filePath: filePath
  })

  const response = await fetch("/api/retrieval/process/docx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      fileId: createdFile.id,
      embeddingsProvider,
      fileExtension: "docx"
    })
  })

  if (!response.ok) {
    const jsonText = await response.text()
    const json = JSON.parse(jsonText)
    console.error(
      `Error processing file:${createdFile.id}, status:${response.status}, response:${json.message}`
    )
    toast.error("Failed to process file. Reason:" + json.message, {
      duration: 10000
    })
    await deleteFile(createdFile.id)
  }

  const fetchedFile = await getFileById(createdFile.id)

  return fetchedFile
}

export const createFiles = async (
  files: Prisma.FileCreateManyInput[],
  workspace_id: string
) => {
  const createdFiles = await prisma.file.createMany({
    data: files
  })

  // Get the created files to have their IDs
  const fileList = await prisma.file.findMany({
    where: {
      userId: files[0]?.userId,
      name: { in: files.map(f => f.name) }
    }
  })

  await createFileWorkspaces(
    fileList.map(file => ({
      userId: file.userId,
      fileId: file.id,
      workspaceId: workspace_id
    }))
  )

  return fileList
}

export const createFileWorkspace = async (item: {
  userId: string
  fileId: string
  workspaceId: string
}) => {
  const createdFileWorkspace = await prisma.fileWorkspace.create({
    data: item
  })

  return createdFileWorkspace
}

export const createFileWorkspaces = async (
  items: { userId: string; fileId: string; workspaceId: string }[]
) => {
  const createdFileWorkspaces = await prisma.fileWorkspace.createMany({
    data: items
  })

  return createdFileWorkspaces
}

export const updateFile = async (
  fileId: string,
  file: Prisma.FileUpdateInput
) => {
  const updatedFile = await prisma.file.update({
    where: { id: fileId },
    data: file
  })

  return updatedFile
}

export const deleteFile = async (fileId: string) => {
  await prisma.file.delete({
    where: { id: fileId }
  })

  return true
}

export const deleteFileWorkspace = async (
  fileId: string,
  workspaceId: string
) => {
  await prisma.fileWorkspace.delete({
    where: {
      fileId_workspaceId: {
        fileId,
        workspaceId
      }
    }
  })

  return true
}