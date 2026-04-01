import { prisma } from '@/src/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, Server, Cpu, HardDrive } from 'lucide-react'
import { PriceDisplay } from '@/src/components/PriceDisplay'

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const plan = await prisma.plan.findUnique({
    where: { id }
  })

  if (!plan) {
    notFound()
  }

  const features = JSON.parse(plan.features) as string[]

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12 border-b border-zinc-800 bg-gradient-to-b from-purple-900/10 to-zinc-900">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                  {plan.type} HOSTING
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{plan.name}</h1>
                <p className="text-zinc-400 text-lg">High-performance hosting for your next big project.</p>
              </div>
              <div className="text-left md:text-right">
                <div className="flex items-baseline gap-2">
                  <PriceDisplay amountINR={plan.priceINR} className="text-5xl font-extrabold text-white" />
                  <span className="text-zinc-400 text-xl">/mo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Hardware Specs</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center shrink-0">
                    <Server size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 font-medium">RAM</p>
                    <p className="text-lg font-bold text-white">{plan.ram}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center shrink-0">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 font-medium">CPU</p>
                    <p className="text-lg font-bold text-white">{plan.cpu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center shrink-0">
                    <HardDrive size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 font-medium">Storage</p>
                    <p className="text-lg font-bold text-white">{plan.storage}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Features Included</h3>
              <ul className="space-y-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-purple-400" />
                    </div>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 md:p-12 border-t border-zinc-800 bg-zinc-950/50 text-center">
            <Link href={`/order/review/${plan.id}`} className="inline-block w-full md:w-auto px-12 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-colors shadow-xl shadow-purple-500/20">
              Proceed to Order
            </Link>
            <p className="mt-4 text-sm text-zinc-500">Instant setup after payment verification.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
