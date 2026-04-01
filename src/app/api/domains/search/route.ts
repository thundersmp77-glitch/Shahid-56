import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    
    // In a real application, you would make API calls to ResellerClub and Name.com here
    // using settings.resellerClubKey and settings.nameComKey
    
    // For demonstration, we'll return mock data based on the query
    const results = [
      { domain: `${query}.com`, available: Math.random() > 0.3, priceINR: 899, provider: 'Name.com' },
      { domain: `${query}.net`, available: Math.random() > 0.3, priceINR: 799, provider: 'ResellerClub' },
      { domain: `${query}.org`, available: Math.random() > 0.5, priceINR: 999, provider: 'Name.com' },
      { domain: `${query}.io`, available: Math.random() > 0.2, priceINR: 2999, provider: 'ResellerClub' },
      { domain: `${query}.co`, available: Math.random() > 0.4, priceINR: 1499, provider: 'Name.com' },
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Domain search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
