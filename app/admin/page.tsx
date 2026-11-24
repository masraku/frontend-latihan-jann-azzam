import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilSemuaUser } from '@/lib/admin'
import AksesDitolak from '@/components/admin/akses-ditolak'

export const metadata = {
  title: 'Ringkasan Admin',
}

export default function AdminPage() {
  return (
    <main>
      {/* Wajib Suspense: isinya membaca cookie dan data dari Laravel */}
      <Suspense fallback={<RingkasanSkeleton />}>
        <Ringkasan />
      </Suspense>
    </main>
  )
}

async function Ringkasan() {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')

  // sama seperti ->middleware('can:user.view') di Laravel
  if (!punyaIzin(admin, 'user.view')) return <AksesDitolak />

  const users = await ambilSemuaUser()

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ringkasan</h1>
        <p className="mt-1 text-gray-600">
          Halo, {admin.nama} <span className="capitalize">({admin.role})</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statistik.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{s.nilai}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function RingkasanSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-9 w-64 rounded bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  )
}
