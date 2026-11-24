'use client'

import Link from 'next/link'
import { useActionState, useId, useState, type ChangeEvent } from 'react'
import type { NilaiFormProduk, StateFormProduk } from '@/lib/seller-actions'
import type { Kategori } from '@/lib/api'

type Props = {
  aksi: (state: StateFormProduk, formData: FormData) => Promise<StateFormProduk>
  nilaiAwal: NilaiFormProduk
  kategoris: Kategori[]
  fotoLama: string | null
  modeEdit: boolean
}

const MAKS_FOTO = 2 * 1024 * 1024 // 2mb cuy
const gayaInput =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 aria-invalid:border-red-400'

function PesanError({ pesan }: {pesan?: string[]}) {
  if (!pesan?.length) return null
  return <p className="text-xs text-red-600">{pesan[0]}</p>
}

export default function FormProduk({ aksi, nilaiAwal, kategoris, fotoLama, modeEdit }: Props) {
  const [state, formAction, pending] = useActionState(aksi, {
    pesan: '',
    errors: {},
    nilai: nilaiAwal,
    percobaan: 0, 
  })

  const [pratinjau, setPratinjau] = useState<string | null> (null)
  const { nilai, errors } = state 

  const uid = useId()
  const id = (nama: string) => `${uid}-${nama}`

  function pilihFoto(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget
    const file = input.files?.[0]
    if (!file) {
      input.setCustomValidity('')
      setPratinjau(null)
      return
    }

    if (file.size > MAKS_FOTO) {
      input.setCustomValidity(`Ukuran file terlalu besar (maks ${MAKS_FOTO / 1024 / 1024} MB)`)
      input.reportValidity()
      setPratinjau(null)
      return
    }

    input.setCustomValidity('')
    setPratinjau(URL.createObjectURL(file))
  }

  const fotoTampil = pratinjau ?? fotoLama
  return(
// key berubah tiap submit → form dibuat ulang dengan nilai terakhir
    <form key={state.percobaan} action={formAction} onSubmit={() => setPratinjau(null)} className="space-y-4">
      {state.pesan && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.pesan}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor={id('nama_produk')} className="text-sm font-medium text-gray-700">Nama Produk</label>
        <input
          id={id('nama_produk')}
          name="nama_produk"
          required
          maxLength={255}
          defaultValue={nilai.nama_produk}
          aria-invalid={!!errors.nama_produk}
          className={gayaInput}
        />
        <PesanError pesan={errors.nama_produk} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor={id('harga')} className="text-sm font-medium text-gray-700">Harga (Rp)</label>
          <input
            id={id('harga')}
            name="harga"
            type="number"
            min={0}
            required
            defaultValue={nilai.harga}
            aria-invalid={!!errors.harga}
            className={gayaInput}
          />
          <PesanError pesan={errors.harga} />
        </div>

        <div className="space-y-1">
          <label htmlFor={id('stok')} className="text-sm font-medium text-gray-700">Stok</label>
          <input
            id={id('stok')}
            name="stok"
            type="number"
            min={0}
            required
            defaultValue={nilai.stok}
            aria-invalid={!!errors.stok}
            className={gayaInput}
          />
          <PesanError pesan={errors.stok} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700">Kategori</legend>
        <div className="flex flex-wrap gap-2">
          {kategoris.map((k) => (
            <label
              key={k.id}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm transition hover:border-brand has-checked:border-brand has-checked:bg-brand-light has-checked:text-brand-dark"
            >
              <input
                type="checkbox"
                name="kategori_ids"
                value={k.id}
                defaultChecked={nilai.kategori_ids.includes(String(k.id))}
                className="accent-brand"
              />
              {k.nama}
            </label>
          ))}
        </div>
        <PesanError pesan={errors.kategori_ids} />
      </fieldset>

      <div className="space-y-2">
        <label htmlFor={id('photo')} className="text-sm font-medium text-gray-700">
          Foto Produk{' '}
          <span className="font-normal text-gray-400">
            ({modeEdit ? 'kosongkan kalau tidak diganti, ' : ''}maks 2 MB)
          </span>
        </label>

        <div className="flex items-center gap-4">
          {fotoTampil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoTampil} alt="Foto produk" className="h-24 w-24 shrink-0 rounded-lg border border-gray-200 object-cover" />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
              Belum ada foto
            </div>
          )}

          <input
            id={id('photo')}
            name="photo"
            type="file"
            accept="image/*"
            onChange={pilihFoto}
            aria-invalid={!!errors.photo}
            className="min-w-0 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
          />
        </div>
        <PesanError pesan={errors.photo} />

        {state.percobaan > 0 && (
          <p className="text-xs text-amber-600">Kalau tadi sudah memilih foto, pilih ulang fotonya sebelum menyimpan.</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? 'Menyimpan...' : modeEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
        </button>
        <Link href="/seller" className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Batal
        </Link>
      </div>
    </form>
  )
}
