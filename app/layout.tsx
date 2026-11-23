import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import MenuAkun from '@/components/menu-akun'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Jann Azzam',
    template: '%s · Jann Azzam', // halaman katalog → "Katalog Produk · Jann Azzam"
  },
  description: 'Toko online Jann Azzam',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="whitespace-nowrap text-xl font-bold tracking-tight text-brand">
              Jann Azzam
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/katalog"
                className="rounded-full px-2.5 py-2 text-sm font-medium text-gray-700 sm:px-4 transition hover:bg-gray-100"
              >
                Katalog
              </Link>

              {/* Wajib Suspense: MenuAkun membaca cookie */}
              <Suspense fallback={<div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />}>
                <MenuAkun />
              </Suspense>
            </div>
          </nav>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
          © Jann Azzam
        </footer>
      </body>
    </html>
  )
}
