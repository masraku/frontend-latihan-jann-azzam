import type { Metadata } from 'next'
import Link from 'next/link'
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
            <Link href="/" className="text-xl font-bold tracking-tight text-brand">
              Jann Azzam
            </Link>
            <Link
              href="/katalog"
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Katalog
            </Link>
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
