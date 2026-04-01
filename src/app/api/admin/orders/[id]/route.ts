import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getUser } from '@/src/lib/auth'
import { sendEmail } from '@/src/lib/email'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUser()
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { status } = await req.json()
    
    const order = await prisma.order.update({ 
      where: { id }, 
      data: { status },
      include: { user: true, plan: true }
    })
    
    // If approved, send email to user
    if (status === 'APPROVED') {
      const settings = await prisma.settings.findFirst()
      const panelUrl = settings?.panelDomain || 'https://panel.syntaxhost.com'
      
      const emailBody = `
Hello ${order.user.name || 'Customer'},

Your order for ${order.plan.name} has been approved!

Here are your server details:
- Plan: ${order.plan.name}
- RAM: ${order.plan.ram}
- CPU: ${order.plan.cpu}
- Storage: ${order.plan.storage}

Client Panel Access:
URL: ${panelUrl}
Email: ${order.user.email}
Password: (The password you used to register on our site)

Thank you for choosing SyntaxHost!
      `.trim()
      
      await sendEmail(
        order.user.email,
        `Order Approved: ${order.plan.name}`,
        emailBody
      )
    }
    
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
