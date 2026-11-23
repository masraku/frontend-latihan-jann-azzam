import FilterKatalog from '@/components/filter-katalog'
import KartuProduk from '@/components/kartu-produk'
import Paginasi from '@/components/paginasi'
import { ambilKategori, ambilProduk } from '@/lib/api'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// ?kategori=1&kategori=2 menghasilkan array, jadi ambil yang pertama saja
function ambilSatu(nilai: string | string[] | undefined): string {
  if (Array.isArray(nilai)) return nilai[0] ?? ''
  return nilai ?? ''
}

export default async function Katalog({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const cari = ambilSatu(sp.cari)
  const kategori = ambilSatu(sp.kategori)
  const urut = ambilSatu(sp.urut) || 'terbaru'
  const halaman = ambilSatu(sp.page) || '1'

  const params = new URLSearchParams()
  if (cari) params.set('cari', cari)
  if (kategori) params.set('kategori', kategori)
  params.set('urut', urut)
  params.set('page', halaman)

  // dua request ke Laravel dijalankan bersamaan
  const [hasil, daftarKategori] = await Promise.all([ambilProduk(params), ambilKategori()])
  const { data: produks, meta } = hasil

  return (
    <>
      <FilterKatalog cari={cari} kategori={kategori} urut={urut} daftarKategori={daftarKategori} />

      <p className="mb-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{meta.total}</span> produk ditemukan
      </p>

      {produks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-lg font-medium text-gray-700">Tidak ada produk yang cocok</p>
          <p className="mt-1 text-sm text-gray-500">Coba kata kunci atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {produks.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}

      <Paginasi halamanSekarang={meta.current_page} halamanTerakhir={meta.last_page} params={params} />
    </>
  )
}
