'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState({
    discordWebhook: initialSettings.discordWebhook || '',
    panelUrl: initialSettings.panelUrl || '',
    discordUrl: initialSettings.discordUrl || '',
    youtubeUrl: initialSettings.youtubeUrl || '',
    instagramUrl: initialSettings.instagramUrl || '',
    supportEmail: initialSettings.supportEmail || '',
    resellerClubKey: initialSettings.resellerClubKey || '',
    nameComKey: initialSettings.nameComKey || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await axios.put('/api/admin/settings', formData)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2">Integrations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Discord Webhook URL</label>
              <input 
                type="url" 
                value={formData.discordWebhook} 
                onChange={e => setFormData({...formData, discordWebhook: e.target.value})} 
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="https://discord.com/api/webhooks/..." 
              />
              <p className="text-xs text-zinc-500 mt-1">Used for sending new order notifications to your Discord server.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2 mt-8">Platform Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Client Panel URL</label>
              <input 
                type="url" 
                value={formData.panelUrl} 
                onChange={e => setFormData({...formData, panelUrl: e.target.value})} 
                required
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="https://panel.syntaxhost.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Support Email</label>
              <input 
                type="email" 
                value={formData.supportEmail} 
                onChange={e => setFormData({...formData, supportEmail: e.target.value})} 
                required
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="support@syntaxhost.com" 
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2 mt-8">Social Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Discord Invite URL</label>
              <input 
                type="url" 
                value={formData.discordUrl} 
                onChange={e => setFormData({...formData, discordUrl: e.target.value})} 
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="https://discord.gg/..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">YouTube URL</label>
              <input 
                type="url" 
                value={formData.youtubeUrl} 
                onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} 
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="https://youtube.com/..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Instagram URL</label>
              <input 
                type="url" 
                value={formData.instagramUrl} 
                onChange={e => setFormData({...formData, instagramUrl: e.target.value})} 
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="https://instagram.com/..." 
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2 mt-8">Domain Providers API</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">ResellerClub API Key</label>
              <input 
                type="password" 
                value={formData.resellerClubKey} 
                onChange={e => setFormData({...formData, resellerClubKey: e.target.value})} 
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="Enter ResellerClub API Key" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Name.com API Key</label>
              <input 
                type="password" 
                value={formData.nameComKey} 
                onChange={e => setFormData({...formData, nameComKey: e.target.value})} 
                className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
                placeholder="Enter Name.com API Key" 
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
