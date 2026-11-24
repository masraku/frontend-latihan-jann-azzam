import 'server-only'
import { ambilToken } from './auth'

const API_URL = process.env.LARAVEL_API_URL

// fetch ke Laravel dengan token user yang sedang login (dari cookie httpOnly)
export async function fetchDenganToken(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await ambilToken()

  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(typeof init.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
}
