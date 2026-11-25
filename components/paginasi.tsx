import Link from 'next/link'

type Props = {
  alamat: string // halaman tujuan saat pindah halaman
  halamanSekarang: number
  halamanTerakhir: number
  params: URLSearchParams // filter yang sedang aktif, supaya ikut terbawa saat pindah halaman
}

const gayaTombol =
  'rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50'

export default function Paginasi({ alamat, halamanSekarang, halamanTerakhir, params }: Props) {
  if (halamanTerakhir <= 1) return null

  function urlHalaman(nomor: number): string {
    const p = new URLSearchParams(params)
    p.set('page', String(nomor))
    return `${alamat}?${p}`
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-3">
      {halamanSekarang > 1 ? (
        <Link href={urlHalaman(halamanSekarang - 1)} className={gayaTombol}>
          &laquo; Sebelumnya
        </Link>
      ) : (
        <span className={`${gayaTombol} pointer-events-none opacity-40`}>&laquo; Sebelumnya</span>
      )}

      <span className="text-sm text-gray-600">
        Halaman <span className="font-semibold text-gray-900">{halamanSekarang}</span> dari {halamanTerakhir}
      </span>

      {halamanSekarang < halamanTerakhir ? (
        <Link href={urlHalaman(halamanSekarang + 1)} className={gayaTombol}>
          Berikutnya &raquo;
        </Link>
      ) : (
        <span className={`${gayaTombol} pointer-events-none opacity-40`}>Berikutnya &raquo;</span>
      )}
    </nav>
  )
}
