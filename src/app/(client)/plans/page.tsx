import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'
import { PriceDisplay } from '@/src/components/PriceDisplay'

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceINR: 'asc' }
  })

  const vpsPlans = plans.filter(p => p.type === 'VPS')
  const vdsPlans = plans.filter(p => p.type === 'VDS')
  const mcPlans = plans.filter(p => p.type === 'MINECRAFT')

  const renderPlanGroup = (title: string, groupPlans: typeof plans) => (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groupPlans.map((plan) => {
          const features = JSON.parse(plan.features) as string[]
          return (
            <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-purple-500/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <PriceDisplay amountINR={plan.priceINR} className="text-4xl font-extrabold text-white" />
                <span className="text-zinc-400">/mo</span>
              </div>

              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center text-zinc-300">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                  <span className="font-medium text-white mr-1">RAM:</span> {plan.ram}
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                  <span className="font-medium text-white mr-1">CPU:</span> {plan.cpu}
                </li>
                <li className="flex items-center text-zinc-300">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                  <span className="font-medium text-white mr-1">Storage:</span> {plan.storage}
                </li>
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center text-zinc-400">
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href={`/plans/${plan.id}`} className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-center shadow-lg shadow-purple-500/20">
                Order Now
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Our Hosting Plans
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include 24/7 support and 99.9% uptime guarantee.
          </p>
        </div>

        {vpsPlans.length > 0 && renderPlanGroup('VPS Hosting', vpsPlans)}
        {vdsPlans.length > 0 && renderPlanGroup('VDS Hosting', vdsPlans)}
        {mcPlans.length > 0 && renderPlanGroup('Minecraft Hosting', mcPlans)}
      </div>
    </div>
  )
}
