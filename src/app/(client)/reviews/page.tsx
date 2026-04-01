import { prisma } from '@/src/lib/prisma'
import { getUser } from '@/src/lib/auth'
import { ReviewForm } from '@/src/components/ReviewForm'
import { Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function ReviewsPage() {
  const user = await getUser()
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } }
  })

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Customer Reviews
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            See what our customers have to say about our hosting services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400">No reviews yet. Be the first to leave one!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{review.username}</h3>
                      <p className="text-xs text-zinc-500">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-300">{review.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Leave a Review Form */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Leave a Review</h3>
              {user ? (
                <ReviewForm />
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-400 mb-4">You must be logged in to leave a review.</p>
                  <a href="/login?redirect=/reviews" className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                    Login to Review
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
