import Link from 'next/link'
import { getUser } from '@/src/lib/auth'
import { LogoutButton } from '@/src/components/LogoutButton'
import { prisma } from '@/src/lib/prisma'
import { CurrencySwitcher } from '@/src/components/CurrencySwitcher'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  const settings = await prisma.settings.findUnique({ where: { id: 'global' } })

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                SyntaxHost
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-zinc-300 hover:text-white transition-colors">Home</Link>
              <Link href="/plans" className="text-zinc-300 hover:text-white transition-colors">Plans</Link>
              <Link href="/domains" className="text-zinc-300 hover:text-white transition-colors">Domains</Link>
              <Link href="/reviews" className="text-zinc-300 hover:text-white transition-colors">Reviews</Link>
              {settings?.panelUrl && (
                <a href={settings.panelUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white transition-colors">
                  Client Panel
                </a>
              )}
            </nav>
            <div className="flex items-center space-x-4">
              <CurrencySwitcher />
              {user ? (
                <>
                  <span className="text-sm text-zinc-400 hidden sm:block">Hi, {user.name || user.email}</span>
                  {user.isAdmin && (
                    <Link href="/admin" className="text-sm px-3 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 rounded-md transition-colors">
                      Admin
                    </Link>
                  )}
                  <LogoutButton className="text-sm px-3 py-1.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-md transition-colors">
                    Logout
                  </LogoutButton>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">Login</Link>
                  <Link href="/signup" className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4">SyntaxHost</h2>
              <p className="text-zinc-400 max-w-sm">
                Premium SaaS hosting platform providing high-performance VPS, VDS, and Minecraft servers.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link href="/plans" className="text-zinc-400 hover:text-white transition-colors">Plans</Link></li>
                <li><Link href="/domains" className="text-zinc-400 hover:text-white transition-colors">Domains</Link></li>
                <li><Link href="/reviews" className="text-zinc-400 hover:text-white transition-colors">Reviews</Link></li>
                {settings?.panelUrl && (
                  <li><a href={settings.panelUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Client Panel</a></li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h3>
              <ul className="space-y-2">
                {settings?.discordUrl && (
                  <li><a href={settings.discordUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Discord</a></li>
                )}
                {settings?.youtubeUrl && (
                  <li><a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">YouTube</a></li>
                )}
                {settings?.instagramUrl && (
                  <li><a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Instagram</a></li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} SyntaxHost. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
