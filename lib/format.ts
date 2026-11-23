// 8000 → "Rp 8.000"
export function formatRupiah(angka: number): string {
  return angka.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
