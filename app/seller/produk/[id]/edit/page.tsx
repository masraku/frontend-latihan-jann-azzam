import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilKategori } from '@/lib/api'
import { ambilSatuProdukSaya } from '@/lib/seller'
import { simpanProduk } from '@/lib/seller-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import FormProduk from '@/components/seller/form-produk'

export const metadata = {
  title: 'Edit Produk',
}

// params juga Promise di Next.js 16, sama seperti searchParams
type Params = Promise<{ id: string }>

export default function EditProdukPage({ params }: { params: Params }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit Produk</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <IsiForm params={params} />
      </Suspense>
    </main>
  )
}

async function IsiForm({ params }: { params: Params }) {
  const user = await ambilUserSaatIni()
  if (!user) redirect('/login')
  if (!punyaIzin(user, 'produk.update_own')) {
    return <AksesDitolak pesan="Anda tidak punya izin mengubah produk." />
  }

  const { id } = await params
  // produk milik seller lain → Laravel 403 → notFound() (404), supaya keberadaannya tidak bocor
  const [produk, kategoris] = await Promise.all([ambilSatuProdukSaya(id), ambilKategori()])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-6 text-sm text-gray-500">
        Mengubah produk <span className="font-semibold text-gray-900">{produk.nama}</span>
      </p>
      <FormProduk
        aksi={simpanProduk.bind(null, produk.id)}
        nilaiAwal={{
          nama_produk: produk.nama,
          harga: String(produk.harga),
          stok: String(produk.stok),
          kategori_ids: produk.kategori.map((k) => String(k.id)),
        }}
        kategoris={kategoris}
        fotoLama={produk.foto_url}
        modeEdit
      />
    </div>
  )
}
