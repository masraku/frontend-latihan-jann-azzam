import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilMenu, ambilPermissions } from '@/lib/menu'
import { simpanMenu } from '@/lib/menu-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import FormMenu from '@/components/admin/form-menu'

export const metadata = {
  title: 'Edit Menu',
}

// params juga Promise di Next.js 16
type Params = Promise<{ id: string }>

export default function EditMenuPage({ params }: { params: Params }) {
  return (
    <main className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit Menu</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <IsiForm params={params} />
      </Suspense>
    </main>
  )
}

async function IsiForm({ params }: { params: Params }) {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')
  if (!punyaIzin(admin, 'menu.manage')) return <AksesDitolak />

  const { id } = await params
  const [menu, permissions] = await Promise.all([ambilMenu(id), ambilPermissions()]) // 404 → notFound()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-6 text-sm text-gray-500">
        Mengubah menu <span className="font-semibold text-gray-900">{menu.nama}</span>
      </p>
      <FormMenu
        aksi={simpanMenu.bind(null, menu.id)}
        nilaiAwal={{
          nama_menu: menu.nama, // Laravel mengirim "nama", tapi menerima "nama_menu"
          url: menu.url,
          id_permission: String(menu.id_permission ?? ''),
          urutan: String(menu.urutan),
          is_active: menu.is_active,
        }}
        permissions={permissions}
        modeEdit
      />
    </div>
  )
}
