'use client'

import { useCurrency } from './CurrencyContext'

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="INR">INR (₹)</option>
      <option value="USD">USD ($)</option>
      <option value="EUR">EUR (€)</option>
    </select>
  )
}
