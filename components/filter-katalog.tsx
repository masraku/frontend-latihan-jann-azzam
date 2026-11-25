import Form from 'next/form'
import Link from 'next/link'
import type { Kategori } from '@/lib/api'

type Props = {
  alamat: string // tujuan Form dan link Reset
  cari: string
  kategori: string
  urut: string
  daftarKategori: Kategori[]
}

const gayaInput =
  'rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function FilterKatalog({ alamat, cari, kategori, urut, daftarKategori }: Props) {
  return (
    // <Form> dari next/form: isian berubah jadi ?cari=...&kategori=... tanpa memuat ulang halaman
    <Form
      action={alamat}
      className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto]"
    >
      <input
        name="cari"
        type="search"
        defaultValue={cari}
        placeholder="Cari nama produk..."
        className={gayaInput}
      />

      <select name="kategori" defaultValue={kategori} className={gayaInput}>
        <option value="">Semua kategori</option>
        {daftarKategori.map((k) => (
          <option key={k.id} value={k.id}>
            {k.nama}
          </option>
        ))}
      </select>

      <select name="urut" defaultValue={urut} className={gayaInput}>
        <option value="terbaru">Terbaru</option>
        <option value="termurah">Harga termurah</option>
        <option value="termahal">Harga termahal</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Terapkan
        </button>
        <Link
          href={alamat}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Reset
        </Link>
      </div>
    </Form>
  )
}