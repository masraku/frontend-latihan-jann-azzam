'use client'

import { useFormStatus } from 'react-dom'

type Props = {
  children: React.ReactNode
  className?: string
  konfirmasi?: string // kalau diisi, muncul dialog "Yakin?" sebelum form dikirim
}

// Tombol submit yang otomatis nonaktif selama Server Action berjalan
export default function TombolSubmit({ children, className, konfirmasi }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (konfirmasi && !confirm(konfirmasi)) e.preventDefault()
      }}
      className={`${className ?? ''} disabled:cursor-wait disabled:opacity-50`}
    >
      {pending ? '...' : children}
    </button>
  )
}
