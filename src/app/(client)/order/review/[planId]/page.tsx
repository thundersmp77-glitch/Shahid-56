import { prisma } from '@/src/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/src/lib/auth'
import { PriceDisplay } from '@/src/components/PriceDisplay'

export default async function OrderReviewPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const user = await getUser()

  if (!user) {
    redirect(`/login?redirect=/order/review/${planId}`)
  }

  const plan = await prisma.plan.findUnique({
    where: { id: planId }
  })

  if (!plan) {
    notFound()
  }

  const features = JSON.parse(plan.features) as string[]

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Review Your Order</h1>
          <p className="text-zinc-400">Please review your plan details before proceeding to payment.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-8 border-b border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
            <p className="text-purple-400 font-medium">{plan.type} Hosting</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Plan Specifications</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">RAM</span>
                  <span className="font-medium text-white">{plan.ram}</span>
                </li>
                <li className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">CPU</span>
                  <span className="font-medium text-white">{plan.cpu}</span>
                </li>
                <li className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Storage</span>
                  <span className="font-medium text-white">{plan.storage}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Features</h3>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center text-zinc-300 text-sm">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 bg-zinc-950/50 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Total Amount (Monthly)</p>
              <PriceDisplay amountINR={plan.priceINR} className="text-4xl font-extrabold text-white" />
            </div>
            
            <Link href={`/order/payment/${plan.id}`} className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors text-center shadow-lg shadow-purple-500/20">
              Proceed to Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
