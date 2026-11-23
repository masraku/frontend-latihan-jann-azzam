// Menampilkan ?pesan=... (hijau) atau ?error=... (merah) dari Server Action
export default function PesanFlash({ pesan, error }: { pesan?: string; error?: string }) {
  if (error) {
    return (
      <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    )
  }

  if (pesan) {
    return (
      <p role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {pesan}
      </p>
    )
  }

  return null
}
