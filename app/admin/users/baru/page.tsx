import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilRoles } from '@/lib/admin'
import { simpanUser } from '@/lib/admin-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import FormUser from '@/components/admin/form-user'

export const metadata = {
  title: 'Tambah User',
}

export default function TambahUserPage() {
  return (
    <main className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Tambah User</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <IsiForm />
      </Suspense>
    </main>
  )
}

async function IsiForm() {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')
  if (!punyaIzin(admin, 'user.create')) return <AksesDitolak />

  const roles = await ambilRoles()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <FormUser
        aksi={simpanUser.bind(null, null)} // null = user baru
        nilaiAwal={{ name: '', email: '', id_role: '', nama_toko: '' }}
        roles={roles}
        modeEdit={false}
      />
    </div>
  )
}
