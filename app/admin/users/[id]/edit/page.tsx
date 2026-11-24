import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import { ambilRoles, ambilUser } from '@/lib/admin'
import { simpanUser } from '@/lib/admin-actions'
import AksesDitolak from '@/components/admin/akses-ditolak'
import FormUser from '@/components/admin/form-user'

export const metadata = {
  title: 'Edit User',
}

// params juga Promise di Next.js 16, sama seperti searchParams
type Params = Promise<{ id: string }>

export default function EditUserPage({ params }: { params: Params }) {
  return (
    <main className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Edit User</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-gray-100" />}>
        <IsiForm params={params} />
      </Suspense>
    </main>
  )
}

async function IsiForm({ params }: { params: Params }) {
  const admin = await ambilUserSaatIni()
  if (!admin) redirect('/login')
  if (!punyaIzin(admin, 'user.update')) return <AksesDitolak />

  const { id } = await params
  const [user, roles] = await Promise.all([ambilUser(id), ambilRoles()]) // 404 → notFound()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="mb-6 text-sm text-gray-500">
        Mengubah data <span className="font-semibold text-gray-900">{user.nama}</span>
      </p>
      <FormUser
        aksi={simpanUser.bind(null, user.id)}
        nilaiAwal={{
          name: user.nama,
          email: user.email,
          id_role: String(user.id_role ?? ''),
          nama_toko: user.nama_toko ?? '',
        }}
        roles={roles}
        modeEdit
      />
    </div>
  )
}
