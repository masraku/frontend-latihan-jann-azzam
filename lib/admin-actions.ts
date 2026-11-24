'use server'

import { redirect } from 'next/navigation'
import { fetchDenganToken } from './api-token'

// Setelah aksi selesai, kembali ke halaman asal (tujuan) membawa pesan
// (mirip ->with('pesan', ...) dan ->with('error', ...) di Laravel)
function kembaliKe(tujuan: string, res: Response, message: string | undefined): never {
  if (res.status === 401) redirect('/login')

  const kunci = res.ok ? 'pesan' : 'error'
  const isi = message ?? (res.status === 403 ? 'Anda tidak punya izin untuk aksi ini.' : 'Terjadi kesalahan.')

  redirect(`${tujuan}?${new URLSearchParams({ [kunci]: isi })}`)
}

async function kirim(path: string, method: string, tujuan: string): Promise<never> {
  const res = await fetchDenganToken(path, { method })
  const json = await res.json().catch(() => ({}))
  kembaliKe(tujuan, res, json.message)
}

// ===== Aksi tombol di tabel =====
// id dikirim lewat .bind(null, id) dari komponen, bukan dari isi form

export async function toggleStatusUser(id: number) {
  await kirim(`/admin/users/${id}/status`, 'PATCH', '/admin/users')
}

export async function hapusUser(id: number) {
  await kirim(`/admin/users/${id}`, 'DELETE', '/admin/users')
}

export async function toggleStatusProduk(id: number) {
  await kirim(`/admin/produk/${id}/status`, 'PATCH', '/admin/toko')
}

// ===== Form tambah / edit user =====

export type NilaiFormUser = {
  name: string
  email: string
  id_role: string
  nama_toko: string
}

export type StateFormUser = {
  pesan: string
  errors: Partial<Record<keyof NilaiFormUser | 'password', string[]>>
  nilai: NilaiFormUser
  percobaan: number // bertambah tiap submit, dipakai sebagai key form
}

// id = null → tambah user baru (POST), id = angka → edit user (PUT)
export async function simpanUser(
  id: number | null,
  stateSebelumnya: StateFormUser,
  formData: FormData,
): Promise<StateFormUser> {
  const nilai: NilaiFormUser = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    id_role: String(formData.get('id_role') ?? ''),
    nama_toko: String(formData.get('nama_toko') ?? ''),
  }

  const body = {
    ...nilai,
    nama_toko: nilai.nama_toko || null, // kosong → null di database
    password: String(formData.get('password') ?? ''),
    password_confirmation: String(formData.get('password_confirmation') ?? ''),
  }

  const percobaan = stateSebelumnya.percobaan + 1

  let res: Response
  try {
    res = await fetchDenganToken(id === null ? '/admin/users' : `/admin/users/${id}`, {
      method: id === null ? 'POST' : 'PUT',
      body: JSON.stringify(body),
    })
  } catch {
    return { pesan: 'Server tidak bisa dihubungi. Coba lagi nanti.', errors: {}, nilai, percobaan }
  }

  if (res.status === 401) redirect('/login')

  const json = await res.json().catch(() => ({}))

  // 422: error validasi per kolom, contoh { errors: { email: ['...'] } }
  if (!res.ok) {
    return {
      pesan: json.message ?? 'Gagal menyimpan user.',
      errors: json.errors ?? {},
      nilai,
      percobaan,
    }
  }

  redirect(`/admin/users?${new URLSearchParams({ pesan: json.message })}`)
}
