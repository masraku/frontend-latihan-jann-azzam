'use client'

import { useActionState } from 'react'
import { masuk, type StateLogin } from '@/lib/auth-actions'

const stateAwal: StateLogin = { pesan: '', email: '' }

const gayaInput =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

export default function FormLogin() {
  const [state, formAction, pending] = useActionState(masuk, stateAwal)

  return (
    <form action={formAction} className="space-y-4">
      {state.pesan && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.pesan}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          className={gayaInput}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={gayaInput}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  )
}
