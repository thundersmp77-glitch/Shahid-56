import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@syntaxhost.com' },
    update: {},
    create: {
      email: 'admin@syntaxhost.com',
      password: adminPassword,
      name: 'Admin',
      isAdmin: true,
    },
  })
  console.log('Admin user created:', admin.email)

  // Create Settings
  await prisma.settings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      discordWebhook: '',
      panelUrl: 'https://panel.syntaxhost.com',
      discordUrl: 'https://discord.gg/V5tVyazx4H',
      youtubeUrl: 'https://youtube.com/@syntaxhost',
      instagramUrl: 'https://instagram.com/syntaxhost',
      supportEmail: 'support@syntaxhost.com',
    },
  })
  console.log('Global settings created')

  // Create Sample Plans
  const plans = [
    {
      name: 'Starter VPS',
      type: 'VPS',
      ram: '2 GB',
      cpu: '1 vCore',
      storage: '20 GB NVMe',
      priceINR: 299,
      features: JSON.stringify(['1 IPv4 Address', 'DDoS Protection', '1Gbps Port']),
    },
    {
      name: 'Pro VPS',
      type: 'VPS',
      ram: '8 GB',
      cpu: '4 vCores',
      storage: '100 GB NVMe',
      priceINR: 999,
      features: JSON.stringify(['1 IPv4 Address', 'DDoS Protection', '1Gbps Port', 'Priority Support']),
    },
    {
      name: 'Starter VDS',
      type: 'VDS',
      ram: '16 GB',
      cpu: '4 Dedicated Cores',
      storage: '250 GB NVMe',
      priceINR: 2499,
      features: JSON.stringify(['Dedicated Resources', '1 IPv4 Address', 'DDoS Protection', '1Gbps Port']),
    },
    {
      name: 'Pro VDS',
      type: 'VDS',
      ram: '32 GB',
      cpu: '8 Dedicated Cores',
      storage: '500 GB NVMe',
      priceINR: 4499,
      features: JSON.stringify(['Dedicated Resources', '1 IPv4 Address', 'DDoS Protection', '1Gbps Port', 'Priority Support']),
    },
    {
      name: 'Dirt Minecraft',
      type: 'MINECRAFT',
      ram: '4 GB',
      cpu: '2 vCores',
      storage: '50 GB NVMe',
      priceINR: 399,
      features: JSON.stringify(['Pterodactyl Panel', 'DDoS Protection', 'Unlimited Slots', 'Free Subdomain']),
    },
    {
      name: 'Diamond Minecraft',
      type: 'MINECRAFT',
      ram: '16 GB',
      cpu: '4 vCores',
      storage: '150 GB NVMe',
      priceINR: 1299,
      features: JSON.stringify(['Pterodactyl Panel', 'DDoS Protection', 'Unlimited Slots', 'Free Subdomain', 'Dedicated IP']),
    },
  ]

  for (const plan of plans) {
    await prisma.plan.create({
      data: plan,
    })
  }
  console.log('Sample plans created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
