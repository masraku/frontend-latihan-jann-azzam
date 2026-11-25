import { NextResponse, type NextRequest } from 'next/server'
import { NAMA_COOKIE_TOKEN } from '@/lib/konstanta'

// Pengecekan CEPAT sebelum halaman dibuat: "ada cookie token atau tidak?"
// Keabsahan token tetap dicek oleh Laravel lewat /api/me di halamannya.
export function proxy(request: NextRequest) {
  if (!request.cookies.has(NAMA_COOKIE_TOKEN)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/akun/:path*', '/admin/:path*', '/seller/:path*', '/buyer/:path*'],
}
