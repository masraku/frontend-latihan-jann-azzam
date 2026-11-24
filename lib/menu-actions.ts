'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchDenganToken } from './api-token'

// ===== Hapus menu (tombol di tabel, id lewat .bind(null, id)) =====

export async function hapusMenu(id: number) {
  const res = await fetchDenganToken(`/admin/menu/${id}`, { method: 'DELETE' })

  if (res.status === 401) redirect('/login')

  const json = await res.json().catch(() => ({}))

  // sidebar ada di layout /admin, jadi layout-nya juga harus ambil data baru
  if (res.ok) revalidatePath('/admin', 'layout')

  const kunci = res.ok ? 'pesan' : 'error'
  const isi = json.message ?? (res.status === 403 ? 'Anda tidak punya izin untuk aksi ini.' : 'Terjadi kesalahan.')

  redirect(`/admin/menu?${new URLSearchParams({ [kunci]: isi })}`)
}

// ===== Form tambah / edit menu =====

// Semua berupa string (isi <input>), kecuali checkbox
export type NilaiFormMenu = {
  nama_menu: string
  url: string
  id_permission: string // '' = semua user login
  urutan: string
  is_active: boolean
}

export type StateFormMenu = {
  pesan: string
  errors: Partial<Record<keyof NilaiFormMenu, string[]>>
  nilai: NilaiFormMenu
  percobaan: number // bertambah tiap submit, dipakai sebagai key form
}

// id = null → tambah menu baru (POST), id = angka → edit menu (PUT)
export async function simpanMenu(
  id: number | null,
  stateSebelumnya: StateFormMenu,
  formData: FormData,
): Promise<StateFormMenu> {
  const nilai: NilaiFormMenu = {
    nama_menu: String(formData.get('nama_menu') ?? ''),
    url: String(formData.get('url') ?? ''),
    id_permission: String(formData.get('id_permission') ?? ''),
    urutan: String(formData.get('urutan') ?? ''),
    is_active: formData.has('is_active'), // checkbox tidak dicentang = tidak ikut terkirim
  }

  // Ubah ke tipe yang diminta Laravel (JSON asli, bukan string semua)
  const body = {
    nama_menu: nilai.nama_menu,
    url: nilai.url,
    id_permission: nilai.id_permission === '' ? null : Number(nilai.id_permission),
    urutan: nilai.urutan === '' ? 0 : Number(nilai.urutan),
    is_active: nilai.is_active,
  }

  const percobaan = stateSebelumnya.percobaan + 1

  let res: Response
  try {
    res = await fetchDenganToken(id === null ? '/admin/menu' : `/admin/menu/${id}`, {
      method: id === null ? 'POST' : 'PUT',
      body: JSON.stringify(body),
    })
  } catch {
    return { pesan: 'Server tidak bisa dihubungi. Coba lagi nanti.', errors: {}, nilai, percobaan }
  }

  if (res.status === 401) redirect('/login')

  const json = await res.json().catch(() => ({}))

  // 422: error validasi per kolom, contoh { errors: { url: ['...'] } }
  if (!res.ok) {
    return {
      pesan: json.message ?? 'Gagal menyimpan menu.',
      errors: json.errors ?? {},
      nilai,
      percobaan,
    }
  }

  revalidatePath('/admin', 'layout') // HARUS sebelum redirect (redirect melempar)
  redirect(`/admin/menu?${new URLSearchParams({ pesan: json.message })}`)
}
