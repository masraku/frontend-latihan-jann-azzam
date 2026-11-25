import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { ambilUserSaatIni, punyaIzin } from '@/lib/auth'
import AksesDitolak from '@/components/admin/akses-ditolak'
import Katalog from '@/components/katalog'
import KatalogSkeleton from '@/components/katalog-skeleton'

export const metadata = {
    title: 'Belanja',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function BuyerPage({ searchParams }: { searchParams: SearchParams }) {
    return (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <Suspense fallback={<KatalogSkeleton />}>
                <DashboardBuyer searchParams={searchParams} />
            </Suspense>
        </main>
    )
}

async function DashboardBuyer({ searchParams }: { searchParams: SearchParams }) {
    const user = await ambilUserSaatIni()
    if (!user) {
        redirect('/login')
    }
    if (!punyaIzin(user, 'produk.view')) {
        return <AksesDitolak pesan="halaman ini khusus pembeli" />
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Halo, {user.nama}</h1>
                <p className="mt-1 text-gray-600">Mau belanja apa hari ini?</p>
            </div>

            <Katalog searchParams={searchParams} alamat="/buyer" />
        </>
    )
}
