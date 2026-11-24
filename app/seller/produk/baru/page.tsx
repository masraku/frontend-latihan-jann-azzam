import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilKategori } from '@/lib/api'
import { simpanProduk } from '@/lib/seller-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import FormProduk from '@/components/seller/form-produk'

export const metadata = {
  title: 'Tambah Produk',
}

export default function TambahProdukPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Tambah Produk</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <IsiForm />
      </Suspense>
    </main>
  )
}

async function IsiForm() {
  const user = await ambilUserSaatIni()
  if (!user) redirect('/login')
  if (!punyaIzin(user, 'produk.create')) return <AksesDitolak pesan="Halaman ini khusus seller." />

  const kategoris = await ambilKategori()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <FormProduk
        aksi={simpanProduk.bind(null, null)} // null = produk baru
        nilaiAwal={{ nama_produk: '', harga: '', stok: '', kategori_ids: [] }}
        kategoris={kategoris}
        fotoLama={null}
        modeEdit={false}
      />
    </div>
  )
}
