import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If accessing auth pages while logged in, redirect to dashboard
        if (
          token &&
          (req.nextUrl.pathname === '/login' ||
            req.nextUrl.pathname === '/register')
        ) {
          return false
        }

        // Require token for protected routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/purchases')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/categories')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/tags')) {
          return !!token
        }

        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/purchases/:path*',
    '/categories/:path*',
    '/tags/:path*',
    '/login',
    '/register',
  ],
}
