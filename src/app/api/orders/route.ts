import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getUser } from '@/src/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const planId = formData.get('planId') as string
    const transactionId = formData.get('transactionId') as string
    const email = formData.get('email') as string
    const screenshot = formData.get('screenshot') as File

    if (!planId || !transactionId || !email || !screenshot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Validate screenshot
    if (screenshot.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Screenshot must be less than 5MB' }, { status: 400 })
    }
    if (!['image/jpeg', 'image/png'].includes(screenshot.type)) {
      return NextResponse.json({ error: 'Screenshot must be JPG or PNG' }, { status: 400 })
    }

    // Save screenshot
    const bytes = await screenshot.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(screenshot.name) || '.jpg'
    const filename = `${uuidv4()}${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'orders')
    const filepath = path.join(uploadDir, filename)
    
    await writeFile(filepath, buffer)

    const screenshotUrl = `/uploads/orders/${filename}`

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        planId,
        amountINR: plan.priceINR,
        transactionId,
        screenshotUrl,
        email,
        status: 'PENDING'
      }
    })

    // Trigger Discord Webhook
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } })
    if (settings?.discordWebhook) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const fullImageUrl = `${siteUrl}${screenshotUrl}`
        
        await axios.post(settings.discordWebhook, {
          embeds: [
            {
              title: '🎉 New Order Received!',
              color: 8346325, // Purple
              fields: [
                { name: 'Plan', value: plan.name, inline: true },
                { name: 'Amount', value: `₹${plan.priceINR}`, inline: true },
                { name: 'Email', value: email, inline: false },
                { name: 'Transaction ID', value: transactionId, inline: false },
                { name: 'Order ID', value: order.id, inline: false },
              ],
              image: {
                url: fullImageUrl
              },
              timestamp: new Date().toISOString()
            }
          ]
        })
      } catch (webhookError) {
        console.error('Discord webhook failed:', webhookError)
        // Don't fail the order if webhook fails
      }
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
