import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)
const mkdir = promisify(fs.mkdir)

// Base storage directory
const STORAGE_BASE_DIR = process.env.STORAGE_BASE_DIR || './storage'
const WORKSPACE_IMAGES_DIR = path.join(STORAGE_BASE_DIR, 'workspace_images')

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

export const uploadWorkspaceImage = async (
  workspace: { user_id: string; id: string; image_path: string },
  image: File
) => {
  const imageSizeLimit = 6000000 // 6MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const currentPath = workspace.image_path
  const timestamp = Date.now()
  const fileExtension = image.name.split('.').pop() || 'jpg'
  const fileName = `${timestamp}.${fileExtension}`
  const relativePath = `${workspace.user_id}/${workspace.id}/${fileName}`
  const userDir = path.join(WORKSPACE_IMAGES_DIR, workspace.user_id, workspace.id)
  const fullPath = path.join(userDir, fileName)

  // Ensure directory exists
  await ensureStorageDir(userDir)

  // Delete old image if it exists
  if (currentPath.length > 0) {
    const oldFullPath = path.join(WORKSPACE_IMAGES_DIR, currentPath)
    try {
      await unlink(oldFullPath)
    } catch (error) {
      // File might not exist, continue
      console.warn('Could not delete old image:', error)
    }
  }

  try {
    // Convert File to Buffer
    const buffer = await image.arrayBuffer()
    await writeFile(fullPath, new Uint8Array(buffer))
    
    return relativePath
  } catch (error) {
    throw new Error("Error uploading image")
  }
}

export const getWorkspaceImageFromStorage = async (filePath: string) => {
  try {
    const fullPath = path.join(WORKSPACE_IMAGES_DIR, filePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error("Workspace image not found")
    }
    
    // For local storage, we'll return a URL path that can be served by the application
    // This assumes your app will serve files from /api/storage/workspace_images/
    return `/api/storage/workspace_images/${filePath}`
  } catch (error) {
    console.error(error)
    throw new Error("Error downloading workspace image")
  }
}
