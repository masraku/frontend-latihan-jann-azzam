import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilSemuaMenu } from '@/lib/menu'
import { hapusMenu } from '@/lib/menu-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import BadgeStatus from '@/components/admin/badge-status'
import PesanFlash from '@/components/admin/pesan-flash'
import TombolSubmit from '@/components/admin/tombol-submit'

export const metadata = {
  title: 'Kelola Menu',
}

type SearchParams = Promise<{ pesan?: string; error?: string }>

const gayaTombol = 'rounded-md px-2.5 py-1 text-xs font-medium transition'

export default function KelolaMenuPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main>
      {/* Wajib Suspense: isinya membaca cookie, searchParams, dan data dari Laravel */}
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <DaftarMenu searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

async function DaftarMenu({ searchParams }: { searchParams: SearchParams }) {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')
  if (!punyaIzin(admin, 'menu.manage')) return <AksesDitolak />

  const [{ pesan, error }, menus] = await Promise.all([searchParams, ambilSemuaMenu()])

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Menu</h1>
          <p className="mt-1 text-sm text-gray-600">Menu yang aktif tampil di sidebar sesuai izin role masing-masing.</p>
        </div>
        <Link
          href="/admin/menu/baru"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          + Tambah Menu
        </Link>
      </div>

      <PesanFlash pesan={pesan} error={error} />

      {/* overflow-x-auto: di HP tabel digeser di dalam kotaknya, halaman tidak ikut melebar */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3">Urutan</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Izin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menus.map((menu) => (
              <tr key={menu.id} className={menu.is_active ? '' : 'bg-gray-50 text-gray-400'}>
                <td className="px-4 py-3 tabular-nums">{menu.urutan}</td>
                <td className="px-4 py-3 font-medium">{menu.nama}</td>
                <td className="px-4 py-3">
                  <Link href={menu.url} className="font-mono text-xs text-brand hover:underline">
                    {menu.url}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {menu.permission ? (
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{menu.permission}</code>
                  ) : (
                    <span className="text-xs italic text-gray-400">semua user</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <BadgeStatus aktif={menu.is_active} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/menu/${menu.id}/edit`}
                      className={`${gayaTombol} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                    >
                      Edit
                    </Link>
                    {/* menu /admin/menu tetap ada tombolnya: Laravel yang menolak (422) dan pesannya tampil merah */}
                    <form action={hapusMenu.bind(null, menu.id)}>
                      <TombolSubmit
                        konfirmasi={`Yakin hapus menu ${menu.nama}?`}
                        className={`${gayaTombol} bg-red-50 text-red-700 hover:bg-red-100`}
                      >
                        Hapus
                      </TombolSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
