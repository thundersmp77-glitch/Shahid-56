import { prisma } from '@/src/lib/prisma'
import { OrdersTable } from './OrdersTable'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      plan: { select: { name: true, type: true } }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
      </div>
      
      <OrdersTable initialOrders={orders} />
    </div>
  )
}
