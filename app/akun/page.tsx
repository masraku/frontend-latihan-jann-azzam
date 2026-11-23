import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni } from '@/lib/auth'
import { keluar } from '@/lib/auth-actions'

export const metadata = {
  title: 'Akun Saya',
}

export default function AkunPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Akun Saya</h1>

      {/* Wajib Suspense: DetailAkun membaca cookie */}
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white" />}>
        <DetailAkun />
      </Suspense>
    </main>
  )
}

async function DetailAkun() {
  const user = await ambilUserSaatIni()

  // token tidak ada, kedaluwarsa, dicabut, atau akun nonaktif
  if (!user) redirect('/login')

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-semibold">{user.nama}</p>
          <p className="text-gray-600">{user.email}</p>
          {user.nama_toko && <p className="mt-1 text-sm text-gray-500">{user.nama_toko}</p>}
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-semibold capitalize text-brand-dark">
          {user.role ?? 'tanpa role'}
        </span>
      </div>

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Hak akses</h2>
      <ul className="mb-6 flex flex-wrap gap-2">
        {user.permissions.map((p) => (
          <li key={p} className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
            {p}
          </li>
        ))}
      </ul>

      <form action={keluar}>
        <button
          type="submit"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Keluar
        </button>
      </form>
    </div>
  )
}
