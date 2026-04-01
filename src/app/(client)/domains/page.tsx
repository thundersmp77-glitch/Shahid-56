'use client'

import { useState } from 'react'
import { Search, Globe, CheckCircle, XCircle } from 'lucide-react'
import { PriceDisplay } from '@/src/components/PriceDisplay'
import axios from 'axios'

interface DomainResult {
  domain: string
  available: boolean
  priceINR?: number
  provider?: string
}

export default function DomainsPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DomainResult[]>([])
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    
    try {
      const res = await axios.get(`/api/domains/search?q=${encodeURIComponent(query)}`)
      setResults(res.data.results)
    } catch (error) {
      console.error('Domain search failed', error)
      // Fallback mock data if API fails or keys aren't set
      setResults([
        { domain: `${query}.com`, available: true, priceINR: 899, provider: 'Name.com' },
        { domain: `${query}.net`, available: true, priceINR: 799, provider: 'ResellerClub' },
        { domain: `${query}.org`, available: false },
        { domain: `${query}.io`, available: true, priceINR: 2999, provider: 'Name.com' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Find Your Perfect Domain</h1>
          <p className="text-xl text-zinc-400">Search for available domains across multiple providers.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl mb-12">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your domain name (e.g. myawesomeproject)"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/20 whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Search Domain'}
            </button>
          </form>
        </div>

        {searched && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-zinc-400">Checking availability across providers...</p>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                <ul className="divide-y divide-zinc-800">
                  {results.map((result, index) => (
                    <li key={index} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${result.available ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {result.available ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white flex items-center gap-2">
                            {result.domain}
                          </p>
                          {result.available && result.provider && (
                            <p className="text-sm text-zinc-500 mt-1 flex items-center gap-1">
                              <Globe size={14} /> Provided by {result.provider}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 sm:justify-end">
                        {result.available ? (
                          <>
                            <div className="text-right">
                              <PriceDisplay amountINR={result.priceINR || 0} className="text-2xl font-bold text-white block" />
                              <span className="text-xs text-zinc-500">/year</span>
                            </div>
                            <button className="px-6 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-lg transition-colors">
                              Select
                            </button>
                          </>
                        ) : (
                          <span className="text-zinc-500 font-medium px-4 py-2 bg-zinc-950 rounded-lg border border-zinc-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
