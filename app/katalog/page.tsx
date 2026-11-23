import { Suspense } from 'react'
import KatalogSkeleton from '@/components/katalog-skeleton'
import Katalog from './katalog'

export const metadata = {
  title: 'Katalog Produk',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function KatalogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Katalog Produk</h1>
        <p className="mt-1 text-gray-600">Temukan produk dari semua toko di Jann Azzam.</p>
      </div>

      {/* Wajib Suspense: isi katalog membaca searchParams dan mengambil data dari Laravel */}
      <Suspense fallback={<KatalogSkeleton />}>
        <Katalog searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
