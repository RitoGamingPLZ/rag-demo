import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

// Base storage directory
const STORAGE_BASE_DIR = process.env.STORAGE_BASE_DIR || './storage'
const MESSAGE_IMAGES_DIR = path.join(STORAGE_BASE_DIR, 'message_images')

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

export const uploadMessageImage = async (relativePath: string, image: File) => {
  const imageSizeLimit = 6000000 // 6MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const fullPath = path.join(MESSAGE_IMAGES_DIR, relativePath)
  const dirPath = path.dirname(fullPath)

  // Ensure directory exists
  await ensureStorageDir(dirPath)

  try {
    // Convert File to Buffer
    const buffer = await image.arrayBuffer()
    await writeFile(fullPath, new Uint8Array(buffer))
    
    return relativePath
  } catch (error) {
    throw new Error("Error uploading image")
  }
}

export const getMessageImageFromStorage = async (filePath: string) => {
  try {
    const fullPath = path.join(MESSAGE_IMAGES_DIR, filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error("Message image not found")
    }
    
    // For local storage, we'll return a URL path that can be served by the application
    // This assumes your app will serve files from /api/storage/message_images/
    return `/api/storage/message_images/${filePath}`
  } catch (error) {
    console.error(error)
    throw new Error("Error downloading message image")
  }
}
