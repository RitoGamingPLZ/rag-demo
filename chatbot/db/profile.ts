import { prisma } from "@/lib/prisma/client"
import { Prisma } from "@/lib/generated/prisma"

export const getProfileByUserId = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  })

  return profile
}

export const getProfilesByUserId = async (userId: string) => {
  const profiles = await prisma.profile.findMany({
    where: { userId }
  })

  return profiles
}

export const createProfile = async (profile: Prisma.ProfileCreateInput) => {
  const createdProfile = await prisma.profile.create({
    data: profile
  })

  return createdProfile
}

export const updateProfile = async (
  profileId: string,
  profile: Prisma.ProfileUpdateInput
) => {
  const updatedProfile = await prisma.profile.update({
    where: { id: profileId },
    data: profile
  })

  return updatedProfile
}

export const deleteProfile = async (profileId: string) => {
  await prisma.profile.delete({
    where: { id: profileId }
  })

  return true
}
