import Link from 'next/link'
import type { User } from '@/lib/auth'
import { punyaIzin } from '@/lib/auth'
import type { AdminUser } from '@/lib/admin'
import { hapusUser, toggleStatusUser } from '@/lib/admin-actions'
import BadgeStatus from './badge-status'
import TombolSubmit from './tombol-submit'

const gayaTombol = 'rounded-md px-2.5 py-1 text-xs font-medium transition'

export default function TabelUser({ users, admin }: { users: AdminUser[]; admin: User }) {
  const bolehEdit = punyaIzin(admin, 'user.update')
  const bolehToggle = punyaIzin(admin, 'user.toggle_status')
  const bolehHapus = punyaIzin(admin, 'user.delete')

  return (
    // overflow-x-auto: di HP tabel bisa digeser ke samping, bukan merusak halaman
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Toko</th>
            <th className="px-4 py-3">Produk</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, index) => {
            const akunSendiri = user.id === admin.id

            return (
              <tr key={user.id} className={user.is_active ? '' : 'bg-gray-50 text-gray-400'}>
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">
                    {user.nama}
                    {akunSendiri && <span className="ml-1 text-xs font-normal text-gray-400">(anda)</span>}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </td>
                <td className="px-4 py-3 capitalize">{user.role ?? '-'}</td>
                <td className="px-4 py-3">{user.nama_toko ?? '-'}</td>
                <td className="px-4 py-3">
                  {user.role === 'seller' ? `${user.produk_aktif_count} / ${user.produks_count} aktif` : '-'}
                </td>
                <td className="px-4 py-3">
                  <BadgeStatus aktif={user.is_active} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {bolehEdit && (
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className={`${gayaTombol} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                      >
                        Edit
                      </Link>
                    )}

                    {/* akun sendiri tidak boleh dinonaktifkan / dihapus (Laravel juga menolak) */}
                    {!akunSendiri && bolehToggle && (
                      <form action={toggleStatusUser.bind(null, user.id)}>
                        <TombolSubmit
                          className={`${gayaTombol} ${
                            user.is_active
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </TombolSubmit>
                      </form>
                    )}

                    {!akunSendiri && bolehHapus && (
                      <form action={hapusUser.bind(null, user.id)}>
                        <TombolSubmit
                          konfirmasi={`Yakin hapus user ${user.nama}?`}
                          className={`${gayaTombol} bg-red-50 text-red-700 hover:bg-red-100`}
                        >
                          Hapus
                        </TombolSubmit>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
