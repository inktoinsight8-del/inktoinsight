import { signIn } from "@/auth"
import { redirect } from "next/navigation"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0F1117] px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#1A1D27] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-[#2A2D3A]">
        <div className="text-center">
          <h1 className="font-serif italic text-4xl font-bold tracking-tight text-[#3B3FA0] dark:text-[#4F6DF5] mb-2">
            Ink&Insight
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your publications.
          </p>
        </div>
        <form className="mt-8 space-y-6" action={async (formData) => {
          "use server"
          try {
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/admin",
            })
          } catch (error: any) {
            if (error.type === 'CredentialsSignin' || error.message.includes('CredentialsSignin')) {
              redirect('/admin/login?error=CredentialsSignin')
            }
            throw error // Rethrow to let NextAuth handle it properly (NEXT_REDIRECT)
          }
        }}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              Invalid email or password.
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-[#2A2D3A] dark:bg-[#0F1117] placeholder-gray-500 dark:text-white focus:outline-none focus:ring-[#4F6DF5] focus:border-[#4F6DF5] sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-[#2A2D3A] dark:bg-[#0F1117] placeholder-gray-500 dark:text-white focus:outline-none focus:ring-[#4F6DF5] focus:border-[#4F6DF5] sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4F6DF5] hover:bg-[#3B3FA0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F6DF5] transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
