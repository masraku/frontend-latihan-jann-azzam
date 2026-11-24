import { Suspense } from 'react'
import Sidebar from '@/components/admin/sidebar'

// Layout ini membungkus SEMUA halaman /admin/*.
// Ingat: layout hanya tampilan, BUKAN penjaga keamanan.
// Setiap halaman tetap mengecek izinnya sendiri (punyaIzin).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // HP: sidebar di atas (baris menu), desktop (lg): sidebar kiri + konten kanan
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8 lg:py-8">
      <aside className="mb-6 lg:mb-0">
        <div className="lg:sticky lg:top-24">
          {/* Wajib Suspense: Sidebar membaca cookie + fetch ke Laravel, dan SidebarLink memakai usePathname */}
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>
        </div>
      </aside>

      {/* min-w-0: tabel lebar boleh digeser di dalamnya, tanpa melebarkan halaman */}
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function SidebarSkeleton() {
  return (
    <div className="flex animate-pulse gap-2 overflow-hidden lg:flex-col">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-9 w-28 shrink-0 rounded-lg bg-gray-100 lg:w-full" />
      ))}
    </div>
  )
}
