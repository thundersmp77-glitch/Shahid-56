import { prisma } from '@/src/lib/prisma'
import { PlansTable } from './PlansTable'

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Plans</h1>
      </div>
      
      <PlansTable initialPlans={plans} />
    </div>
  )
}
