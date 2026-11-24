import 'server-only'
import { notFound, redirect } from 'next/navigation'
import { fetchDenganToken } from '@/lib/api-token'
import type { Produk } from './api'

export async function ambilProdukSaya(): Promise<Produk[]> {
  const res = await fetchDenganToken('/seller/produk')

  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk saya (status ${res.status})`)
  }

  const json: { data: Produk[] } = await res.json()
  return json.data
}

export async function ambilSatuProdukSaya(id: string): Promise<Produk> {
  const res = await fetchDenganToken(`/seller/produk/${encodeURIComponent(id)}`)


  if (res.status === 401) redirect('/login')
  if (res.status === 403 || res.status === 404) notFound()
  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk saya (status ${res.status})`)
  }
  
  const json: { data: Produk } = await res.json()
  return json.data
}
