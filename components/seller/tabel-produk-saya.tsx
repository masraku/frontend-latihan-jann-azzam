import Link from 'next/link'
import type { Produk } from '@/lib/api'
import { hapusProduk } from '@/lib/seller-actions'
import { formatRupiah } from '@/lib/format'
import TombolSubmit from '@/components/admin/tombol-submit'

type Props = {
  produks: Produk[]
  bolehEdit: boolean
  bolehHapus: boolean
}

// Status dilihat dari sisi buyer: apakah produk ini muncul di katalog?
function StatusProduk({ produk }: { produk: Produk }) {
  if (!produk.is_active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Dinonaktifkan admin
      </span>
    )
  }

  if (produk.stok === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Stok habis
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Tampil di katalog
    </span>
  )
}

export default function TabelProdukSaya({ produks, bolehEdit, bolehHapus }: Props) {
  if (produks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="mb-1 font-semibold text-gray-700">Belum ada produk</p>
        <p className="text-sm text-gray-500">Klik &quot;+ Tambah Produk&quot; untuk mulai berjualan.</p>
      </div>
    )
  }

  const adaAksi = bolehEdit || bolehHapus

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-4 py-3">Foto</th>
            <th className="px-4 py-3">Nama Produk</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Harga</th>
            <th className="px-4 py-3">Stok</th>
            <th className="px-4 py-3">Status</th>
            {adaAksi && <th className="px-4 py-3 text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {produks.map((produk) => (
            <tr key={produk.id} className={produk.is_active ? '' : 'bg-gray-50 text-gray-400'}>
              <td className="px-4 py-2">
                {produk.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={produk.foto_url}
                    alt={produk.nama}
                    className={`h-14 w-14 rounded-lg object-cover ${produk.is_active ? '' : 'grayscale'}`}
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400">
                    no foto
                  </div>
                )}
              </td>
              <td className="px-4 py-2 font-medium">{produk.nama}</td>
              <td className="px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {produk.kategori.map((k) => (
                    <span key={k.id} className="rounded bg-brand-light px-1.5 py-0.5 text-xs text-brand-dark">
                      {k.nama}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{formatRupiah(produk.harga)}</td>
              <td className="px-4 py-2">{produk.stok}</td>
              <td className="px-4 py-2">
                <StatusProduk produk={produk} />
              </td>
              {adaAksi && (
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    {bolehEdit && (
                      <Link
                        href={`/seller/produk/${produk.id}/edit`}
                        className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                      >
                        Edit
                      </Link>
                    )}
                    {bolehHapus && (
                      <form action={hapusProduk.bind(null, produk.id)}>
                        <TombolSubmit
                          konfirmasi={`Hapus produk "${produk.nama}"? Foto produk juga akan dihapus.`}
                          className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                        >
                          Hapus
                        </TombolSubmit>
                      </form>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
