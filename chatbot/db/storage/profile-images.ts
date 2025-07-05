import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)
const mkdir = promisify(fs.mkdir)

// Base storage directory
const STORAGE_BASE_DIR = process.env.STORAGE_BASE_DIR || './storage'
const PROFILE_IMAGES_DIR = path.join(STORAGE_BASE_DIR, 'profile_images')

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

export const uploadProfileImage = async (
  profile: { userId: string; imagePath: string },
  image: File
) => {
  const imageSizeLimit = 2000000 // 2MB

  if (image.size > imageSizeLimit) {
    throw new Error(`Image must be less than ${imageSizeLimit / 1000000}MB`)
  }

  const currentPath = profile.imagePath
  const timestamp = Date.now()
  const fileExtension = image.name.split('.').pop() || 'jpg'
  const fileName = `${timestamp}.${fileExtension}`
  const relativePath = `${profile.userId}/${fileName}`
  const userDir = path.join(PROFILE_IMAGES_DIR, profile.userId)
  const fullPath = path.join(userDir, fileName)

  // Ensure directory exists
  await ensureStorageDir(userDir)

  // Delete old image if it exists
  if (currentPath.length > 0) {
    const oldFullPath = path.join(PROFILE_IMAGES_DIR, currentPath)
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
    
    const publicUrl = `/api/storage/profile_images/${relativePath}`
    
    return {
      path: relativePath,
      url: publicUrl
    }
  } catch (error) {
    throw new Error("Error uploading image")
  }
}
