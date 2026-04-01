import { redirect } from 'next/navigation'
import { getUser } from '@/src/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Server, ShoppingCart, MessageSquare, Settings, User, LogOut } from 'lucide-react'
import { LogoutButton } from '@/src/components/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (!user || !user.isAdmin) {
    redirect('/admin-login')
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-500">SyntaxHost</h1>
          <p className="text-xs text-zinc-400 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/plans" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <Server size={18} /> Plans
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <ShoppingCart size={18} /> Orders
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <MessageSquare size={18} /> Reviews
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <Settings size={18} /> Settings
          </Link>
          <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
            <User size={18} /> Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <LogoutButton className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors">
            <LogOut size={18} /> Logout
          </LogoutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
