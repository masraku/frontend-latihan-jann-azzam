import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">Toko Online</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Belanja kebutuhan harian dari toko-toko terdekat
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Alat tulis, makanan, minuman, dan lainnya. Semua dari seller pilihan.
        </p>
        <Link
          href="/katalog"
          className="inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Lihat Katalog
        </Link>
      </div>
    </main>
  )
}
