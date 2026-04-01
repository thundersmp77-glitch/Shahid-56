import Link from 'next/link'
import { prisma } from '@/src/lib/prisma'
import { Server, Shield, Zap } from 'lucide-react'
import { PriceDisplay } from '@/src/components/PriceDisplay'

export default async function Home() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { priceINR: 'asc' }
  })


  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-zinc-950/0 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Next-Gen <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">SaaS Hosting</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            High-performance VPS, VDS, and Minecraft servers built for speed, security, and reliability.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/plans" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-500/25">
              View Plans
            </Link>
            <Link href="/reviews" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors border border-zinc-700">
              Read Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-zinc-900/50 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-zinc-400">Powered by NVMe SSDs and high-frequency processors for maximum performance.</p>
            </div>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">DDoS Protection</h3>
              <p className="text-zinc-400">Enterprise-grade DDoS mitigation to keep your services online 24/7.</p>
            </div>
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <Server size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">99.9% Uptime</h3>
              <p className="text-zinc-400">Reliable infrastructure backed by our industry-leading uptime guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Plans</h2>
            <p className="text-zinc-400">Start your journey with our most popular hosting packages.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const features = JSON.parse(plan.features) as string[]
              return (
                <div key={plan.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col hover:border-purple-500/50 transition-colors">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                      {plan.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <PriceDisplay amountINR={plan.priceINR} className="text-4xl font-extrabold text-white" />
                    <span className="text-zinc-400">/mo</span>
                  </div>

                  
                  <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center text-zinc-300">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                      {plan.ram} RAM
                    </li>
                    <li className="flex items-center text-zinc-300">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                      {plan.cpu} CPU
                    </li>
                    <li className="flex items-center text-zinc-300">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                      {plan.storage} Storage
                    </li>
                    {features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center text-zinc-300">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={`/plans/${plan.id}`} className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors text-center border border-zinc-700">
                    View Details
                  </Link>
                </div>
              )
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/plans" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              View all plans &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
