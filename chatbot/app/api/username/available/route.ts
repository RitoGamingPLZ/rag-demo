import { db } from "@/lib/db"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { username } = json as {
    username: string
  }

  try {
    const existingProfile = await db.profile.findUnique({
      where: {
        username: username
      },
      select: {
        username: true
      }
    })

    return new Response(JSON.stringify({ isAvailable: !existingProfile }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
