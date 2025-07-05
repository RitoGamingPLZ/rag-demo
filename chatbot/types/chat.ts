import { Assistant, FileItem, Message } from "@/lib/generated/prisma"
import { ChatMessage, LLMID } from "."

export interface ChatSettings {
  model: LLMID
  prompt: string
  temperature: number
  contextLength: number
  includeProfileContext: boolean
  includeWorkspaceInstructions: boolean
  embeddingsProvider: "openai" | "local"
}

export interface ChatPayload {
  chatSettings: ChatSettings
  workspaceInstructions: string
  chatMessages: ChatMessage[]
  assistant: Assistant | null
  messageFileItems: FileItem[]
  chatFileItems: FileItem[]
}

export interface ChatAPIPayload {
  chatSettings: ChatSettings
  messages: Message[]
}
