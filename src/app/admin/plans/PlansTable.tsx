'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PlansTable({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    type: 'VPS',
    ram: '',
    cpu: '',
    storage: '',
    priceINR: 0,
    features: '',
    isActive: true
  })

  const handleOpenModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan)
      setFormData({
        ...plan,
        features: JSON.parse(plan.features).join('\n')
      })
    } else {
      setEditingPlan(null)
      setFormData({
        name: '',
        type: 'VPS',
        ram: '',
        cpu: '',
        storage: '',
        priceINR: 0,
        features: '',
        isActive: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPlan(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const featuresArray = formData.features.split('\n').filter(f => f.trim() !== '')
    const payload = {
      ...formData,
      priceINR: Number(formData.priceINR),
      features: JSON.stringify(featuresArray)
    }

    try {
      if (editingPlan) {
        await axios.put(`/api/admin/plans/${editingPlan.id}`, payload)
        toast.success('Plan updated')
      } else {
        await axios.post('/api/admin/plans', payload)
        toast.success('Plan created')
      }
      handleCloseModal()
      router.refresh()
      // In a real app, we might refetch data here, but router.refresh() works for Server Components
      // We can also update local state for immediate feedback
      window.location.reload()
    } catch (error) {
      toast.error('Failed to save plan')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      await axios.delete(`/api/admin/plans/${id}`)
      toast.success('Plan deleted')
      setPlans(plans.filter(p => p.id !== id))
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete plan')
    }
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
        >
          <Plus size={18} /> Add New Plan
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price (INR)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{plan.name}</td>
                  <td className="px-6 py-4">{plan.type}</td>
                  <td className="px-6 py-4">₹{plan.priceINR}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${plan.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(plan)} className="text-blue-400 hover:text-blue-300 mr-4 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No plans found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
              <h2 className="text-xl font-bold text-white">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
              <button onClick={handleCloseModal} className="text-zinc-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500">
                    <option value="VPS">VPS</option>
                    <option value="VDS">VDS</option>
                    <option value="MINECRAFT">Minecraft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">RAM</label>
                  <input type="text" value={formData.ram} onChange={e => setFormData({...formData, ram: e.target.value})} required placeholder="e.g. 8 GB" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">CPU</label>
                  <input type="text" value={formData.cpu} onChange={e => setFormData({...formData, cpu: e.target.value})} required placeholder="e.g. 4 vCores" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Storage</label>
                  <input type="text" value={formData.storage} onChange={e => setFormData({...formData, storage: e.target.value})} required placeholder="e.g. 100 GB NVMe" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Price (INR)</label>
                  <input type="number" value={formData.priceINR} onChange={e => setFormData({...formData, priceINR: Number(e.target.value)})} required min="0" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Features (One per line)</label>
                <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} required rows={5} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-white focus:ring-2 focus:ring-purple-500 resize-none" placeholder="1 IPv4 Address&#10;DDoS Protection&#10;1Gbps Port" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded bg-zinc-950 border-zinc-800 text-purple-600 focus:ring-purple-500" />
                <label htmlFor="isActive" className="text-sm font-medium text-zinc-300">Active (Visible to customers)</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
