import { getServerProfile as getProfile, checkApiKey } from "@/lib/auth"

export async function getServerProfile() {
  return await getProfile()
}

export { checkApiKey }
