import type { AdminUser } from '@/lib/admin'
import { toggleStatusProduk } from '@/lib/admin-actions'
import { formatRupiah } from '@/lib/format'
import BadgeStatus from './badge-status'
import TombolSubmit from './tombol-submit'

export default function ProdukPerToko({ sellers, bolehToggle }: { sellers: AdminUser[]; bolehToggle: boolean }) {
  return (
    <div className="space-y-6">
      {sellers.map((seller) => (
        <section key={seller.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div>
              <h3 className="font-semibold">{seller.nama_toko ?? 'Tanpa nama toko'}</h3>
              <p className="text-xs text-gray-500">
                {seller.nama} · {seller.produk?.length ?? 0} produk
              </p>
            </div>
            {!seller.is_active && (
              <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                Seller nonaktif: semua produknya tersembunyi dari buyer
              </span>
            )}
          </header>

          {!seller.produk?.length ? (
            <p className="px-4 py-6 text-center text-sm italic text-gray-400">Belum ada produk.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Foto</th>
                    <th className="px-4 py-2">Nama Produk</th>
                    <th className="px-4 py-2">Kategori</th>
                    <th className="px-4 py-2">Harga</th>
                    <th className="px-4 py-2">Stok</th>
                    <th className="px-4 py-2">Status</th>
                    {bolehToggle && <th className="px-4 py-2 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {seller.produk.map((produk) => (
                    <tr key={produk.id} className={produk.is_active ? '' : 'bg-gray-50 text-gray-400'}>
                      <td className="px-4 py-2">
                        {produk.foto_url ? (
                          // <img> biasa: next/image menolak gambar dari 127.0.0.1
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
                          {produk.kategori.length ? (
                            produk.kategori.map((k) => (
                              <span key={k.id} className="rounded bg-brand-light px-1.5 py-0.5 text-xs text-brand-dark">
                                {k.nama}
                              </span>
                            ))
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{formatRupiah(produk.harga)}</td>
                      <td className="px-4 py-2">{produk.stok}</td>
                      <td className="px-4 py-2">
                        <BadgeStatus aktif={produk.is_active} />
                      </td>
                      {bolehToggle && (
                        <td className="px-4 py-2 text-right">
                          <form action={toggleStatusProduk.bind(null, produk.id)}>
                            <TombolSubmit
                              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                produk.is_active
                                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {produk.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            </TombolSubmit>
                          </form>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
