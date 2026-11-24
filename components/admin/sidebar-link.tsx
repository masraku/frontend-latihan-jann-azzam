'use client' // usePathname hanya bisa dipakai di Client Component

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// /admin hanya aktif kalau sama persis (kalau tidak, /admin ikut menyala di semua halaman admin).
// Menu lain aktif juga di sub-halamannya: /admin/users menyala di /admin/users/5/edit,
// tapi TIDAK di /admin/users-lama (karena dicek dengan url + '/').
function cocok(pathname: string, url: string): boolean {
  if (url === '/admin') return pathname === '/admin'
  return pathname === url || pathname.startsWith(url + '/')
}

export default function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const aktif = cocok(pathname, href)

  return (
    <Link
      href={href}
      aria-current={aktif ? 'page' : undefined}
      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
        aktif ? 'bg-brand-light font-semibold text-brand-dark' : 'font-medium text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  )
}
