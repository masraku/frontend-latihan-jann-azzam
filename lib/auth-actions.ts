'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ambilToken } from './auth'
import { NAMA_COOKIE_TOKEN, UMUR_TOKEN_DETIK } from './konstanta'

const API_URL = process.env.LARAVEL_API_URL

export type StateLogin = {
  pesan: string
  email: string
}

export async function masuk(_stateSebelumnya: StateLogin, formData: FormData): Promise<StateLogin> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  let res: Response
  try {
    res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { pesan: 'Server tidak bisa dihubungi. Coba lagi nanti.', email }
  }

  if (res.status === 429) {
    return { pesan: 'Terlalu banyak percobaan login. Tunggu 1 menit.', email }
  }

  const json = await res.json()

  // 422 (email/password salah) atau 403 (akun nonaktif): tampilkan pesan dari Laravel
  if (!res.ok) {
    return { pesan: json.message ?? 'Login gagal.', email }
  }

  const cookieStore = await cookies()
  cookieStore.set(NAMA_COOKIE_TOKEN, json.token, {
    httpOnly: true, // JavaScript di browser TIDAK bisa membaca cookie ini
    secure: process.env.NODE_ENV === 'production', // hanya lewat HTTPS saat production
    sameSite: 'lax',
    path: '/',
    maxAge: UMUR_TOKEN_DETIK,
  })

  // redirect() harus di luar try/catch, karena cara kerjanya dengan "melempar" error khusus
  redirect('/akun')
}

export async function keluar() {
  const token = await ambilToken()

  if (token) {
    // minta Laravel menghapus token; kalau gagal, cookie tetap dihapus di bawah
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => null)
  }

  const cookieStore = await cookies()
  cookieStore.delete(NAMA_COOKIE_TOKEN)

  redirect('/login')
}
