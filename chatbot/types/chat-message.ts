import { Message } from "@/lib/generated/prisma"

export interface ChatMessage {
  message: Message
  fileItems: string[]
}
