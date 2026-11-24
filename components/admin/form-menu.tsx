'use client'

import Link from 'next/link'
import { useActionState, useId } from 'react'
import type { NilaiFormMenu, StateFormMenu } from '@/lib/menu-actions'
import type { PermissionOpsi } from '@/lib/menu'

type Props = {
  aksi: (state: StateFormMenu, formData: FormData) => Promise<StateFormMenu>
  nilaiAwal: NilaiFormMenu
  permissions: PermissionOpsi[]
  modeEdit: boolean
}

// Sama dengan regex Laravel ^\/$|^(\/[a-z0-9-]+)+$
// Atribut pattern otomatis diberi ^...$ oleh browser dan memakai flag "v",
// yang mewajibkan tanda - di dalam [...] ditulis \- (kalau tidak, pattern diabaikan).
const POLA_URL = '/|(/[a-z0-9\\-]+)+'

const gayaInput =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 aria-invalid:border-red-400'

function PesanError({ pesan }: { pesan?: string[] }) {
  if (!pesan?.length) return null
  return <p className="text-xs text-red-600">{pesan[0]}</p>
}

export default function FormMenu({ aksi, nilaiAwal, permissions, modeEdit }: Props) {
  const [state, formAction, pending] = useActionState(aksi, {
    pesan: '',
    errors: {},
    nilai: nilaiAwal,
    percobaan: 0,
  })

  const { nilai, errors } = state

  // id unik per form (Next.js menyimpan halaman sebelumnya secara tersembunyi)
  const uid = useId()
  const id = (nama: string) => `${uid}-${nama}`

  return (
    // key berubah tiap submit → form dibuat ulang, jadi defaultValue/defaultChecked terisi nilai terakhir
    <form key={state.percobaan} action={formAction} className="space-y-4">
      {state.pesan && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.pesan}
        </p>
      )}

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Menambah menu tidak membuat halamannya. Pastikan halaman untuk URL ini sudah ada di folder <code>app/</code>.
      </p>

      <div className="space-y-1">
        <label htmlFor={id('nama_menu')} className="text-sm font-medium text-gray-700">Nama Menu</label>
        <input
          id={id('nama_menu')}
          name="nama_menu"
          required
          defaultValue={nilai.nama_menu}
          aria-invalid={!!errors.nama_menu}
          className={gayaInput}
        />
        <PesanError pesan={errors.nama_menu} />
      </div>

      <div className="space-y-1">
        <label htmlFor={id('url')} className="text-sm font-medium text-gray-700">URL</label>
        <input
          id={id('url')}
          name="url"
          required
          placeholder="/admin/..."
          pattern={POLA_URL}
          title="Diawali /, hanya huruf kecil, angka, dan tanda -. Contoh: /admin/laporan"
          defaultValue={nilai.url}
          aria-invalid={!!errors.url}
          className={`${gayaInput} font-mono`}
        />
        <PesanError pesan={errors.url} />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div className="space-y-1">
          <label htmlFor={id('id_permission')} className="text-sm font-medium text-gray-700">Hanya untuk izin</label>
          <select
            id={id('id_permission')}
            name="id_permission"
            defaultValue={nilai.id_permission}
            aria-invalid={!!errors.id_permission}
            className={gayaInput}
          >
            <option value="">— semua user login —</option>
            {permissions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
                {p.keterangan ? ` (${p.keterangan})` : ''}
              </option>
            ))}
          </select>
          <PesanError pesan={errors.id_permission} />
        </div>

        <div className="space-y-1">
          <label htmlFor={id('urutan')} className="text-sm font-medium text-gray-700">Urutan</label>
          <input
            id={id('urutan')}
            name="urutan"
            type="number"
            min={0}
            required
            defaultValue={nilai.urutan}
            aria-invalid={!!errors.urutan}
            className={gayaInput}
          />
          <PesanError pesan={errors.urutan} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={nilai.is_active}
            className="h-4 w-4 rounded border-gray-300 accent-brand"
          />
          Aktif (tampil di sidebar)
        </label>
        <PesanError pesan={errors.is_active} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah Menu'}
        </button>
        <Link href="/admin/menu" className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Batal
        </Link>
      </div>
    </form>
  )
}
