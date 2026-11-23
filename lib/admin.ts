import 'server-only'
import { notFound, redirect } from 'next/navigation'
import { fetchDenganToken } from './api-token'
import type { Kategori } from './api'

// ===== Bentuk data dari Laravel (lihat AdminUserResource dan AdminProdukResource) =====

export type AdminProduk = {
  id: number
  nama: string
  harga: number
  stok: number
  is_active: boolean
  foto_url: string | null
  kategori: Kategori[]
}

export type AdminUser = {
  id: number
  nama: string
  email: string
  id_role: number | null
  role: string | null
  nama_toko: string | null
  is_active: boolean
  produks_count?: number
  produk_aktif_count?: number
  produk?: AdminProduk[]
}

export type Role = {
  id: number
  nama: string
}

// ===== Pengambil data =====

async function ambilDariApi<T>(path: string): Promise<T> {
  const res = await fetchDenganToken(path)

  if (res.status === 401) redirect('/login') // token kedaluwarsa / dicabut
  if (res.status === 404) notFound()
  if (!res.ok) {
    throw new Error(`Gagal mengambil ${path} (status ${res.status})`)
  }

  const json: { data: T } = await res.json()
  return json.data
}

// semua user + produk masing-masing (isi dashboard admin)
export function ambilSemuaUser(): Promise<AdminUser[]> {
  return ambilDariApi('/admin/users')
}

export function ambilUser(id: string): Promise<AdminUser> {
  return ambilDariApi(`/admin/users/${encodeURIComponent(id)}`)
}

export function ambilRoles(): Promise<Role[]> {
  return ambilDariApi('/admin/roles')
}
