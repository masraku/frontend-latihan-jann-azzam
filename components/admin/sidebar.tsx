import { ambilMenuSidebar } from '@/lib/menu'
import SidebarLink from './sidebar-link'

// Komponen SERVER: mengambil menu dari Laravel (GET /api/menu).
// Laravel sudah menyaring: hanya menu aktif + yang boleh dilihat role user ini.
export default async function Sidebar() {
  const menus = await ambilMenuSidebar()

  if (!menus.length) {
    return <p className="px-3 text-sm italic text-gray-400">Menu tidak tersedia.</p>
  }

  return (
    <nav aria-label="Menu admin">
      <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 lg:block">
        Menu Admin
      </p>
      {/* HP: satu baris yang bisa digeser ke samping. -mx/px: baris menu menempel ke tepi layar */}
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {menus.map((menu) => (
          <li key={menu.id} className="shrink-0">
            <SidebarLink href={menu.url}>{menu.nama}</SidebarLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
