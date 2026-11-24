import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilPermissions, ambilSemuaMenu } from '@/lib/menu'
import { simpanMenu } from '@/lib/menu-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import FormMenu from '@/components/admin/form-menu'

export const metadata = {
  title: 'Tambah Menu',
}

export default function TambahMenuPage() {
  return (
    <main className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Tambah Menu</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <IsiForm />
      </Suspense>
    </main>
  )
}

async function IsiForm() {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')
  if (!punyaIzin(admin, 'menu.manage')) return <AksesDitolak />

  const [permissions, menus] = await Promise.all([ambilPermissions(), ambilSemuaMenu()])

  // usul urutan: satu setelah menu terakhir
  const urutanBerikutnya = Math.max(0, ...menus.map((m) => m.urutan)) + 1

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <FormMenu
        aksi={simpanMenu.bind(null, null)} // null = menu baru
        nilaiAwal={{ nama_menu: '', url: '', id_permission: '', urutan: String(urutanBerikutnya), is_active: true }}
        permissions={permissions}
        modeEdit={false}
      />
    </div>
  )
}
