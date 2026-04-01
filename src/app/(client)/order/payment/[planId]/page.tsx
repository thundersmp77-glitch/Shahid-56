'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import Image from 'next/image'
import { PriceDisplay } from '@/src/components/PriceDisplay'

export default function PaymentPage({ params }: { params: Promise<{ planId: string }> }) {
  const [planId, setPlanId] = useState<string>('')
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [email, setEmail] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const router = useRouter()

  const fetchPlan = async (id: string) => {
    try {
      const res = await axios.get(`/api/plans/${id}`)
      setPlan(res.data)
    } catch (error) {
      toast.error('Failed to load plan details')
      router.push('/plans')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    params.then(p => {
      setPlanId(p.planId)
      fetchPlan(p.planId)
    })
  }, [params])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!screenshot) {
      toast.error('Please upload a screenshot of your payment')
      return
    }

    setSubmitting(true)
    const formData = new FormData()
    formData.append('planId', planId)
    formData.append('transactionId', transactionId)
    formData.append('email', email)
    formData.append('screenshot', screenshot)

    try {
      await axios.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Order placed successfully! We will verify it shortly.')
      router.push('/')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>
  if (!plan) return null

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
          <p className="text-zinc-400">Scan the QR code below and submit your payment details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* QR Code Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Scan and Pay <PriceDisplay amountINR={plan.priceINR} />
            </h2>
            
            <div className="bg-white p-4 rounded-xl mb-6 shadow-lg">
              {/* Placeholder QR Code - In a real app, generate a dynamic UPI QR */}
              <Image 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=syntaxhost@upi&pn=SyntaxHost&am=${plan.priceINR}&cu=INR`} 
                alt="Payment QR Code" 
                width={250} 
                height={250}
                className="rounded-lg"
                unoptimized
              />
            </div>
            
            <p className="text-sm text-zinc-400 max-w-xs">
              Use any UPI app (GPay, PhonePe, Paytm) to scan and pay the exact amount.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Submit Payment Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Where should we send the server details?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Transaction ID / UTR</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="e.g. 312345678901"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Payment Screenshot</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-xl hover:border-purple-500/50 transition-colors bg-zinc-950">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-zinc-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-zinc-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-zinc-950 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg,image/png" onChange={(e) => setScreenshot(e.target.files?.[0] || null)} required />
                      </label>
                    </div>
                    <p className="text-xs text-zinc-500">PNG, JPG up to 5MB</p>
                    {screenshot && <p className="text-sm text-green-400 mt-2 font-medium">{screenshot.name}</p>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/20"
              >
                {submitting ? 'Submitting...' : 'I Have Paid'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
