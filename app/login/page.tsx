import FormLogin from '@/components/form-login'

export const metadata = {
  title: 'Masuk',
}

export default function LoginPage() {
  return (
    <main className="flex justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold">Masuk</h1>
        <p className="mb-6 text-sm text-gray-600">Masuk untuk berjualan atau mengelola toko.</p>
        <FormLogin />
      </div>
    </main>
  )
}
