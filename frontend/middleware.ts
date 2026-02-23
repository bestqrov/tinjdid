import { NextRequest, NextResponse } from 'next/server'

// simple middleware to protect app routes (client must set access_token in cookie/localStorage)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  console.log(`[Middleware] Path: ${pathname} | Host: ${req.headers.get('host')} | Proto: ${req.headers.get('x-forwarded-proto')}`)

  // public paths - landing page, login, reset password, forgot password, demo requests
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  ) {
    return NextResponse.next()
  }

  // TEMPORARILY DISABLED AUTH CHECK (Debug 404)
  return NextResponse.next()

  // rudimentary check: redirect to /login when cookie missing (improve with secure cookies)
  const token = req.cookies.get('access_token')?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
