import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getPresetById = async (presetId: string) => {
  const preset = await prisma.preset.findUnique({
    where: { id: presetId }
  })

  if (!preset) {
    throw new Error("Preset not found")
  }

  return preset
}

export const getPresetWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      presetWorkspaces: {
        include: {
          preset: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getPresetWorkspacesByPresetId = async (presetId: string) => {
  const preset = await prisma.preset.findUnique({
    where: { id: presetId },
    select: {
      id: true,
      name: true,
      presetWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!preset) {
    throw new Error("Preset not found")
  }

  return preset
}

export const createPreset = async (
  preset: Prisma.PresetCreateInput,
  workspace_id: string
) => {
  const createdPreset = await prisma.preset.create({
    data: preset
  })

  await createPresetWorkspace({
    user_id: createdPreset.userId,
    preset_id: createdPreset.id,
    workspace_id: workspace_id
  })

  return createdPreset
}

export const createPresets = async (
  presets: Prisma.PresetCreateManyInput[],
  workspace_id: string
) => {
  const createdPresets = await prisma.preset.createMany({
    data: presets
  })

  // Note: createMany doesn't return the created records, so we need to fetch them
  const presetRecords = await prisma.preset.findMany({
    where: {
      id: { in: presets.map(p => p.id) }
    }
  })

  await createPresetWorkspaces(
    presetRecords.map(preset => ({
      user_id: preset.userId,
      preset_id: preset.id,
      workspace_id
    }))
  )

  return presetRecords
}

export const createPresetWorkspace = async (item: {
  user_id: string
  preset_id: string
  workspace_id: string
}) => {
  const createdPresetWorkspace = await prisma.presetWorkspace.create({
    data: {
      userId: item.user_id,
      presetId: item.preset_id,
      workspaceId: item.workspace_id
    }
  })

  return createdPresetWorkspace
}

export const createPresetWorkspaces = async (
  items: { user_id: string; preset_id: string; workspace_id: string }[]
) => {
  const createdPresetWorkspaces = await prisma.presetWorkspace.createMany({
    data: items.map(item => ({
      userId: item.user_id,
      presetId: item.preset_id,
      workspaceId: item.workspace_id
    }))
  })

  return createdPresetWorkspaces
}

export const updatePreset = async (
  presetId: string,
  preset: Prisma.PresetUpdateInput
) => {
  const updatedPreset = await prisma.preset.update({
    where: { id: presetId },
    data: preset
  })

  return updatedPreset
}

export const deletePreset = async (presetId: string) => {
  await prisma.preset.delete({
    where: { id: presetId }
  })

  return true
}

export const deletePresetWorkspace = async (
  presetId: string,
  workspaceId: string
) => {
  await prisma.presetWorkspace.delete({
    where: {
      presetId_workspaceId: {
        presetId,
        workspaceId
      }
    }
  })

  return true
}