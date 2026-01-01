import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // PWA whitelist to prevent 401 on static assets if auth is enabled
    const publicPaths = [
        '/manifest.json',
        '/sw.js',
        '/icons',
        '/images',
        '/sounds',
        '/globe.svg',
        '/next.svg',
        '/vercel.svg',
        '/favicon.ico',
        '/avatars' // Whitelist avatars directory
    ]

    if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // Default behavior (continue)
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
