'use server'

import { redirect } from 'next/navigation'
import { fetchDenganToken } from './api-token'

export type NilaiFormProduk = {
  nama_produk: string
  harga: string
  stok: string
  kategori_ids: string[]
}

type KolomProduk = keyof NilaiFormProduk | 'photo'

export type StateFormProduk = {
  pesan: string
  errors: Partial<Record<KolomProduk, string[]>>
  nilai: NilaiFormProduk
  percobaan: number
}

// id = null → produk baru, id = angka → edit produk
export async function simpanProduk(
  id: number | null,
  stateSebelumnya: StateFormProduk,
  formData: FormData,
): Promise<StateFormProduk> {
  const nilai: NilaiFormProduk = {
    nama_produk: String(formData.get('nama_produk') ?? ''),
    harga: String(formData.get('harga') ?? ''),
    stok: String(formData.get('stok') ?? ''),
    kategori_ids: formData.getAll('kategori_ids').map(String), // checkbox → bisa lebih dari satu
  }
  const percobaan = stateSebelumnya.percobaan + 1

  // Susun ulang data untuk Laravel. Pakai FormData (bukan JSON) karena ada file foto
  const dataLaravel = new FormData()
  dataLaravel.append('nama_produk', nilai.nama_produk)
  dataLaravel.append('harga', nilai.harga)
  dataLaravel.append('stok', nilai.stok)
  for (const kategoriId of nilai.kategori_ids) {
    dataLaravel.append('kategori_ids[]', kategoriId) // [] → Laravel membacanya sebagai array
  }

  // input file yang tidak diisi tetap terkirim sebagai file kosong (size 0)
  const foto = formData.get('photo')
  if (foto instanceof File && foto.size > 0) {
    dataLaravel.append('photo', foto)
  }

  // PHP tidak bisa membaca file dari request PUT, jadi kirim POST + _method=PUT
  if (id !== null) {
    dataLaravel.append('_method', 'PUT')
  }

  let res: Response
  try {
    res = await fetchDenganToken(id === null ? '/seller/produk' : `/seller/produk/${id}`, {
      method: 'POST',
      body: dataLaravel,
    })
  } catch {
    return { pesan: 'Server tidak bisa dihubungi. Coba lagi nanti.', errors: {}, nilai, percobaan }
  }

  if (res.status === 401) redirect('/login')

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    // Laravel memberi kunci seperti "kategori_ids.0" → gabungkan jadi "kategori_ids"
    const errors: StateFormProduk['errors'] = {}
    for (const [kunci, pesan] of Object.entries<string[]>(json.errors ?? {})) {
      const kolom = kunci.split('.')[0] as KolomProduk
      errors[kolom] = [...(errors[kolom] ?? []), ...pesan]
    }

    return {
      pesan: res.status === 403 ? 'Anda tidak boleh mengubah produk ini.' : (json.message ?? 'Gagal menyimpan produk.'),
      errors,
      nilai,
      percobaan,
    }
  }

  redirect(`/seller?${new URLSearchParams({ pesan: json.message })}`)
}

export async function hapusProduk(id: number) {
  const res = await fetchDenganToken(`/seller/produk/${id}`, { method: 'DELETE' })

  if (res.status === 401) redirect('/login')

  const json = await res.json().catch(() => ({}))
  const kunci = res.ok ? 'pesan' : 'error'
  const isi = json.message ?? (res.status === 403 ? 'Anda tidak boleh menghapus produk ini.' : 'Gagal menghapus produk.')

  redirect(`/seller?${new URLSearchParams({ [kunci]: isi })}`)
}
