export default function BadgeStatus({ aktif }: { aktif: boolean }) {
  return aktif ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Aktif
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Nonaktif
    </span>
  )
}
