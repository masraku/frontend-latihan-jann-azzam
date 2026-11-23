import 'server-only'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { NAMA_COOKIE_TOKEN } from '@/lib/konstanta'

const API_URL = process.env.LARAVEL_API_URL

export type User = {
  id:number
  nama:string
  email:string
  role:string | null
  nama_toko:string | null
  permissions:string[]
}

export async function ambilToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(NAMA_COOKIE_TOKEN)?.value
}

export const ambilUserSaatIni = cache(async (): Promise<User | null> => {
  const token = await ambilToken()
  if (!token) {
    return null
  }

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) { return null }

  const json: { user: User } = await res.json()
  return json.user
  })

export function punyaIzin(user: User, permission: string): boolean {
    return user.permissions.includes(permission)
  }

