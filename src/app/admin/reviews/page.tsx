import { prisma } from '@/src/lib/prisma'
import { ReviewsTable } from './ReviewsTable'

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Reviews</h1>
      </div>
      
      <ReviewsTable initialReviews={reviews} />
    </div>
  )
}
