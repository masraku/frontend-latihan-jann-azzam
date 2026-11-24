import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilProdukSaya } from '@/lib/seller'
import AksesDitolak from '@/components/admin/akses-ditolak'
import PesanFlash from '@/components/admin/pesan-flash'
import TabelProdukSaya from '@/components/seller/tabel-produk-saya'

export const metadata = {
  title: 'Toko Saya',
}

type SearchParams = Promise<{ pesan?: string; error?: string }>

export default function SellerPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Wajib Suspense: isinya membaca cookie, searchParams, dan data dari Laravel */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardSeller searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function DashboardSeller({ searchParams }: { searchParams: SearchParams }) {
  const user = await ambilUserSaatIni()
  if (!user) redirect('/login')

  // sama seperti ->middleware('can:produk.create') di Laravel
  if (!punyaIzin(user, 'produk.create')) return <AksesDitolak pesan="Halaman ini khusus seller." />

  const [{ pesan, error }, produks] = await Promise.all([searchParams, ambilProdukSaya()])

  const statistik = [
    { label: 'Total produk', nilai: produks.length },
    { label: 'Tampil di katalog', nilai: produks.filter((p) => p.is_active && p.stok > 0).length },
    { label: 'Stok habis', nilai: produks.filter((p) => p.stok === 0).length },
    { label: 'Dinonaktifkan admin', nilai: produks.filter((p) => !p.is_active).length },
  ]

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.nama_toko ?? 'Toko Saya'}</h1>
          <p className="mt-1 text-gray-600">Halo, {user.nama}. Kelola produk tokomu di sini.</p>
        </div>
        <Link
          href="/seller/produk/baru"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          + Tambah Produk
        </Link>
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

      <h2 className="mb-3 text-xl font-bold">Produk Saya ({produks.length})</h2>
      <TabelProdukSaya
        produks={produks}
        bolehEdit={punyaIzin(user, 'produk.update_own')}
        bolehHapus={punyaIzin(user, 'produk.delete_own')}
      />
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
