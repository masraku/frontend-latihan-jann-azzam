'use client'

import Link from 'next/link'
import { useActionState, useId, useState } from 'react'
import type { NilaiFormUser, StateFormUser } from '@/lib/admin-actions'
import type { Role } from '@/lib/admin'

type Props = {
  aksi: (state: StateFormUser, formData: FormData) => Promise<StateFormUser>
  nilaiAwal: NilaiFormUser
  roles: Role[]
  modeEdit: boolean
}

const gayaInput =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 aria-invalid:border-red-400'

function PesanError({ pesan }: { pesan?: string[] }) {
  if (!pesan?.length) return null
  return <p className="text-xs text-red-600">{pesan[0]}</p>
}

type PropsRoleDanToko = {
  nilai: NilaiFormUser
  errors: StateFormUser['errors']
  roles: Role[]
  id: (nama: string) => string
}

// Nama Toko hanya bisa diisi kalau role yang dipilih = seller.
// Dibuat komponen terpisah dan diletakkan DI DALAM <form key=...>, supaya
// useState-nya ikut diulang dari nilai terbaru setiap kali form dikirim.
function RoleDanToko({ nilai, errors, roles, id }: PropsRoleDanToko) {
  const [idRole, setIdRole] = useState(nilai.id_role)
  const [namaToko, setNamaToko] = useState(nilai.nama_toko)

  const idRoleSeller = roles.find((role) => role.nama === 'seller')?.id
  const seller = idRole !== '' && idRole === String(idRoleSeller)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1">
        <label htmlFor={id('id_role')} className="text-sm font-medium text-gray-700">Role</label>
        <select
          id={id('id_role')}
          name="id_role"
          required
          value={idRole}
          onChange={(e) => setIdRole(e.target.value)}
          aria-invalid={!!errors.id_role}
          className={gayaInput}
        >
          <option value="">-- pilih role --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id} className="capitalize">
              {role.nama}
            </option>
          ))}
        </select>
        <PesanError pesan={errors.id_role} />
      </div>

      <div className="space-y-1">
        <label htmlFor={id('nama_toko')} className="text-sm font-medium text-gray-700">
          Nama Toko <span className="font-normal text-gray-400">(khusus seller)</span>
        </label>
        {/* disabled → tidak ikut terkirim di FormData → simpanUser mengirim nama_toko: null.
            Teks yang sudah diketik disimpan di state, jadi muncul lagi kalau role dikembalikan ke seller. */}
        <input
          id={id('nama_toko')}
          name="nama_toko"
          disabled={!seller}
          value={seller ? namaToko : ''}
          onChange={(e) => setNamaToko(e.target.value)}
          placeholder={seller ? '' : 'Pilih role seller dulu'}
          aria-invalid={!!errors.nama_toko}
          className={`${gayaInput} disabled:cursor-not-allowed disabled:bg-gray-100`}
        />
        <PesanError pesan={errors.nama_toko} />
      </div>
    </div>
  )
}

export default function FormUser({ aksi, nilaiAwal, roles, modeEdit }: Props) {
  const [state, formAction, pending] = useActionState(aksi, {
    pesan: '',
    errors: {},
    nilai: nilaiAwal,
    percobaan: 0,
  })

  const { nilai, errors } = state

  // id unik per form: Next.js menyimpan halaman sebelumnya secara tersembunyi,
  // jadi id tetap seperti "email" bisa muncul dua kali di dokumen
  const uid = useId()
  const id = (nama: string) => `${uid}-${nama}`

  return (
    // key berubah tiap submit → form dibuat ulang, jadi defaultValue (termasuk <select>) terisi nilai terakhir
    <form key={state.percobaan} action={formAction} className="space-y-4">
      {state.pesan && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.pesan}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor={id('name')} className="text-sm font-medium text-gray-700">Nama</label>
        <input id={id('name')} name="name" required defaultValue={nilai.name} aria-invalid={!!errors.name} className={gayaInput} />
        <PesanError pesan={errors.name} />
      </div>

      <div className="space-y-1">
        <label htmlFor={id('email')} className="text-sm font-medium text-gray-700">Email</label>
        <input id={id('email')} name="email" type="email" required defaultValue={nilai.email} aria-invalid={!!errors.email} className={gayaInput} />
        <PesanError pesan={errors.email} />
      </div>

      <RoleDanToko nilai={nilai} errors={errors} roles={roles} id={id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor={id('password')} className="text-sm font-medium text-gray-700">
            Password {modeEdit && <span className="font-normal text-gray-400">(kosongkan kalau tidak diganti)</span>}
          </label>
          <input
            id={id('password')}
            name="password"
            type="password"
            required={!modeEdit}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            className={gayaInput}
          />
          <PesanError pesan={errors.password} />
        </div>

        <div className="space-y-1">
          <label htmlFor={id('password_confirmation')} className="text-sm font-medium text-gray-700">Ulangi Password</label>
          <input
            id={id('password_confirmation')}
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            className={gayaInput}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah User'}
        </button>
        <Link href="/admin/users" className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Batal
        </Link>
      </div>
    </form>
  )
}
