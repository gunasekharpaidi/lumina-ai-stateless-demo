import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// All routes under /studio and all /api routes (except webhooks) require authentication
const isProtectedRoute = createRouteMatcher(['/studio(.*)', '/api((?!/webhooks/clerk).*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
      await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
