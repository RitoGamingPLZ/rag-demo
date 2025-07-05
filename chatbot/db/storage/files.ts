import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)
const mkdir = promisify(fs.mkdir)

// Base storage directory
const STORAGE_BASE_DIR = process.env.STORAGE_BASE_DIR || './storage'
const FILES_DIR = path.join(STORAGE_BASE_DIR, 'files')

// Ensure storage directory exists
const ensureStorageDir = async (dirPath: string) => {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

export const uploadFile = async (
  file: File,
  payload: {
    name: string
    user_id: string
    file_id: string
  }
) => {
  const SIZE_LIMIT = parseInt(
    process.env.NEXT_PUBLIC_USER_FILE_SIZE_LIMIT || "10000000"
  )

  if (file.size > SIZE_LIMIT) {
    throw new Error(
      `File must be less than ${Math.floor(SIZE_LIMIT / 1000000)}MB`
    )
  }

  const encodedFileId = Buffer.from(payload.file_id).toString("base64")
  const fileExtension = file.name.split('.').pop() || 'bin'
  const fileName = `${encodedFileId}.${fileExtension}`
  const relativePath = `${payload.user_id}/${fileName}`
  const userDir = path.join(FILES_DIR, payload.user_id)
  const fullPath = path.join(userDir, fileName)

  // Ensure directory exists
  await ensureStorageDir(userDir)

  try {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer()
    await writeFile(fullPath, new Uint8Array(buffer))
    
    return relativePath
  } catch (error) {
    throw new Error("Error uploading file")
  }
}

export const deleteFileFromStorage = async (filePath: string) => {
  try {
    const fullPath = path.join(FILES_DIR, filePath)
    await unlink(fullPath)
  } catch (error) {
    console.error("Failed to remove file:", error)
    throw new Error("Failed to remove file!")
  }
}

export const getFileFromStorage = async (filePath: string) => {
  try {
    const fullPath = path.join(FILES_DIR, filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error("File not found")
    }
    
    // For local storage, we'll return a URL path that can be served by the application
    // This assumes your app will serve files from /api/storage/files/
    return `/api/storage/files/${filePath}`
  } catch (error) {
    console.error(`Error getting file with path: ${filePath}`, error)
    throw new Error("Error downloading file")
  }
}
