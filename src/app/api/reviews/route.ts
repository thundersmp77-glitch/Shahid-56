import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getUser } from '@/src/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { rating, message } = await req.json()

    if (!rating || !message) {
      return NextResponse.json({ error: 'Rating and message are required' }, { status: 400 })
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    const username = dbUser?.name || dbUser?.email?.split('@')[0] || 'Anonymous'

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        username,
        rating: Number(rating),
        message,
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
