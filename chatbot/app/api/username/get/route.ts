import { db } from "@/lib/db"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { userId } = json as {
    userId: string
  }

  try {
    const profile = await db.profile.findUnique({
      where: {
        userId: userId
      },
      select: {
        username: true
      }
    })

    if (!profile) {
      throw new Error("Profile not found")
    }

    return new Response(JSON.stringify({ username: profile.username }), {
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
