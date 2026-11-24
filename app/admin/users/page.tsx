import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilSemuaUser } from '@/lib/admin'
import AksesDitolak from '@/components/admin/akses-ditolak'
import PesanFlash from '@/components/admin/pesan-flash'
import TabelUser from '@/components/admin/tabel-user'

export const metadata = {
  title: 'Kelola User',
}

type SearchParams = Promise<{ pesan?: string; error?: string }>

export default function KelolaUserPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main>
      {/* Wajib Suspense: isinya membaca cookie, searchParams, dan data dari Laravel */}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <DaftarUser searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function DaftarUser({ searchParams }: { searchParams: SearchParams }) {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')
  if (!punyaIzin(admin, 'user.view')) return <AksesDitolak />

  // dua-duanya jalan bersamaan, tidak saling menunggu
  const [{ pesan, error }, users] = await Promise.all([searchParams, ambilSemuaUser()])

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Kelola User ({users.length})</h1>
        {punyaIzin(admin, 'user.create') && (
          <Link
            href="/admin/users/baru"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            + Tambah User
          </Link>
        )}
      </div>

      <PesanFlash pesan={pesan} error={error} />

      <TabelUser users={users} admin={admin} />
    </>
  )
}
