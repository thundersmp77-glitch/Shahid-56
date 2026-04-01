'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export function ProfileForm({ user }: { user: any }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setSaving(true)

    try {
      await axios.put('/api/admin/profile', { currentPassword, newPassword })
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 mb-1">Admin Email</p>
        <p className="text-lg font-bold text-white">{user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2">Change Password</h3>
        
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Current Password</label>
          <input 
            type="password" 
            value={currentPassword} 
            onChange={e => setCurrentPassword(e.target.value)} 
            required
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
            placeholder="••••••••" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            required
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
            placeholder="••••••••" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required
            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" 
            placeholder="••••••••" 
          />
        </div>

        <div className="pt-6 border-t border-zinc-800">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}
