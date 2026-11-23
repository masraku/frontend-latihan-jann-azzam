import type { Produk } from '@/lib/api'
import { formatRupiah } from '@/lib/format'

export default function KartuProduk({ produk }: { produk: Produk }) {
  const stokMenipis = produk.stok <= 5

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square bg-gray-100">
        {produk.foto_url ? (
          // next/image memblokir gambar dari 127.0.0.1, jadi pakai <img> biasa
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produk.foto_url}
            alt={produk.nama}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">Tidak ada foto</div>
        )}

        {stokMenipis && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
            Sisa {produk.stok}
          </span>
        )}
      </div>

      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-gray-900">{produk.nama}</h3>

        <p className="text-lg font-bold text-brand">{formatRupiah(produk.harga)}</p>

        <div className="flex flex-wrap gap-1">
          {produk.kategori.map((k) => (
            <span key={k.id} className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-dark">
              {k.nama}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-xs text-gray-500">
          <span className="truncate">{produk.toko.nama}</span>
          <span className="shrink-0">Stok {produk.stok}</span>
        </div>
      </div>
    </article>
  )
}
