import { Collection, Chat, Preset, Prompt, File, Assistant, Tool, Model } from "@/lib/generated/prisma"

export type DataListType =
  | Collection[]
  | Chat[]
  | Preset[]
  | Prompt[]
  | File[]
  | Assistant[]
  | Tool[]
  | Model[]

export type DataItemType =
  | Collection
  | Chat
  | Preset
  | Prompt
  | File
  | Assistant
  | Tool
  | Model
