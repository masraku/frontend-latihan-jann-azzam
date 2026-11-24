import 'server-only'
import { redirect } from 'next/navigation'
import { fetchDenganToken } from './api-token'
import { ambilDariApi } from './admin'

// ===== Bentuk data dari Laravel (lihat MenuResource) =====

export type Menu = {
  id: number
  nama: string
  url: string
  urutan: number
  is_active: boolean
  id_permission: number | null
  permission?: string | null // hanya ada di /admin/menu, tidak ada di /menu
}

export type PermissionOpsi = {
  id: number
  nama: string
  keterangan: string | null
}

// ===== Sidebar =====
// Sidebar muncul di SEMUA halaman /admin, jadi kalau gagal jangan sampai
// seluruh halaman ikut error. Cukup kembalikan [] (sidebar kosong).
export async function ambilMenuSidebar(): Promise<Menu[]> {
  let res: Response
  try {
    res = await fetchDenganToken('/menu')
  } catch {
    return [] // Laravel mati / tidak bisa dihubungi
  }

  // redirect di LUAR try/catch, karena redirect() bekerja dengan melempar error
  if (res.status === 401) redirect('/login')
  if (!res.ok) return []

  const json: { data: Menu[] } = await res.json()
  return json.data
}

// ===== Halaman Kelola Menu (butuh izin menu.manage) =====

export function ambilSemuaMenu(): Promise<Menu[]> {
  return ambilDariApi('/admin/menu')
}

export function ambilMenu(id: string): Promise<Menu> {
  return ambilDariApi(`/admin/menu/${encodeURIComponent(id)}`)
}

export function ambilPermissions(): Promise<PermissionOpsi[]> {
  return ambilDariApi('/admin/permissions')
}
