import Link from 'next/link'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { keluar } from '@/lib/auth-actions'

export default async function MenuAkun() {
  const user = await ambilUserSaatIni()

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        Masuk
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {punyaIzin(user, 'user.view') && (
        <Link
          href="/admin"
          className="rounded-full px-2.5 py-2 text-sm font-medium text-gray-700 sm:px-4 transition hover:bg-gray-100"
        >
          Admin
        </Link>
      )}
      {punyaIzin(user, 'produk.create') && (
        <Link
          href="/seller"
          className="rounded-full px-2.5 py-2 text-sm font-medium text-gray-700 sm:px-4 transition hover:bg-gray-100"
        >
          Toko Saya
        </Link>
      )}
      {user.role === 'buyer' && (
        <Link
          href="/buyer"
          className="rounded-full px-2.5 py-2 text-sm font-medium text-gray-700 sm:px-4 transition hover:bg-gray-100"
        >
          Belanja
        </Link>
      )}
      <Link
        href="/akun"
        className="rounded-full px-2.5 py-2 text-sm font-medium text-gray-700 sm:px-4 transition hover:bg-gray-100"
      >
        {user.nama}
      </Link>
      {/* di HP tombol Keluar disembunyikan (ada di halaman /akun) supaya header muat */}
      <form action={keluar} className="hidden sm:block">
        <button
          type="submit"
          className="rounded-full px-2.5 py-2 text-sm font-medium text-gray-500 sm:px-4 transition hover:bg-gray-100"
        >
          Keluar
        </button>
      </form>
    </div>
  )
}
