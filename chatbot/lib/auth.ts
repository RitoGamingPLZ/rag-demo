import { cookies } from 'next/headers'
import { db } from './db'

export interface AuthSession {
  user: {
    id: string
    email?: string
  }
}

export async function getServerSession(): Promise<AuthSession | null> {
  // For now, return a placeholder user
  // In a real implementation, you would validate tokens/cookies here
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) {
    return null
  }

  // Placeholder implementation - in production you'd verify the session token
  return {
    user: {
      id: 'placeholder-user-id',
      email: 'placeholder@example.com'
    }
  }
}

export async function getCurrentUser(): Promise<any> {
  const session = await getServerSession()
  
  if (!session) {
    throw new Error('User not authenticated')
  }

  // For now, return a placeholder user
  // In production, you'd fetch from database using session.user.id
  return {
    id: 'placeholder-user-id',
    email: 'placeholder@example.com'
  }
}

export async function getServerProfile() {
  const session = await getServerSession()
  
  if (!session) {
    throw new Error('User not authenticated')
  }

  try {
    const profile = await db.profile.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!profile) {
      // Create a default profile if none exists
      const defaultProfile = await db.profile.create({
        data: {
          userId: session.user.id,
          username: `user_${Date.now()}`,
          displayName: 'Anonymous User',
          bio: '',
          imageUrl: '',
          imagePath: '',
          profileContext: '',
          hasOnboarded: false,
          useAzureOpenai: false
        }
      })
      return addApiKeysToProfile(defaultProfile)
    }

    return addApiKeysToProfile(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw new Error('Profile not found')
  }
}

function addApiKeysToProfile(profile: any) {
  // Add API keys from environment variables
  const apiKeys = {
    openai_api_key: process.env.OPENAI_API_KEY,
    anthropic_api_key: process.env.ANTHROPIC_API_KEY,
    google_gemini_api_key: process.env.GOOGLE_GEMINI_API_KEY,
    mistral_api_key: process.env.MISTRAL_API_KEY,
    groq_api_key: process.env.GROQ_API_KEY,
    perplexity_api_key: process.env.PERPLEXITY_API_KEY,
    azure_openai_api_key: process.env.AZURE_OPENAI_API_KEY,
    openrouter_api_key: process.env.OPENROUTER_API_KEY,
    openai_organization_id: process.env.OPENAI_ORGANIZATION_ID,
    azure_openai_endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    azure_openai_35_turbo_id: process.env.AZURE_GPT_35_TURBO_NAME,
    azure_openai_45_vision_id: process.env.AZURE_GPT_45_VISION_NAME,
    azure_openai_45_turbo_id: process.env.AZURE_GPT_45_TURBO_NAME,
    azure_openai_embeddings_id: process.env.AZURE_EMBEDDINGS_NAME
  }

  for (const [key, value] of Object.entries(apiKeys)) {
    if (value) {
      (profile as any)[key] = value
    }
  }

  return profile
}

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === '') {
    throw new Error(`${keyName} API Key not found`)
  }
}