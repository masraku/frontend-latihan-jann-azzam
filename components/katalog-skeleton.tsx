// Tampilan sementara (fallback Suspense) selagi data dari Laravel dimuat
export default function KatalogSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-[74px] rounded-xl border border-gray-200 bg-white" />
      <div className="mb-4 h-4 w-40 rounded bg-gray-200" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="aspect-square bg-gray-200" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
