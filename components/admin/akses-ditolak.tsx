import Link from 'next/link'

export default function AksesDitolak({ pesan = 'Halaman ini khusus admin.' }: { pesan?: string }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <p className="mb-2 text-4xl font-bold text-gray-300">403</p>
      <h2 className="mb-2 text-xl font-bold">Tidak punya akses</h2>
      <p className="mb-6 text-gray-600">{pesan}</p>
      <Link
        href="/akun"
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
      >
        Kembali ke akun saya
      </Link>
    </div>
  )
}
