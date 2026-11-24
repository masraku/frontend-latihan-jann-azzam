import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilSemuaUser } from '@/lib/admin'
import AksesDitolak from '@/components/admin/akses-ditolak'
import PesanFlash from '@/components/admin/pesan-flash'
import ProdukPerToko from '@/components/admin/produk-per-toko'

export const metadata = {
  title: 'Toko & Produk',
}

type SearchParams = Promise<{ pesan?: string; error?: string }>

export default function TokoPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main>
      {/* Wajib Suspense: isinya membaca cookie, searchParams, dan data dari Laravel */}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <DaftarToko searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function DaftarToko({ searchParams }: { searchParams: SearchParams }) {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')

  // data toko diambil dari GET /api/admin/users, yang di Laravel butuh can:user.view
  if (!punyaIzin(admin, 'user.view')) return <AksesDitolak />

  const [{ pesan, error }, users] = await Promise.all([searchParams, ambilSemuaUser()])
  const sellers = users.filter((user) => user.role === 'seller')

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Toko & Produk ({sellers.length} toko)</h1>

      <PesanFlash pesan={pesan} error={error} />

      <ProdukPerToko sellers={sellers} bolehToggle={punyaIzin(admin, 'produk.toggle_status')} />
    </>
  )
}
