import { prisma } from '@/src/lib/prisma'
import { SettingsForm } from './SettingsForm'

export default async function AdminSettingsPage() {
  let settings = await prisma.settings.findUnique({ where: { id: 'global' } })
  
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: 'global',
        panelUrl: 'https://panel.syntaxhost.com',
        discordUrl: 'https://discord.gg/V5tVyazx4H',
        youtubeUrl: 'https://youtube.com/@syntaxhost',
        instagramUrl: 'https://instagram.com/syntaxhost',
        supportEmail: 'support@syntaxhost.com',
      }
    })
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Global Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your platform's dynamic links and integrations.</p>
      </div>
      
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
