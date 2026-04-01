import { prisma } from '@/src/lib/prisma'
import { Server, ShoppingCart, MessageSquare, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, totalRevenue, totalReviews, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amountINR: true }
    }),
    prisma.review.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, plan: true }
    })
  ])

  const revenue = totalRevenue._sum.amountINR || 0

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold text-white">{totalOrders}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Pending Orders</p>
              <h3 className="text-3xl font-bold text-white">{pendingOrders}</h3>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 text-yellow-400 rounded-lg flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-white">₹{revenue}</h3>
            </div>
            <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Total Reviews</p>
              <h3 className="text-3xl font-bold text-white">{totalReviews}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-purple-400 hover:text-purple-300">View all</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-zinc-400 text-sm">No recent orders.</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div>
                    <p className="text-white font-medium">{order.user.email}</p>
                    <p className="text-zinc-400 text-xs">{order.plan.name} • {format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">₹{order.amountINR}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
