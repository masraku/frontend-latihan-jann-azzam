const API_URL = process.env.LARAVEL_API_URL

// ===== Bentuk data dari Laravel (lihat ProdukResource) =====

export type Kategori = {
  id: number
  nama: string
}

export type Produk = {
  id: number
  nama: string
  harga: number
  stok: number
  is_active: boolean
  foto_url: string | null
  kategori: Kategori[]
  toko: { id: number; nama: string }
}

export type Paginasi<T> = {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

// ===== Pengambil data =====

export async function ambilProduk(params: URLSearchParams): Promise<Paginasi<Produk>> {
  const res = await fetch(`${API_URL}/produk?${params}`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Gagal mengambil data produk (status ${res.status})`)
  }

  return res.json()
}

export async function ambilKategori(): Promise<Kategori[]> {
  const res = await fetch(`${API_URL}/kategori`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Gagal mengambil data kategori (status ${res.status})`)
  }

  const json: { data: Kategori[] } = await res.json()
  return json.data
}
