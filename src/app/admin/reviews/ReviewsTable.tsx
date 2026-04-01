'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Trash2, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export function ReviewsTable({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await axios.delete(`/api/admin/reviews/${id}`)
      toast.success('Review deleted')
      setReviews(reviews.filter(r => r.id !== id))
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{review.username}</div>
                  <div className="text-xs text-zinc-500">{review.user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"} 
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate" title={review.message}>
                  {review.message}
                </td>
                <td className="px-6 py-4 text-xs">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(review.id)} className="text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
