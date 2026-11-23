'use client' // error.tsx wajib Client Component karena tombolnya memakai onClick

import { useEffect } from 'react'

export default function KatalogError({ error, retry }: { error: unknown; retry: () => void }) {
  // Detail error hanya untuk developer (lihat di console browser).
  // Di mode production, Next.js sengaja menyembunyikan pesan error dari server.
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-bold text-red-600">Katalog gagal dimuat</h1>
        <p className="mb-6 text-gray-600">Server sedang tidak bisa dihubungi. Silakan coba beberapa saat lagi.</p>
        <button
          onClick={() => retry()}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
        >
          Coba lagi
        </button>
      </div>
    </main>
  )
}
