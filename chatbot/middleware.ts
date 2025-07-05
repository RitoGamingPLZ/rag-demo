import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"

export async function middleware(request: NextRequest) {
  const i18nResult = i18nRouter(request, i18nConfig)
  if (i18nResult) return i18nResult

  try {
    // Check for session cookie
    const session = request.cookies.get('session')
    
    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      // For now, redirect to a default workspace
      // In a real implementation, you would fetch the user's home workspace from the database
      const defaultWorkspaceId = 'default-workspace-id'
      
      return NextResponse.redirect(
        new URL(`/${defaultWorkspaceId}/chat`, request.url)
      )
    }

    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
