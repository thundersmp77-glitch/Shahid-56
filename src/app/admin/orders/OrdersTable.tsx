'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Check, X, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.put(`/api/admin/orders/${id}`, { status })
      toast.success(`Order marked as ${status}`)
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
      router.refresh()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  return (
    <div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Txn ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{order.id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.user.name || order.user.email}</div>
                    <div className="text-xs text-zinc-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.plan.name}</div>
                    <div className="text-xs text-zinc-500">{order.plan.type}</div>
                  </td>
                  <td className="px-6 py-4">₹{order.amountINR}</td>
                  <td className="px-6 py-4 font-mono text-xs">{order.transactionId}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' : 
                      order.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {order.screenshotUrl && (
                        <button onClick={() => setSelectedImage(order.screenshotUrl)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-blue-400 rounded-md transition-colors" title="View Screenshot">
                          <Eye size={16} />
                        </button>
                      )}
                      {order.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleStatusChange(order.id, 'APPROVED')} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-green-400 rounded-md transition-colors" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleStatusChange(order.id, 'REJECTED')} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-red-400 rounded-md transition-colors" title="Reject">
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/80 z-10">
              <X size={24} />
            </button>
            <div className="relative w-full h-full">
              <Image src={selectedImage} alt="Payment Screenshot" fill className="object-contain" unoptimized />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
