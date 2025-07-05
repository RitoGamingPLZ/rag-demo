import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getModelById = async (modelId: string) => {
  const model = await prisma.model.findUnique({
    where: { id: modelId }
  })

  if (!model) {
    throw new Error("Model not found")
  }

  return model
}

export const getModelWorkspacesByWorkspaceId = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      modelWorkspaces: {
        include: {
          model: true
        }
      }
    }
  })

  if (!workspace) {
    throw new Error("Workspace not found")
  }

  return workspace
}

export const getModelWorkspacesByModelId = async (modelId: string) => {
  const model = await prisma.model.findUnique({
    where: { id: modelId },
    select: {
      id: true,
      name: true,
      modelWorkspaces: {
        include: {
          workspace: true
        }
      }
    }
  })

  if (!model) {
    throw new Error("Model not found")
  }

  return model
}

export const createModel = async (
  model: Prisma.ModelCreateInput,
  workspace_id: string
) => {
  const createdModel = await prisma.model.create({
    data: model
  })

  await createModelWorkspace({
    user_id: createdModel.userId,
    model_id: createdModel.id,
    workspace_id: workspace_id
  })

  return createdModel
}

export const createModels = async (
  models: Prisma.ModelCreateManyInput[],
  workspace_id: string
) => {
  const createdModels = await prisma.model.createMany({
    data: models
  })

  // Note: createMany doesn't return the created records, so we need to fetch them
  const modelRecords = await prisma.model.findMany({
    where: {
      id: { in: models.map(m => m.id) }
    }
  })

  await createModelWorkspaces(
    modelRecords.map(model => ({
      user_id: model.userId,
      model_id: model.id,
      workspace_id
    }))
  )

  return modelRecords
}

export const createModelWorkspace = async (item: {
  user_id: string
  model_id: string
  workspace_id: string
}) => {
  const createdModelWorkspace = await prisma.modelWorkspace.create({
    data: {
      userId: item.user_id,
      modelId: item.model_id,
      workspaceId: item.workspace_id
    }
  })

  return createdModelWorkspace
}

export const createModelWorkspaces = async (
  items: { user_id: string; model_id: string; workspace_id: string }[]
) => {
  const createdModelWorkspaces = await prisma.modelWorkspace.createMany({
    data: items.map(item => ({
      userId: item.user_id,
      modelId: item.model_id,
      workspaceId: item.workspace_id
    }))
  })

  return createdModelWorkspaces
}

export const updateModel = async (
  modelId: string,
  model: Prisma.ModelUpdateInput
) => {
  const updatedModel = await prisma.model.update({
    where: { id: modelId },
    data: model
  })

  return updatedModel
}

export const deleteModel = async (modelId: string) => {
  await prisma.model.delete({
    where: { id: modelId }
  })

  return true
}

export const deleteModelWorkspace = async (
  modelId: string,
  workspaceId: string
) => {
  await prisma.modelWorkspace.delete({
    where: {
      modelId_workspaceId: {
        modelId,
        workspaceId
      }
    }
  })

  return true
}
