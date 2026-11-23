import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilSemuaUser } from '@/lib/admin'
import AksesDitolak from '@/components/admin/akses-ditolak'
import PesanFlash from '@/components/admin/pesan-flash'
import ProdukPerToko from '@/components/admin/produk-per-toko'
import TabelUser from '@/components/admin/tabel-user'

export const metadata = {
  title: 'Dashboard Admin',
}

type SearchParams = Promise<{ pesan?: string; error?: string }>

export default function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Wajib Suspense: isinya membaca cookie, searchParams, dan data dari Laravel */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardAdmin searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function DashboardAdmin({ searchParams }: { searchParams: SearchParams }) {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')

  // sama seperti ->middleware('can:user.view') di Laravel
  if (!punyaIzin(admin, 'user.view')) return <AksesDitolak />

  // dua-duanya jalan bersamaan, tidak saling menunggu
  const [{ pesan, error }, users] = await Promise.all([searchParams, ambilSemuaUser()])

  const sellers = users.filter((user) => user.role === 'seller')
  const semuaProduk = sellers.flatMap((seller) => seller.produk ?? [])

  const statistik = [
    { label: 'Total user', nilai: users.length },
    { label: 'User aktif', nilai: users.filter((u) => u.is_active).length },
    { label: 'Toko (seller)', nilai: sellers.length },
    { label: 'Produk aktif', nilai: `${semuaProduk.filter((p) => p.is_active).length} / ${semuaProduk.length}` },
  ]

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="mt-1 text-gray-600">
            Halo, {admin.nama} <span className="capitalize">({admin.role})</span>
          </p>
        </div>
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

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statistik.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{s.nilai}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xl font-bold">Daftar User ({users.length})</h2>
      <div className="mb-10">
        <TabelUser users={users} admin={admin} />
      </div>

      <h2 className="mb-3 text-xl font-bold">Produk per Toko</h2>
      <ProdukPerToko sellers={sellers} bolehToggle={punyaIzin(admin, 'produk.toggle_status')} />
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-9 w-64 rounded bg-gray-200" />
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-80 rounded-xl bg-gray-100" />
    </div>
  )
}
